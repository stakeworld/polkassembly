// Copyright 2018-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import createBlockNumber from './createBlockNumber';
import createCouncil from './createCouncil';
// import createEra from './createEra';
import createMotion from './createMotion';
import createMotionStatus from './createMotionStatus';
// import createNominationAndValidators from './createNominationAndValidators';
// import createOfflineValidator from './createOfflineValidator';
import createPreimage from './createPreimage';
import createProposal from './createProposal';
import createProposalStatus from './createProposalStatus';
import createReferendum from './createReferendum';
import createReferendumStatus from './createReferendumStatus';
// import createReward from './createReward';
// import createSession from './createSession';
// import createSlashing from './createSlashing';
// import createStake from './createStake';
// import createTotalIssuance from './createTotalIssuance';
import createTip from './createTip';
import createTipStatus from './createTipStatus';
import createBounty from './createBounty';
import createBountyStatus from './createBountyStatus';
import createChildBounty from './createChildBounty';
import createChildBountyStatus from './createChildBountyStatus';
import createTreasury from './createTreasury';
import createTechCommitteeProposal from './createTechCommitteeProposal';
import createTechCommitteeProposalStatus from './createTechCommitteeProposalStatus';
import createCouncilMotionVotes from './createCouncilMotionVotes';
import createReferendumVote from './createReferendumVotes';
import { NomidotTask } from './types';
import createReferendumV2 from './createReferendumV2Submitted';
import createReferendumStatusV2 from './createReferendumStatusV2';
import createPreimageV2 from './createPreimageV2';
import updateReferendumV2 from './updateReferendumV2Decision';
// N.B. Order of tasks matters here
export const nomidotTasks: NomidotTask[] = [
  createBlockNumber,
  createCouncil,
//   createSession,
//   createStake,
//   createOfflineValidator,
//   createReward,
//   createEra,
//   createSlashing,
//   createTotalIssuance,
//   createNominationAndValidators,
  createPreimage,
  createProposal,
  createProposalStatus,
  createReferendum,
  createReferendumStatus,
  createMotion,
  createMotionStatus,
  createTreasury,
  createTip,
  createTipStatus,
  createBounty,
  createBountyStatus,
  createTechCommitteeProposal,
  createTechCommitteeProposalStatus,
  createChildBounty,
  createChildBountyStatus,
  createCouncilMotionVotes,
  createReferendumVote,
  createPreimageV2,
  createReferendumV2,
  createReferendumStatusV2,
  updateReferendumV2,
];
