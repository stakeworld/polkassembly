// Copyright 2018-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { GraphQLServer } from 'graphql-yoga';

import { prisma } from './generated/prisma-client';
import { Query } from './resolvers/query';
import { Subscription } from './resolvers/subscription';
import { Selectors } from './types';

const resolvers = {
  Subscription,
  Query,
  Node: {
    __resolveType() {
      return null;
    }
  },
  BlockNumber: {
    authoredBy(parent: any) {
      return prisma.blockNumber({ id: parent.id }).authoredBy();
    },
    hash(parent: any) {
      return prisma.blockNumber({ id: parent.id }).hash();
    },
    id(parent: any) {
      return prisma.blockNumber({ id: parent.id }).id();
    },
    number(parent: any) {
      return prisma.blockNumber({ id: parent.id }).number();
    },
    startDateTime(parent: any) {
      return prisma.blockNumber({ id: parent.id }).startDateTime();
    },
  },
  Era: {
    eraStartSessionIndex(parent: any) {
      return prisma.era({ id: parent.id }).eraStartSessionIndex();
    },
  },
  HeartBeat: {
    sessionIndex(parent: any) {
      return prisma.heartBeat({ id: parent.id }).sessionIndex();
    },
  },
  Nomination: {
    session(parent: any) {
      return prisma.nomination({ id: parent.id }).session();
    },
  },
  OfflineValidator: {
    sessionIndex(parent: any) {
      return prisma.offlineValidator({ id: parent.id }).sessionIndex();
    },
  },
  Reward: {
    authoredBlock(parent: any) {
      return prisma.reward({ id: parent.id }).authoredBlock();
    },
    sessionIndex(parent: any) {
      return prisma.reward({ id: parent.id }).sessionIndex();
    },
  },
  Session: {
    id(parent: any) {
      return prisma.session({ id: parent.id }).id();
    },
    index(parent: any) {
      return prisma.session({ id: parent.id }).index();
    },
    start(parent: any) {
      return prisma.session({ id: parent.id }).start();
    },
  },
  Stake: {
    blockNumber(parent: any) {
      return prisma.stake({ id: parent.id }).blockNumber();
    },
  },
  TotalIssuance: {
    blockNumber(parent: any) {
      return prisma.totalIssuance({ id: parent.id }).blockNumber();
    },
  },
  Validator: {
    session(parent: any) {
      return prisma.validator({ id: parent.id }).session();
    },
  },
  Council: {
    blockNumber(parent: any) {
      return prisma.council({ id: parent.id }).blockNumber();
    },
    members(
      parent: any,
      { where, orderBy, skip, after, before, first, last }: Selectors
    ) {
      return prisma
        .council({ id: parent.id })
        .members({ where, orderBy, skip, after, before, first, last });
    },
  },
  CouncilMember: {
    councils(
      parent: any,
      { where, orderBy, skip, after, before, first, last }: Selectors
    ) {
      return prisma
        .councilMember({ id: parent.id })
        .councils({ where, orderBy, skip, after, before, first, last });
    },
  },
  Motion: {
    motionProposalArguments(
      parent: any,
      { where, orderBy, skip, after, before, first, last }: Selectors
    ) {
      return prisma.motion({ id: parent.id }).motionProposalArguments({
        where,
        orderBy,
        skip,
        after,
        before,
        first,
        last,
      });
    },
    motionStatus(
      parent: any,
      { where, orderBy, skip, after, before, first, last }: Selectors
    ) {
      return prisma
        .motion({ id: parent.id })
        .motionStatus({ where, orderBy, skip, after, before, first, last });
    },
    preimage(parent: any) {
      return prisma.motion({ id: parent.id }).preimage();
    },
    treasurySpendProposal(parent: any) {
      return prisma.motion({ id: parent.id }).treasurySpendProposal();
    },
  },
  MotionStatus: {
    blockNumber(parent: any) {
      return prisma.motionStatus({ id: parent.id }).blockNumber();
    },
  },
  Proposal: {
    preimage(parent: any) {
      return prisma.proposal({ id: parent.id }).preimage();
    },
    proposalStatus(
      parent: any,
      { where, orderBy, skip, after, before, first, last }: Selectors
    ) {
      return prisma
        .proposal({ id: parent.id })
        .proposalStatus({ where, orderBy, skip, after, before, first, last });
    },
  },
  Preimage: {
    preimageArguments(
      parent: any,
      { where, orderBy, skip, after, before, first, last }: Selectors
    ) {
      return prisma.preimage({ id: parent.id }).preimageArguments({
        where,
        orderBy,
        skip,
        after,
        before,
        first,
        last,
      });
    },
    preimageStatus(
      parent: any,
      { where, orderBy, skip, after, before, first, last }: Selectors
    ) {
      return prisma
        .preimage({ id: parent.id })
        .preimageStatus({ where, orderBy, skip, after, before, first, last });
    },
  },
  PreimageStatus: {
    blockNumber(parent: any) {
      return prisma.preimageStatus({ id: parent.id }).blockNumber();
    },
  },
  PreimageV2: {
    preimageArguments(
      parent: any,
      { where, orderBy, skip, after, before, first, last }: Selectors
    ) {
      return prisma.preimageV2({ id: parent.id }).preimageArguments({
        where,
        orderBy,
        skip,
        after,
        before,
        first,
        last,
      });
    },
    preimageStatus(
      parent: any,
      { where, orderBy, skip, after, before, first, last }: Selectors
    ) {
      return prisma
        .preimageV2({ id: parent.id })
        .preimageStatus({ where, orderBy, skip, after, before, first, last });
    },
  },
  PreimageStatusV2: {
    blockNumber(parent: any) {
      return prisma.preimageStatusV2({ id: parent.id }).blockNumber();
    },
  },
  ProposalStatus: {
    blockNumber(parent: any) {
      return prisma.proposalStatus({ id: parent.id }).blockNumber();
    },
  },
  TechCommitteeProposal: {
    proposalArguments(
      parent: any,
      { where, orderBy, skip, after, before, first, last }: Selectors
    ) {
      return prisma.techCommitteeProposal({ id: parent.id }).proposalArguments({
        where,
        orderBy,
        skip,
        after,
        before,
        first,
        last,
      });
    },
    status(
      parent: any,
      { where, orderBy, skip, after, before, first, last }: Selectors
    ) {
      return prisma
        .techCommitteeProposal({ id: parent.id })
        .status({ where, orderBy, skip, after, before, first, last });
    },
    preimage(parent: any) {
      return prisma.techCommitteeProposal({ id: parent.id }).preimage();
    },
  },
  TechCommitteeProposalStatus: {
    blockNumber(parent: any) {
      return prisma.techCommitteeProposalStatus({ id: parent.id }).blockNumber();
    },
  },
  Tip: {
    tipStatus(
      parent: any,
      { where, orderBy, skip, after, before, first, last }: Selectors
    ) {
      return prisma
        .tip({ id: parent.id })
        .tipStatus({ where, orderBy, skip, after, before, first, last });
    },
  },
  TipStatus: {
    blockNumber(parent: any) {
      return prisma.tipStatus({ id: parent.id }).blockNumber();
    },
  },
  Bounty: {
    bountyStatus(
      parent: any,
      { where, orderBy, skip, after, before, first, last }: Selectors
    ) {
      return prisma
        .bounty({ id: parent.id })
        .bountyStatus({ where, orderBy, skip, after, before, first, last });
    },
  },
  ChildBounty: {
    childBountyStatus(
      parent: any,
      { where, orderBy, skip, after, before, first, last }: Selectors
    ) {
      return prisma
        .childBounty({ id: parent.id })
        .childBountyStatus({ where, orderBy, skip, after, before, first, last });
    },
  },
  BountyStatus: {
    blockNumber(parent: any) {
      return prisma.bountyStatus({ id: parent.id }).blockNumber();
    },
  },
  ChildBountyStatus: {
    blockNumber(parent: any) {
      return prisma.childBountyStatus({ id: parent.id }).blockNumber();
    },
  },
  TreasurySpendProposal: {
    treasuryStatus(
      parent: any,
      { where, orderBy, skip, after, before, first, last }: Selectors
    ) {
      return prisma
        .treasurySpendProposal({ id: parent.id })
        .treasuryStatus({ where, orderBy, skip, after, before, first, last });
    },
    motion(parent: any) {
      return prisma.treasurySpendProposal({ id: parent.id }).motion();
    },
  },
  TreasuryStatus: {
    blockNumber(parent: any) {
      return prisma.treasuryStatus({ id: parent.id }).blockNumber();
    },
  },
  Referendum: {
    preimage(parent: any) {
      return prisma.referendum({ id: parent.id }).preimage();
    },
    referendumStatus(
      parent: any,
      { where, orderBy, skip, after, before, first, last }: Selectors
    ) {
      return prisma
        .referendum({ id: parent.id })
        .referendumStatus({ where, orderBy, skip, after, before, first, last });
    },
    referendumVote(
      parent: any,
      { where, orderBy, skip, after, before, first, last }: Selectors
    ) {
      return prisma
        .referendum({ id: parent.id })
        .referendumVote({ where, orderBy, skip, after, before, first, last });
    },
  },
  ReferendumStatus: {
    blockNumber(parent: any) {
      return prisma.referendumStatus({ id: parent.id }).blockNumber();
    },
  },
  ReferendumVote: {
    blockNumber(parent: any) {
      return prisma.referendumVote({ id: parent.id }).blockNumber();
    },
  },
  ReferendumV2: {
    preimage(parent: any) {
      return prisma.referendumV2({ id: parent.id }).preimage();
    },
    referendumStatus(
      parent: any,
      { where, orderBy, skip, after, before, first, last }: Selectors
    ) {
      return prisma
        .referendumV2({ id: parent.id })
        .referendumStatus({ where, orderBy, skip, after, before, first, last });
    },
  },
  ReferendumStatusV2: {
    blockNumber(parent: any) {
      return prisma.referendumStatusV2({ id: parent.id }).blockNumber();
    },
  },
  FellowshipReferendum: {
    preimage(parent: any) {
      return prisma.fellowshipReferendum({ id: parent.id }).preimage();
    },
    referendumStatus(
      parent: any,
      { where, orderBy, skip, after, before, first, last }: Selectors
    ) {
      return prisma
        .fellowshipReferendum({ id: parent.id })
        .referendumStatus({ where, orderBy, skip, after, before, first, last });
    },
  },
  FellowshipReferendumStatus: {
    blockNumber(parent: any) {
      return prisma.fellowshipReferendumStatus({ id: parent.id }).blockNumber();
    },
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma },
});
server.start(() => console.log('Server is running on http://localhost:4000'));
