// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import chalk from 'chalk';

import {
	addDiscussionPostAndBounty,
	addDiscussionPostAndChildBounty,
	addDiscussionPostAndMotion,
	addDiscussionPostAndProposal,
	addDiscussionPostAndReferendumV2,
	addDiscussionPostAndTechCommitteeProposal,
	addDiscussionPostAndTip,
	addDiscussionPostAndTreasuryProposal,
	addDiscussionReferendum,
	updateTreasuryProposalWithMotion
} from '../graphql_helpers';
import { MotionObjectMap, ObjectMap, OnchainMotionSyncType, ReferendumObjectMap, ReferendumV2ObjectMap, SyncData, TreasuryDeduplicateMotionMap } from '../types';
import {
	getDiscussionBounties,
	getDiscussionChildBounties,
	getDiscussionMotions,
	getDiscussionProposals,
	getDiscussionReferenda,
	getDiscussionReferendumV2,
	getDiscussionTechCommitteeProposals,
	getDiscussionTips,
	getDiscussionTreasuryProposals,
	getOnChainBounties,
	getOnChainChildBounties,
	getOnChainMotions,
	getOnChainProposals,
	getOnchainReferenda,
	getOnChainReferendumV2s,
	getOnChainTechCommitteeProposals,
	getOnChainTips,
	getOnChainTreasuryProposals
} from './getter';
import { getMaps } from './utils';

const getSyncData = async (): Promise<SyncData | undefined> => {
	try {
		const discussionMotions = await getDiscussionMotions();
		const discussionProposals = await getDiscussionProposals();
		const discussionReferenda = await getDiscussionReferenda();
		const discussionReferendumV2 = await getDiscussionReferendumV2();
		const discussionTreasuryProposals = await getDiscussionTreasuryProposals();
		const discussionTips = await getDiscussionTips();
		const discussionBounties = await getDiscussionBounties();
		const discussionChildBounties = await getDiscussionChildBounties();
		const discussionTechCommitteeProposals = await getDiscussionTechCommitteeProposals();

		const onChainMotions = await getOnChainMotions();
		const onChainProposals = await getOnChainProposals();
		const onchainReferenda = await getOnchainReferenda();
		const onchainReferendumV2s = await getOnChainReferendumV2s();
		const onChainTreasuryProposals = await getOnChainTreasuryProposals();
		const onChainTips = await getOnChainTips();
		const onChainBounties = await getOnChainBounties();
		const onChainChildBounties = await getOnChainChildBounties();
		const onChainTechCommitteeProposals = await getOnChainTechCommitteeProposals();

		return {
			discussion: {
				bounties: discussionBounties,
				childBounties: discussionChildBounties,
				motions: discussionMotions,
				proposals: discussionProposals,
				referenda: discussionReferenda,
				referendumV2: discussionReferendumV2,
				techCommitteeProposals: discussionTechCommitteeProposals,
				tips: discussionTips,
				treasuryProposals: discussionTreasuryProposals

			},
			onchain: {
				bounties: onChainBounties,
				childBounties: onChainChildBounties,
				motions: onChainMotions,
				proposals: onChainProposals,
				referenda: onchainReferenda,
				referendumV2: onchainReferendumV2s,
				techCommitteeProposals: onChainTechCommitteeProposals,
				tips: onChainTips,
				treasuryProposals: onChainTreasuryProposals
			}
		};
	} catch (err) {
		console.error(chalk.red('getSyncData execution error'), err);
	}
};

const syncTips = async (onChainTips: ObjectMap, discussionTips: ObjectMap): Promise<void[]> => {
	return Promise.all(Object.entries(onChainTips).map(async ([key, author]) => {
		// if this tip doesn't exist in the discussion DB
		if (!discussionTips[key]) {
			await addDiscussionPostAndTip({ onchainTipHash: key, proposer: author });
		}
	}));
};

