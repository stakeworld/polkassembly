// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { OnchainBountyFragment, OnchainChildBountyFragment, OnchainMotionFragment, OnchainProposalFragment, OnchainReferendumFragment, OnchainTechCommitteeProposalFragment, OnchainTipFragment, OnchainTreasuryProposalFragment } from './generated/chain-db-graphql';
import { DiscussionBountyFragment, DiscussionChildBountyFragment, DiscussionMotionFragment, DiscussionProposalFragment, DiscussionReferendumFragment, DiscussionTechCommitteeProposalFragment, DiscussionTipFragment, DiscussionTreasuryProposalFragment } from './generated/discussion-db-graphql';

export interface OnchainSyncData {
    fellowshipReferendum?: Array<any | null> | null;
    motions?: Array<OnchainMotionFragment | null> | null;
    proposals?: Array<OnchainProposalFragment | null> | null;
    referenda?: Array<OnchainReferendumFragment | null> | null;
    referendumV2?: Array<any | null> | null;
    tips?: Array<OnchainTipFragment | null> | null;
    treasuryProposals?: Array<OnchainTreasuryProposalFragment | null> | null;
    bounties?: Array<OnchainBountyFragment | null> | null;
    childBounties?: Array<OnchainChildBountyFragment | null> | null;
    techCommitteeProposals?: Array<OnchainTechCommitteeProposalFragment | null> | null;
}

export interface DiscussionSyncData {
    motions?: Array<DiscussionMotionFragment | null> | null;
    proposals?: Array<DiscussionProposalFragment | null> | null;
    referenda?: Array<DiscussionReferendumFragment | null> | null;
    referendumV2?: Array<any | null> | null;
    fellowshipReferendum?: Array<any | null> | null;
    tips?: Array<DiscussionTipFragment | null> | null;
    treasuryProposals?: Array<DiscussionTreasuryProposalFragment | null> | null;
    bounties?: Array<DiscussionBountyFragment | null> | null;
    childBounties?: Array<DiscussionChildBountyFragment | null> | null;
    techCommitteeProposals?: Array<DiscussionTechCommitteeProposalFragment | null> | null;
}

export interface SyncData {
    discussion: DiscussionSyncData;
    onchain: OnchainSyncData;
}

export interface SyncMap {
    onchain: OnchainSyncMap;
    discussion: DiscussionSyncMap;
}

export interface OnchainSyncMap {
    motions?: MotionObjectMap;
    proposals?: ObjectMap;
    referenda?: ReferendumObjectMap;
    referendumV2?: ReferendumV2ObjectMap;
    fellowshipReferendum?: FellowshipReferendumObjectMap;
    tips?: ObjectMap;
    bounties?: ObjectMap;
    childBounties?: ObjectMap;
    treasuryProposals?: ObjectMap;
    techCommitteeProposals?: ObjectMap;
}

export interface OnchainReferendaValueSyncType {
    preimageHash: string;
    blockCreationNumber: number;
}

export interface OnchainReferendaV2ValueSyncType {
    preimageHash: string;
    blockCreationNumber: number;
    trackNumber: number;
    origin: string;
    author: string;
    status: string;
}

export interface OnchainFellowshipReferendaValueSyncType {
    preimageHash: string;
    blockCreationNumber: number;
    trackNumber: number;
    origin: string;
    author: string;
    status: string;
}

export interface OnchainMotionSyncType {
    author: string;
    treasuryProposalId?: number;
    section: string;
}

export interface DiscussionSyncMap {
    motions?: ObjectMap;
    proposals?: ObjectMap;
    referenda?: ObjectMap;
    referendumV2?: ObjectMap;
    fellowshipReferendum?: ObjectMap;
    tips?: ObjectMap;
    bounties?: ObjectMap;
    childBounties?: ObjectMap;
    treasuryProposals?: ObjectMap;
    techCommitteeProposals?: ObjectMap;
}

export type TreasuryDeduplicateMotionMap = Record<number, number[]>;

export type ObjectMap = {[index: string]: string};
export type MotionObjectMap = {[index: string]: OnchainMotionSyncType};
export type ReferendumObjectMap = {[index: string]: OnchainReferendaValueSyncType};
export type ReferendumV2ObjectMap = {[index: string]: OnchainReferendaV2ValueSyncType};
export type FellowshipReferendumObjectMap = {[index: string]: OnchainFellowshipReferendaValueSyncType};
