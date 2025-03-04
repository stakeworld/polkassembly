// Copyright 2018-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  BlockNumberSubscription,
  BountySubscriptionPayloadSubscription,
  BountySubscriptionWhereInput,
  ChildBountySubscriptionPayloadSubscription,
  ChildBountySubscriptionWhereInput,
  EraSubscription,
  FellowshipReferendumStatusSubscriptionPayloadSubscription,
  FellowshipReferendumStatusSubscriptionWhereInput,
  FellowshipReferendumSubscriptionPayloadSubscription,
  FellowshipReferendumSubscriptionWhereInput,
  HeartBeatSubscription,
  MotionSubscriptionPayloadSubscription,
  MotionSubscriptionWhereInput,
  NominationSubscription,
  OfflineValidatorSubscription,
  ProposalSubscriptionPayloadSubscription,
  ProposalSubscriptionWhereInput,
  ReferendumSubscriptionPayloadSubscription,
  ReferendumV2SubscriptionPayloadSubscription,
  ReferendumSubscriptionWhereInput,
  ReferendumV2SubscriptionWhereInput,
  ReferendumStatusV2SubscriptionWhereInput,
  ReferendumStatusV2SubscriptionPayloadSubscription,
  RewardSubscription,
  SessionSubscription,
  SlashingSubscription,
  StakeSubscription,
  TechCommitteeProposalSubscriptionPayloadSubscription,
  TechCommitteeProposalSubscriptionWhereInput,
  TipSubscriptionPayloadSubscription,
  TipSubscriptionWhereInput,
  TreasurySpendProposalSubscriptionPayloadSubscription,
  TreasurySpendProposalSubscriptionWhereInput,
  ValidatorSubscription,
} from '../generated/prisma-client';
import { Context, Selectors } from '../types';

