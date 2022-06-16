// Copyright 2018-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { childBountyStatus } from '../util/statuses';
import {
  Cached,
  NomidotChildBountyRawEvent,
  NomidotChildBountyStatusUpdate,
  Task,
} from './types';

const l = logger('Task: Bounty Status Update');

const eventField = [
  'ChildBountyIndex'
];

/*
 *  ======= Table (Bounty Status Update) ======
 */
const createBountyStatus: Task<NomidotChildBountyStatusUpdate[]> = {
  name: 'createChildBountyStatusUpdate',
  read: async (
    blockHash: Hash,
    cached: Cached,
    api: ApiPromise
  ): Promise<NomidotChildBountyStatusUpdate[]> => {
  const { events } = cached;

    const filteredEvents = events.filter(
    ({ event: { method, section } }) =>
      section === 'bounties' &&	[
        childBountyStatus.BECAME_ACTIVE,
        childBountyStatus.AWARDED,
        childBountyStatus.CLAIMED,
        childBountyStatus.CANCELED,
        childBountyStatus.REJECTED,
        childBountyStatus.EXTENDED,
        childBountyStatus.ADDED
		].includes(method));

    const results: NomidotChildBountyStatusUpdate[] = [];

    if (!filteredEvents.length) {
      return results;
    }

    await Promise.all(
      filteredEvents.map(async ({ event: { data, typeDef, method } }) => {
        const childBountyRawEvent: NomidotChildBountyRawEvent = data.reduce(
          (result, curr, index) => {
            const type = eventField[index];

            return {
              ...result,
              [type]: curr.toJSON(),
            };
          },
          {}
        );

        if (!childBountyRawEvent.ChildBountyIndex && childBountyRawEvent.ChildBountyIndex !== 0) {
          l.error(
            `Expected Bounty index missing in the event: ${childBountyRawEvent.ChildBountyIndex}`
          );
          return;
        }

        const childBounties = await prisma.childBounties({
          where: { childBountyId: childBountyRawEvent.ChildBountyIndex },
        });

        if (!childBounties || !childBounties.length) {
          l.error(
            `No existing bounty found for index: ${childBountyRawEvent.ChildBountyIndex}`
          );
          return;
        }

        const result: NomidotChildBountyStatusUpdate = {
          childBountyId: childBountyRawEvent.ChildBountyIndex,
          status: method,
        };
        l.log(`Nomidot Child Bounty Status Update: ${JSON.stringify(result)}`);
        results.push(result);
      })
    );

    return results;
  },
  write: async (
    blockNumber: BlockNumber,
    value: NomidotChildBountyStatusUpdate[]
  ) => {
    if (value && value.length) {
      await Promise.all(
        value.map(async ref => {
          const { childBountyId, status } = ref;

          await prisma.createChildBountyStatus({
            blockNumber: {
              connect: {
                number: blockNumber.toNumber(),
              },
            },
            childBounty: {
              connect: {
                id: childBountyId,
              },
            },
            status: status,
            uniqueStatus: `${childBountyId}_${status}`,
          });
        })
      );
    }
  },
};

export default createBountyStatus;
