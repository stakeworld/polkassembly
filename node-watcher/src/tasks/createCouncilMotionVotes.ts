// Copyright 2018-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import {
  BlockNumber,
  Hash,
} from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';
import { encodeAddress } from '@polkadot/util-crypto';

import { prisma } from '../generated/prisma-client';
import { filterEvents } from '../util/filterEvents';
import {
  Cached,
  NomidotCouncilMotionRawVoteEvent,
  NomidotCouncilMotionVote,
  Task,
} from './types';

const l = logger('Task: Council Motion Votes');

const eventField = [
  'voter',
  'proposalHash',
  'seconded',
];

/*
 *  ======= Table (createCouncilMotionVotes) ======
 */
const createCouncilMotionVotes: Task<NomidotCouncilMotionVote[]> = {
  name: 'createCouncilMotionVote',
  read: async (
    blockHash: Hash,
    cached: Cached,
    api: ApiPromise
  ): Promise<NomidotCouncilMotionVote[]> => {
    const { events } = cached;

    const referendumVoteEvents = filterEvents(
      events,
      'council',
      'Voted'
    );

    const results: NomidotCouncilMotionVote[] = [];

    await Promise.all(
      referendumVoteEvents.map(async ({ event: { data, typeDef } }) => {
        const councilMotionVoteRawEvent: NomidotCouncilMotionRawVoteEvent = data.reduce(
          (prev, curr, index) => {
            let type = eventField[index];
            console.log(index, curr.toJSON());
            return {
              ...prev,
              [type]: curr.toJSON(),
            };
          },
          {});
        l.log(`councilMotionVoteRawEvent: ${JSON.stringify(councilMotionVoteRawEvent)}`);
        console.log('ref', JSON.stringify(councilMotionVoteRawEvent));
        if (!councilMotionVoteRawEvent.proposalHash &&
          councilMotionVoteRawEvent.proposalHash !== 0) {
          l.error(
            `Expected proposalHash missing in the event: ${councilMotionVoteRawEvent.proposalHash}`
          );
          return null;
        }
        if (!councilMotionVoteRawEvent.voter || councilMotionVoteRawEvent.seconded == null) {
          l.error(
            `Expected motion vote event missing: ${JSON.stringify(councilMotionVoteRawEvent)}`
          );
          return null;
        }
        const motionProposal = await prisma.motions({
          where: {
            motionProposalHash: councilMotionVoteRawEvent.proposalHash.toString()
          }
        })
        if(!motionProposal){
          l.error(
            `Expected motionProposal missing from prisma: ${JSON.stringify(councilMotionVoteRawEvent)}`
          );
          return null;
        }
        const vote: NomidotCouncilMotionVote = {
          proposalHash: councilMotionVoteRawEvent.proposalHash,
          voter: councilMotionVoteRawEvent.voter,
          seconded: councilMotionVoteRawEvent.seconded,
          motionProposalId: motionProposal[0]?.motionProposalId
        };
        l.log(`Nomidot Council Motion vote: ${JSON.stringify(vote)}`);
        results.push(vote);
      }
      )
    );
    return results;
  },
  write: async (blockNumber: BlockNumber, value: NomidotCouncilMotionVote[]) => {
    await Promise.all(
      value.map(async prop => {
        const {
            voter,
            seconded,
            motionProposalId
        } = prop;

        await prisma.createCouncilMotionVote({
          voter: voter.toString(), // substrate format
          seconded: seconded,
          blockNumber: {
            connect: {
              number: blockNumber.toNumber(),
            },
          },
          motion: {
            connect: {
              motionProposalId: motionProposalId,
            },
          },
        });
      })
    );
  },
};

export default createCouncilMotionVotes;
