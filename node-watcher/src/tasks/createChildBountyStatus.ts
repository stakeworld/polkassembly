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
      section === 'childBounties' &&	[
        childBountyStatus.AWARDED,
        childBountyStatus.CANCELED,
        childBountyStatus.CLAIMED,
		].includes(method));

    const results: NomidotChildBountyStatusUpdate[] = [];

    if (!filteredEvents.length) {
      return results;
    }

    await Promise.all(
      filteredEvents.map(async ({ event: { data, method } }) => {

        if (data.length < 2) {
          l.error(
            `Expected Bounty index missing in the event`
          );
          return;
        }
        
        const parentBountyId = Number(data[0]);
        const childBountyId = Number(data[1]);

        if (!childBountyId && childBountyId !== 0) {
          l.error(
            `Expected Bounty index missing in the event: ${filteredEvents.toString()}`
          );
          return;
        }


        const childBounties = await prisma.childBounties({
          where: { childBountyId: childBountyId },
        });

        if (!childBounties || !childBounties.length) {
          l.error(
            `No existing bounty found for index: ${childBountyId}`
          );
          return;
        }

        const result: NomidotChildBountyStatusUpdate = {
          childBountyId: childBountyId,
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
                childBountyId
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
