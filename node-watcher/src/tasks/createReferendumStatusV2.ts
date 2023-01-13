// Copyright 2018-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import newProposalStatus from '../util/newProposalStatus';
import { referendumStatusV2, proposalStatus } from '../util/statuses';
import {
  Cached,
  NomidotReferendumStatusUpdate,
  NomidotReferendumV2RawEvent,
  NomidotReferendumV2StatusUpdate,
  Tally,
  Task,
} from './types';

const l = logger('Task: Referendum Status Update');

const eventField = [
  'ReferendumIndex',
  'Tally',
];

function hexToNumber(str: string) {
  if (/^0x[0-9A-F]+$/i.test(str)) {
    // Convert the hexadecimal string to a number
    return parseInt(str, 16);
  } else {
    return str;
  }
}

/*
 *  ======= Table (Referendum Status Update) ======
 */
const createReferendumStatusV2: Task<NomidotReferendumV2StatusUpdate[]> = {
  name: 'createReferendumStatusUpdate',
  read: async (
    _blockHash: Hash,
    cached: Cached,
    _api: ApiPromise
  ): Promise<NomidotReferendumV2StatusUpdate[]> => {
    const { events } = cached;

    // The "Started" event is taken care of by the createReferendum
    // task, so we need to filter it out.
    const referendumEvents = events.filter(
      ({ event: { method, section } }) =>
        section === 'referenda' &&
        Object.values(referendumStatusV2)
          .filter(status => status !== referendumStatusV2.ONGOING)
          .includes(method)
    );

    const results: NomidotReferendumV2StatusUpdate[] = [];

    if (!referendumEvents) {
      return results;
    }

    await Promise.all(
      referendumEvents.map(async ({ event: { data, typeDef, method } }) => {
        const referendumRawEvent: NomidotReferendumV2RawEvent = data.reduce(
          (prev, curr, index) => {
            let type = eventField[index];

            console.log(index, curr.toJSON());

            return {
              ...prev,
              [type]: curr.toJSON(),
            };
          },
          {}
        );

        l.log(`referendumRawEvent: ${JSON.stringify(referendumRawEvent)}`);

        if (
          !referendumRawEvent.ReferendumIndex &&
          referendumRawEvent.ReferendumIndex !== 0
        ) {
          l.error(
            `Expected ReferendumIndex not found on the event: ${referendumRawEvent.ReferendumIndex}`
          );
          return null;
        }

        const relatedReferendum = await prisma.referendumV2({
          referendumId: referendumRawEvent.ReferendumIndex,
        });

        if (!relatedReferendum) {
          l.error(
            `No existing referendum found for referendum id: ${referendumRawEvent.ReferendumIndex}`
          );
          return [];
        }

        let tallyData: Tally | undefined = {};
        
        if (referendumRawEvent.Tally){
          tallyData.ayes = referendumRawEvent.Tally.ayes ? hexToNumber(referendumRawEvent.Tally.ayes).toString() : "0";
          tallyData.nays = referendumRawEvent.Tally.nays ? hexToNumber(referendumRawEvent.Tally.nays).toString() : "0";
          tallyData.support = referendumRawEvent.Tally.support ? hexToNumber(referendumRawEvent.Tally.support).toString() : "0";
        }

        const result: NomidotReferendumV2StatusUpdate = {
          referendumId: referendumRawEvent.ReferendumIndex,
          status: method,
          tally: tallyData,
        };
        l.log(`Nomidot Referendum Status Update: ${JSON.stringify(result)}`);
        results.push(result);
      })
    );

    return results;
  },
  write: async (
    blockNumber: BlockNumber,
    value: NomidotReferendumV2StatusUpdate[]
  ) => {
    if (value && value.length) {
      await Promise.all(
        value.map(async ref => {
          const { referendumId, status, tally } = ref;

          await prisma.createReferendumStatusV2({
            blockNumber: {
              connect: {
                number: blockNumber.toNumber(),
              },
            },
            referendum: {
              connect: {
                referendumId,
              },
            },
            status,
            uniqueStatus: `${referendumId}_${status}`,
          });

          if (tally) {
            const relatedReferendum = await prisma.referendumV2({
              referendumId: referendumId
            });

            if (relatedReferendum){
              await prisma.updateReferendumV2({
                where: {
                  id: relatedReferendum.id
                },
                data: {
                  tally: tally
                }
              })
            }
          }


          // if the referendum got executed
          // and if this is calling a democracy.clearPublicProps
          // Then clear any previous proposal with status "Proposed"
          // if (status === referendumStatusV2.EXECUTED){
          //   const method = await prisma.referendum({referendumId: referendumId})?.preimage()?.method()
          //   if (method === 'clearPublicProposals'){
          //     // get all the proposal that are not tabled and not cleared
          //     // and that where proposed before the current block number
          //     const proposedProposals = await prisma.proposals({
          //       where: {
          //         AND: [
          //           { proposalStatus_none: { status: proposalStatus.TABLED }},
          //           { proposalStatus_none: { status: proposalStatus.CLEARED }},
          //           {
          //             proposalStatus_some: {
          //               AND: [
          //                 { status: proposalStatus.PROPOSED },
          //                 { blockNumber: { number_lte: blockNumber.toNumber() }}
          //               ]
          //             }
          //           }
          //         ]
          //       }
          //     });

          //     // mark these proposals as cleared
          //     proposedProposals.map(async (proposal) => {
          //       const { proposalId } = proposal;
          //       const status = proposalStatus.CLEARED;
          //       await newProposalStatus({blockNumber, proposalId, status});
          //     })
          //   }
          // }
        })
      );
    }
  },
};

export default createReferendumStatusV2;
