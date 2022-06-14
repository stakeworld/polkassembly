// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { web3Accounts, web3Enable,web3FromSource } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import styled from '@xstyled/styled-components';
import React, { useContext, useState } from 'react';
import { DropdownProps, Icon } from 'semantic-ui-react';
import { ApiContext } from 'src/context/ApiContext';
import { OnchainLinkBountyFragment, OnchainLinkMotionFragment, OnchainLinkProposalFragment, OnchainLinkReferendumFragment, OnchainLinkTechCommitteeProposalFragment, OnchainLinkTipFragment, OnchainLinkTreasuryProposalFragment } from 'src/generated/graphql';
import { APPNAME } from 'src/global/appName';
import { motionStatus, proposalStatus, referendumStatus, tipStatus } from 'src/global/statuses';
import { VoteThreshold } from 'src/types';
import { Form } from 'src/ui-components/Form';

import ExtensionNotDetected from '../../ExtensionNotDetected';
import MotionVoteInfo from './Motions/MotionVoteInfo';
import VoteMotion from './Motions/VoteMotion';
import ProposalDisplay from './Proposals';
import ReferendumVoteInfo from './Referenda/ReferendumVoteInfo';
import VoteReferendum from './Referenda/VoteReferendum';
import EndorseTip from './Tips/EndorseTip';
import TipInfo from './Tips/TipInfo';

interface Props {
	canEdit?: boolean | '' | undefined
	className?: string
	isBounty?: boolean
	isMotion?: boolean
	isProposal?: boolean
	isReferendum?: boolean
	isTreasuryProposal?: boolean
	isTipProposal?: boolean
	isTechCommitteeProposal?: boolean
	onchainId?: string | number | null
	onchainLink?: OnchainLinkTechCommitteeProposalFragment | OnchainLinkBountyFragment | OnchainLinkMotionFragment | OnchainLinkProposalFragment | OnchainLinkReferendumFragment | OnchainLinkTreasuryProposalFragment | OnchainLinkTipFragment
	status?: string
}

const GovenanceSideBar = ({ canEdit, className, isMotion, isProposal, isReferendum, isTipProposal, onchainId, onchainLink, status }: Props) => {
	const [address, setAddress] = useState<string>('');
	const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
	const [extensionNotFound, setExtensionNotFound] = useState(false);
	const [accountsNotFound, setAccountsNotFound] = useState(false);
	const { api, apiReady } = useContext(ApiContext);
	const [lastVote, setLastVote] = useState<string | null | undefined>(undefined);

	const canVote = !!status && !![proposalStatus.PROPOSED, referendumStatus.STARTED, motionStatus.PROPOSED, tipStatus.OPENED].includes(status);

	const onAccountChange = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		const addressValue = data.value as string;
		setAddress(addressValue);
	};

	const getAccounts = async (): Promise<undefined> => {
		if (!api) {
			return;
		}

		if (!apiReady) {
			return;
		}

		const extensions = await web3Enable(APPNAME);

		if (extensions.length === 0) {
			setExtensionNotFound(true);
			return;
		} else {
			setExtensionNotFound(false);
		}

		const accounts = await web3Accounts();

		if (accounts.length === 0) {
			setAccountsNotFound(true);
			return;
		} else {
			setAccountsNotFound(false);
		}

		setAccounts(accounts);
		if (accounts.length > 0) {
			setAddress(accounts[0].address);

			const injected = await web3FromSource(accounts[0].meta.source);

			api.setSigner(injected.signer);
		}

		return;
	};

	if (extensionNotFound) {
		return (
			<div className={className}>
				<div className='card'>
					<ExtensionNotDetected />
				</div>
			</div>
		);
	}

	if (accountsNotFound) {
		return (
			<div className={className}>
				<div className='card'>
					<div className='text-muted'>You need at least one account in Polkadot-js extenstion to use this feature.</div>
					<div className='text-muted'>Please reload this page after adding accounts.</div>
				</div>
			</div>
		);
	}

	return (
		<>
			{ canVote
				? <div className={className}>
					<Form standalone={false}>
						{isMotion && <>
							{(onchainId || onchainId === 0) &&
								<MotionVoteInfo
									motionId={onchainId as number}
								/>
							}
							{canVote &&
								<VoteMotion
									accounts={accounts}
									address={address}
									getAccounts={getAccounts}
									motionId={onchainId as number}
									motionProposalHash={(onchainLink as OnchainLinkMotionFragment)?.onchain_motion?.[0]?.motionProposalHash}
									onAccountChange={onAccountChange}
								/>
							}
						</>}
						{isProposal &&
							<ProposalDisplay
								accounts={accounts}
								address={address}
								canVote={canVote}
								getAccounts={getAccounts}
								onAccountChange={onAccountChange}
								proposalId={onchainId  as number}
								canEdit={canEdit}
							/>
						}
						{isReferendum &&
							<>
								{(onchainId || onchainId === 0) &&
									<ReferendumVoteInfo
										referendumId={onchainId as number}
										threshold={((onchainLink as OnchainLinkReferendumFragment).onchain_referendum[0]?.voteThreshold) as VoteThreshold}
										setLastVote={setLastVote}
									/>
								}

								<div className='vote-div vote-card'>
									{lastVote != undefined ? lastVote == null ?
										<div className='vote-reminder-text'>You haven&apos;t voted yet, vote now and do your bit for the community</div>
										:
										<div className='last-vote-text-cont'>
											You Voted: { lastVote == 'aye' ? <Icon name='thumbs up' className='green-text' /> : <Icon name='thumbs down' className='red-text' /> }
											<span className={`last-vote-text ${lastVote == 'aye' ? 'green-text' : 'red-text'}`}>{lastVote}</span>
										</div>
										: <div className="spacer"></div>
									}

									{canVote && <VoteReferendum
										lastVote={lastVote}
										setLastVote={setLastVote}
										accounts={accounts}
										address={address}
										getAccounts={getAccounts}
										onAccountChange={onAccountChange}
										referendumId={onchainId  as number}
									/>
									}
								</div>
							</>
						}
						{isTipProposal && canVote &&
						<div>
							<TipInfo onChainId={onchainId as string}/>
							<EndorseTip
								accounts={accounts}
								address={address}
								getAccounts={getAccounts}
								tipHash={onchainId as string}
								onAccountChange={onAccountChange}
							/>
						</div>
						}
					</Form>
				</div>
				: null
			}
		</>
	);
};

export default styled(GovenanceSideBar)`

	@media only screen and (max-width: 768px) {
		.ui.form {
			padding: 0rem;
		}
	}

	.vote-div {

		&.vote-card {
			background: #fff;
			padding: 14px 28px;
			box-shadow: rgba(83, 89, 92, 0.15) 0px 2px 4px 0px;
		}
		
		.vote-reminder-text, .last-vote-text-cont {
			color: #000000;
			font-size: 16px;
			margin-bottom: 16px;
			display: flex;
			align-items: center;

			.green-text {
				color: #4DD18F;
			}

			.red-text {
				color: #D94C3D;
			}
			
			.icon {
				margin-left: 12px;
				margin-right: 4px;
				margin-top: -4px;
			}

			.last-vote-text {
				text-transform: capitalize;
				font-weight: 500;
			}

			.last-vote-date {
				font-size: 14px;
				font-weight: 400;
				color: #909090;
				margin-left: 6px;
			}
		}

		.spacer {
			margin-top: 9px;
		}
	}
`;
