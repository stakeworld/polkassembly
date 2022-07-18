// Copyright 2018-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { Option } from '@polkadot/types';
import {
  BlockNumber,
  Hash,
} from '@polkadot/types/interfaces';
import { hexToString, logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
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

    // const childBountyEvents = filterEvents(
    //   events,
    //   'childBounties',
    //   'Awarded',
    // );

    const childBountyEvents = events.filter(
      ({ event: { method, section } }) =>
        section === 'childBounties' &&	[
          childBountyStatus.ADDED,
          childBountyStatus.AWARDED,
      ].includes(method));

    const results: NomidotChildBounty[] = [];

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

        if (!childBountyId && childBountyId !== 0) {
          l.error(
            `Expected Bounty index missing in the event: ${childBountyEvents.toString()}`
          );
          return;
        }

        const apiAt = await api.at(blockHash);

        const childBountyRaw: any = await apiAt.query.childBounties.childBounties(
          parentBountyId,
          childBountyId,
        );

        if (childBountyRaw.isNone) {
          l.error('Expected data missing in childBountyRaw');
          return;
        }

        const bountyRaw = await apiAt.query.bounties.bounties(parentBountyId);

        if (bountyRaw.isNone) {
          l.error('Expected data missing in bounty');
          return;
        }

        const bounty = bountyRaw.unwrap();

        const childBounty = childBountyRaw.unwrap();

        let description = '';
        const descriptionRaw = await apiAt.query.childBounties.childBountyDescriptions(
          childBountyId
        );

        try {
          description = descriptionRaw.toHuman() as string;
        } catch (error) {
          l.error(error);
        }

        let curator = null;
        let beneficiary = null;

        const cbStatus = childBounty.status?.toHuman();

        if (cbStatus === childBountyStatus.ADDED) {
          curator = bounty.proposer;
        }

        else if (Object.keys(cbStatus).includes("CuratorProposed")) {
          curator = cbStatus.CuratorProposed.curator;
          beneficiary = cbStatus.CuratorProposed.beneficiary;
        }

        else if (Object.keys(cbStatus).includes("PendingPayout")) {
          curator = cbStatus.PendingPayout.curator;
          beneficiary = cbStatus.PendingPayout.beneficiary;
        }
        
        // try {
        //   curator = childBounty.status?.asCuratorProposed?.curator;
        // } catch (error) {
        //   curator = bounty.proposer;
        //   l.error(error);
        // }

        const result: NomidotChildBounty = {
          childBountyId: childBountyId,
          proposer: bounty.status?.asActive?.curator || bounty.proposer,
          value: childBounty.value,
          fee: childBounty.fee,
          curatorDeposit: childBounty.curatorDeposit,
          description: description,
          parentBountyId,
          childBountyStatus: childBountyStatus.ADDED,
          curator: curator,
          beneficiary: beneficiary,
        };

        l.log(`Nomidot Child Bounty: ${JSON.stringify(result)}`);

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
          parentBountyId,
          curator,
          beneficiary
        } = prop;

        await prisma.upsertChildBounty({
          where: {
            childBountyId,
          },
          update: {
            childBountyId,
            curator: curator?.toString(),
            beneficiary: beneficiary?.toString(),
          },
          create: {
            childBountyId,
            parentBountyId,
            proposer: proposer.toString(),
            value: value.toString(),
            fee: fee.toString(),
            curatorDeposit: curatorDeposit.toString(),
            description: description.toString(),
            curator: curator?.toString(),
            beneficiary: beneficiary?.toString(),
            childBountyStatus: {
              create: {
                blockNumber: {
                  connect: {
                    number: blockNumber.toNumber(),
                  },
                },
                status: childBountyStatus,
                uniqueStatus: `${childBountyId}_${childBountyStatus}`,
              },
            },
          }
        });
      })
    );
  },
};

export default createChildBounty;