const syncBounties = async (onChainBounties: ObjectMap, discussionBounties: ObjectMap): Promise<void[]> => {
	return Promise.all(Object.entries(onChainBounties).map(async ([key, author]) => {
		// if this bounty doesn't exist in the discussion DB
		if (!discussionBounties[key]) {
			await addDiscussionPostAndBounty({ onchainBountyId: Number(key), proposer: author });
		}
	}));
};

const syncChildBounties = async (onChainChildBounties: ObjectMap, discussionChildBounties: ObjectMap): Promise<void[]> => {
	return Promise.all(Object.entries(onChainChildBounties).map(async ([key, author]) => {
		// if this child bounty doesn't exist in the discussion DB
		if (!discussionChildBounties[key]) {
			await addDiscussionPostAndChildBounty({ onchainChildBountyId: Number(key), proposer: author });
		}
	}));
};

const syncTreasuryProposals = async (onchainTreasuryProposals: ObjectMap, discussionTreasuryProposals: ObjectMap): Promise<void[]> => {
	return Promise.all(Object.entries(onchainTreasuryProposals).map(async ([key, author]) => {
		// if this treasuryproposal doesn't exist in the discussion DB
		if (!discussionTreasuryProposals[key]) {
			await addDiscussionPostAndTreasuryProposal({ onchainTreasuryProposalId: Number(key), proposer: author });
		}
	}));
};

const syncTechCommitteeProposals = async (onChainTechCommitteeProposals: ObjectMap, discussionTechCommitteeProposals: ObjectMap): Promise<void[]> => {
	return Promise.all(Object.entries(onChainTechCommitteeProposals).map(async ([key, author]) => {
		// if this techCommitteeProposal doesn't exist in the discussion DB
		if (!discussionTechCommitteeProposals[key]) {
			await addDiscussionPostAndTechCommitteeProposal({ onchainTechCommitteeProposalId: Number(key), proposer: author });
		}
	}));
};

const syncMotions = async (onchainMotions: MotionObjectMap, discussionMotions: ObjectMap, treasuryDeduplicatedMotionsMap: TreasuryDeduplicateMotionMap): Promise<void[]> => {
	return Promise.all(Object.entries(onchainMotions).map(async ([key, val]: [string, OnchainMotionSyncType]) => {
		// the same treasury id might have several motions attached to it.
		// only the last motion should be added to the discussion db

		// if this motion doesn't exist in the discussion DB
		if (!discussionMotions[key]) {
			// if this motion is associated to a treasury proposal
			if (val.treasuryProposalId || val.treasuryProposalId === 0) {
				const latestMotion = Math.max(...treasuryDeduplicatedMotionsMap[val.treasuryProposalId]);
				// and it's the latest motion associated to this treasury
				if (Number(key) === latestMotion) {
					await updateTreasuryProposalWithMotion({
						onchainMotionProposalId: Number(key),
						onchainTreasuryProposalId: val.treasuryProposalId
					});
				}
			} else {
				await addDiscussionPostAndMotion({
					onchainMotionProposalId: Number(key),
					proposer: val.author
				});
			}
		}
	}));
};

const syncProposals = async (onchainProposals: ObjectMap, discussionProposals: ObjectMap): Promise<void[]> => {
	return Promise.all(Object.entries(onchainProposals).map(async ([key, author]) => {
		// if this proposal doesn't exist in the discussion DB
		if (!discussionProposals[key]) {
			await addDiscussionPostAndProposal({ onchainProposalId: Number(key), proposer: author });
		}
	}));
};

const syncReferenda = async (onchainReferenda: ReferendumObjectMap, discussionReferenda: ObjectMap): Promise<void[]> => {
	return Promise.all(
		Object.keys(onchainReferenda).map(async (key) => {
			// If this referendum doesn't exist in the discussion DB
			if (!discussionReferenda[key]) {
				if (!onchainReferenda[key].blockCreationNumber) {
					throw new Error(`No blockCreationNumber found for referendum id: ${key}`);
				}

				await addDiscussionReferendum({
					preimageHash: onchainReferenda[key].preimageHash,
					referendumCreationBlockNumber: onchainReferenda[key].blockCreationNumber,
					referendumId: Number(key)
				});
			}
		}));
};