const blockNumber = {
  subscribe: (
    parent: any,
    { blockNumberSubscriptionWhereInput }: Selectors,
    context: Context
  ): (<T = BlockNumberSubscription>() => T) => {
    return context.prisma.$subscribe
      .blockNumber({
        // eslint-disable-next-line @typescript-eslint/camelcase
        mutation_in: ['CREATED'],
        ...blockNumberSubscriptionWhereInput,
      })
      .node();
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const heartBeat = {
  subscribe: (
    parent: any,
    { heartbeatSubscriptionWhereInput }: Selectors,
    context: Context
  ): (<T = HeartBeatSubscription>() => T) => {
    return context.prisma.$subscribe
      .heartBeat({
        // eslint-disable-next-line
        mutation_in: ['CREATED'],
        ...heartbeatSubscriptionWhereInput,
      })
      .node();
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const era = {
  subscribe: (
    parent: any,
    { eraSubscriptionWhereInput }: Selectors,
    context: Context
  ): (<T = EraSubscription>() => T) => {
    return context.prisma.$subscribe
      .era({
        // eslint-disable-next-line @typescript-eslint/camelcase
        mutation_in: ['CREATED'],
        ...eraSubscriptionWhereInput,
      })
      .node();
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const offlineValidator = {
  subscribe: (
    parent: any,
    { offlineValidatorsSubscriptionWhereInput }: Selectors,
    context: Context
  ): (<T = OfflineValidatorSubscription>() => T) => {
    return context.prisma.$subscribe
      .offlineValidator({
        // eslint-disable-next-line
        mutation_in: ['CREATED'],
        ...offlineValidatorsSubscriptionWhereInput,
      })
      .node();
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const nomination = {
  subscribe: (
    parent: any,
    { nominationSubscriptionWhereInput }: Selectors,
    context: Context
  ): (<T = NominationSubscription>() => T) => {
    return context.prisma.$subscribe
      .nomination({
        // eslint-disable-next-line @typescript-eslint/camelcase
        mutation_in: ['CREATED'],
        ...nominationSubscriptionWhereInput,
      })
      .node();
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const reward = {
  subscribe: (
    parent: any,
    { rewardSubscriptionWhereInput }: Selectors,
    context: Context
  ): (<T = RewardSubscription>() => T) => {
    return context.prisma.$subscribe
      .reward({
        // eslint-disable-next-line @typescript-eslint/camelcase
        mutation_in: ['CREATED'],
        ...rewardSubscriptionWhereInput,
      })
      .node();
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const session = {
  subscribe: (
    parent: any,
    { sessionSubscriptionWhereInput }: Selectors,
    context: Context
  ): (<T = SessionSubscription>() => T) => {
    return context.prisma.$subscribe
      .session({
        // eslint-disable-next-line @typescript-eslint/camelcase
        mutation_in: ['CREATED'],
        ...sessionSubscriptionWhereInput,
      })
      .node();
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const slashing = {
  subscribe: (
    parent: any,
    { slashingSubscriptionWhereInput }: Selectors,
    context: Context
  ): (<T = SlashingSubscription>() => T) => {
    return context.prisma.$subscribe
      .slashing({
        // eslint-disable-next-line @typescript-eslint/camelcase
        mutation_in: ['CREATED'],
        ...slashingSubscriptionWhereInput,
      })
      .node();
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const stake = {
  subscribe: (
    parent: any,
    { stakeSubscriptionWhereInput }: Selectors,
    context: Context
  ): (<T = StakeSubscription>() => T) => {
    return context.prisma.$subscribe
      .stake({
        // eslint-disable-next-line
        mutation_in: ['CREATED'],
        ...stakeSubscriptionWhereInput,
      })
      .node();
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const validator = {
  subscribe: (
    parent: any,
    { validatorSubscriptionWhereInput }: Selectors,
    context: Context
  ): (<T = ValidatorSubscription>() => T) => {
    return context.prisma.$subscribe
      .validator({
        // eslint-disable-next-line @typescript-eslint/camelcase
        mutation_in: ['CREATED'],
        ...validatorSubscriptionWhereInput,
      })
      .node();
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const motion = {
  subscribe: (
    parent: any,
    { where }: { where: MotionSubscriptionWhereInput },
    context: Context
  ): MotionSubscriptionPayloadSubscription => {
    return context.prisma.$subscribe.motion(where);
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const proposal = {
  subscribe: (
    parent: any,
    { where }: { where: ProposalSubscriptionWhereInput },
    context: Context
  ): ProposalSubscriptionPayloadSubscription => {
    return context.prisma.$subscribe.proposal(where);
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const referendum = {
  subscribe: (
    parent: any,
    { where }: { where: ReferendumSubscriptionWhereInput },
    context: Context
  ): ReferendumSubscriptionPayloadSubscription => {
    return context.prisma.$subscribe.referendum(where);
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const referendumV2 = {
  subscribe: (
    parent: any,
    { where }: { where: ReferendumV2SubscriptionWhereInput },
    context: Context
  ): ReferendumV2SubscriptionPayloadSubscription => {
    return context.prisma.$subscribe.referendumV2(where);
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const referendumStatusV2 = {
  subscribe: (
    parent: any,
    { where }: { where: ReferendumStatusV2SubscriptionWhereInput },
    context: Context
  ): ReferendumStatusV2SubscriptionPayloadSubscription => {
    return context.prisma.$subscribe.referendumStatusV2(where);
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const fellowshipReferendum = {
  subscribe: (
    parent: any,
    { where }: { where: FellowshipReferendumSubscriptionWhereInput },
    context: Context
  ): FellowshipReferendumSubscriptionPayloadSubscription => {
    return context.prisma.$subscribe.fellowshipReferendum(where);
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const fellowshipReferendumStatus = {
  subscribe: (
    parent: any,
    { where }: { where: FellowshipReferendumStatusSubscriptionWhereInput },
    context: Context
  ): FellowshipReferendumStatusSubscriptionPayloadSubscription => {
    return context.prisma.$subscribe.fellowshipReferendumStatus(where);
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const treasurySpendProposal = {
  subscribe: (
    parent: any,
    { where }: { where: TreasurySpendProposalSubscriptionWhereInput },
    context: Context
  ): TreasurySpendProposalSubscriptionPayloadSubscription => {
    return context.prisma.$subscribe.treasurySpendProposal(where);
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const tip = {
  subscribe: (
    parent: any,
    { where }: { where: TipSubscriptionWhereInput },
    context: Context
  ): TipSubscriptionPayloadSubscription => {
    return context.prisma.$subscribe.tip(where);
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const bounty = {
  subscribe: (
    parent: any,
    { where }: { where: BountySubscriptionWhereInput },
    context: Context
  ): BountySubscriptionPayloadSubscription => {
    return context.prisma.$subscribe.bounty(where);
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const childBounty = {
  subscribe: (
    parent: any,
    { where }: { where: ChildBountySubscriptionWhereInput },
    context: Context
  ): ChildBountySubscriptionPayloadSubscription => {
    return context.prisma.$subscribe.childBounty(where);
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const techCommitteeProposal = {
  subscribe: (
    parent: any,
    { where }: { where: TechCommitteeProposalSubscriptionWhereInput },
    context: Context
  ): TechCommitteeProposalSubscriptionPayloadSubscription => {
    return context.prisma.$subscribe.techCommitteeProposal(where);
  },
  resolve: (payload: any) => {
    return payload;
  },
};

export const Subscription = {
  blockNumber,
  bounty,
  childBounty,
  era,
  heartBeat,
  nomination,
  offlineValidator,
  reward,
  session,
  slashing,
  stake,
  validator,
  motion,
  proposal,
  techCommitteeProposal,
  tip,
  treasurySpendProposal,
  referendum,
  referendumV2,
  referendumStatusV2,
  fellowshipReferendum,
  fellowshipReferendumStatus,
};
