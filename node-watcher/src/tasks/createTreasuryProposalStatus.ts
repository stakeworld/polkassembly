// Copyright 2018-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { treasuryProposalStatus } from '../util/statuses';
import {
  Cached,
  NomidotTreasuryRawEvent,
  NomidotTreasuryStatusUpdate,
  Task,
} from './types';

const l = logger('Task: Treasury Status Update');

const eventField = [
  'ProposalIndex'
];

/*
 *  ======= Table (Treasury Status Update) ======
 */
const createTreasuryStatus: Task<NomidotTreasuryStatusUpdate[]> = {
  name: 'createTreasuryStatusUpdate',
  read: async (
    blockHash: Hash,
    cached: Cached,
    api: ApiPromise
  ): Promise<NomidotTreasuryStatusUpdate[]> => {
  const { events } = cached;

    const filteredEvents = events.filter(
    ({ event: { method, section } }) =>
      section === 'treasury' &&	[
        treasuryProposalStatus.TABLED,
        treasuryProposalStatus.REJECTED,
		].includes(method));

    const results: NomidotTreasuryStatusUpdate[] = [];

    if (!filteredEvents.length) {
      return results;
    }

    await Promise.all(
      filteredEvents.map(async ({ event: { data, typeDef, method } }) => {
        const treasuryRawEvent: NomidotTreasuryRawEvent = data.reduce(
          (result, curr, index) => {
            const type = eventField[index];

            return {
              ...result,
              [type]: curr.toJSON(),
            };
          },
          {}
        );
        console.log('createTreasuryStatus',treasuryRawEvent);

        if (!treasuryRawEvent.ProposalIndex && treasuryRawEvent.ProposalIndex !== 0) {
          l.error(
            `Expected Proposal index missing in the event: ${treasuryRawEvent.ProposalIndex}`
          );
          return;
        }

        const proposals = await prisma.treasurySpendProposals({
          where: { treasuryProposalId: treasuryRawEvent.ProposalIndex },
        });

        if (!proposals || !proposals.length) {
          l.error(
            `No existing proposal found for index: ${treasuryRawEvent.ProposalIndex}`
          );
          return;
        }

        const result: NomidotTreasuryStatusUpdate = {
          treasuryProposalId: treasuryRawEvent.ProposalIndex,
          status: method,
        };
        l.log(`Nomidot proposal Status Update: ${JSON.stringify(result)}`);
        results.push(result);
      })
    );

    return results;
  },
  write: async (
    blockNumber: BlockNumber,
    value: NomidotTreasuryStatusUpdate[]
  ) => {
    if (value && value.length) {
      await Promise.all(
        value.map(async ref => {
          const { treasuryProposalId, status } = ref;

          await prisma.createTreasuryStatus({
            blockNumber: {
              connect: {
                number: blockNumber.toNumber(),
              },
            },
            treasurySpendProposal: {
              connect: {
                treasuryProposalId: treasuryProposalId,
              },
            },
            status,
            uniqueStatus: `${treasuryProposalId}_${status}`,
          });
        })
      );
    }
  },
};

export default createTreasuryStatus;