const syncReferendumV2 = async (onchainReferendaV2: ReferendumV2ObjectMap, discussionReferendaV2: ObjectMap): Promise<void[]> => {
	return Promise.all(
		Object.keys(onchainReferendaV2).map(async (key) => {
			// If this referendum doesn't exist in the discussion DB
			if (!discussionReferendaV2[key]) {
				await addDiscussionPostAndReferendumV2({
					origin: onchainReferendaV2[key].origin,
					proposer: onchainReferendaV2[key].author,
					referendumId: Number(key),
					status: onchainReferendaV2[key].status,
					trackNumber: onchainReferendaV2[key].trackNumber
				});
			}
		}));
};

const getTreasuryDeduplicatedMotionsMap = (motionObjectMap: MotionObjectMap): TreasuryDeduplicateMotionMap => {
	// this map will contain the treasury with the array of motions linked to it
	// eg: {
	// 14: [126, 128],
	// 15: [127, 129]
	// }

	const treasuryMap: TreasuryDeduplicateMotionMap = {};

	Object.entries(motionObjectMap).forEach(([key, value]) => {
		// we are only interrested in motions following a treasury
		if (value.treasuryProposalId || value.treasuryProposalId === 0) {
			const motionArray = treasuryMap[value.treasuryProposalId] || [];
			// add the motion to the deduplicated map
			treasuryMap[value.treasuryProposalId] = [...motionArray, Number(key)];
		}
	});

	return treasuryMap;
};

export const syncDBs = async (): Promise<void> => {
	try {
		const syncData = await getSyncData();
		const syncMaps = syncData && getMaps(syncData);

		syncMaps?.onchain?.proposals &&
		syncMaps?.discussion?.proposals &&
		await syncProposals(syncMaps.onchain.proposals, syncMaps.discussion.proposals);

		syncMaps?.onchain?.treasuryProposals &&
		syncMaps?.discussion?.treasuryProposals &&
		await syncTreasuryProposals(syncMaps.onchain.treasuryProposals, syncMaps.discussion.treasuryProposals);

		syncMaps?.onchain?.tips &&
		syncMaps?.discussion?.tips &&
		await syncTips(syncMaps.onchain.tips, syncMaps.discussion.tips);

		syncMaps?.onchain?.bounties &&
		syncMaps?.discussion?.bounties &&
		await syncBounties(syncMaps.onchain.bounties, syncMaps.discussion.bounties);

		syncMaps?.onchain?.childBounties &&
		syncMaps?.discussion?.childBounties &&
		await syncChildBounties(syncMaps.onchain.childBounties, syncMaps.discussion.childBounties);

		syncMaps?.onchain?.techCommitteeProposals &&
		syncMaps?.discussion?.techCommitteeProposals &&
		await syncTechCommitteeProposals(syncMaps.onchain.techCommitteeProposals, syncMaps.discussion.techCommitteeProposals);

		if (syncMaps?.onchain?.motions && syncMaps?.discussion?.motions) {
			const treasuryDeduplicatedMotionsMap = getTreasuryDeduplicatedMotionsMap(syncMaps.onchain.motions);
			await syncMotions(syncMaps.onchain.motions, syncMaps.discussion.motions, treasuryDeduplicatedMotionsMap);
		}

		syncMaps?.onchain?.referenda &&
		syncMaps?.discussion?.referenda &&
		await syncReferenda(syncMaps.onchain.referenda, syncMaps.discussion.referenda);

		syncMaps?.onchain?.referendumV2 &&
		syncMaps?.discussion?.referendumV2 &&
		await syncReferendumV2(syncMaps.onchain.referendumV2, syncMaps.discussion.referendumV2);

		console.log('✅ Syncing finished.');
	} catch (err) {
		console.error(chalk.red('syncDBs execution error'), err);
	}
};
