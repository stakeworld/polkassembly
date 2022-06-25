// Copyright 2018-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { Option } from '@polkadot/types';
import {
  BlockNumber,
  Hash,
  Bounty
} from '@polkadot/types/interfaces';
import { hexToString, logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { filterEvents } from '../util/filterEvents';
import { childBountyStatus } from '../util/statuses';
import {
  Cached,
  NomidotChildBounty,
  Task,
  NomidotChildBountyRawEvent,
} from './types';

const l = logger('Task: Bounty');

const eventField = [
  'BountyIndex'
];

/*
 *  ======= Table (Bounty) ======
 */
const createChildBounty: Task<NomidotChildBounty[]> = {
  name: 'createChildBounty',
  read: async (
    blockHash: Hash,
    cached: Cached,
    api: ApiPromise
  ): Promise<NomidotChildBounty[]> => {
    const { events } = cached;

    const childBountyEvents = filterEvents(
      events,
      'childBounties',
      'Added'
    );

    const results: NomidotChildBounty[] = [];

    console.log(childBountyEvents[0].toHuman());

    await Promise.all(
      childBountyEvents.map(async ({ event: { data } }) => {

        if (data.length < 2) {
          l.error(
            `Expected Bounty index missing in the event`
          );
          return;
        }
        
        const parentBountyId = Number(data[0]);
        const childBountyId = Number(data[1]);

        console.log(parentBountyId, childBountyId)
        
        const apiAt = await api.at(blockHash);

        const childBountyRaw: any = await apiAt.query.childBounties.childBounties(
          childBountyId
        );

        if (childBountyRaw.isNone) {
          l.error('Expected data missing in bountyRaw');
          return null;
        }

        const childBounty = childBountyRaw.unwrap();
        const result: NomidotChildBounty = {
          childBountyId: childBountyId,
          proposer: childBounty.proposer,
          value: childBounty.value,
          fee: childBounty.fee,
          curatorDeposit: childBounty.curatorDeposit,
          description: hexToString(childBounty.description),
          parentBountyId: childBounty.parentBountyId,
          childBountyStatus: childBountyStatus.PROPOSED,
        };

        l.log(`Nomidot Bounty: ${JSON.stringify(result)}`);

        results.push(result);
      })
    );

    return results;
  },
  write: async (blockNumber: BlockNumber, value: NomidotChildBounty[]) => {
  await Promise.all(
    value.map(async prop => {
      const {
      childBountyId,
      proposer,
      value,
      fee,
      curatorDeposit,
      childBountyStatus,
            description,
            parentBountyId
      } = prop;

      await prisma.createChildBounty({
      childBountyId,
      proposer: proposer.toString(),
      value: value.toString(),
      fee: fee.toString(),
      curatorDeposit: curatorDeposit.toString(),
            description:description.toString(),
            parentBountyId: parentBountyId,
      childBountyStatus: {
        create: {
        blockNumber: {
          connect: {
          number: blockNumber.toNumber(),
          },
        },
        status,
        uniqueStatus: `${childBountyId}_${status}`,
        },
      },
      });
    })
    );
  },
};

export default createChildBounty;
