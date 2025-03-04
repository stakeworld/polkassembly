// Copyright 2018-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';
import "@polkadot/api-augment";
import { prisma } from '../generated/prisma-client';
import { referendumStatusV2, preimageStatusV2 } from '../util/statuses';
import {
  Cached,
  NomidotReferendumV2,
  NomidotReferendumV2RawEvent,
  Task,
} from './types';

const l = logger('Task: updateFellowshipReferendum');

const eventField = [
  'ReferendumIndex',
  'TrackNumber',
  'HashInfo',
];

const updateFellowshipReferendumDecision: Task<NomidotReferendumV2[]> = {
  name: 'updateFellowshipReferendum',
  read: async (
    blockHash: Hash,
    cached: Cached,
    api: ApiPromise
  ): Promise<NomidotReferendumV2[]> => {
    const { events } = cached;

    const referendumEvents = events.filter(
        ({ event: { method, section } }) =>
          section === 'fellowshipReferenda' && [
            "DecisionStarted",
        ].includes(method)
    );

    const results: NomidotReferendumV2[] = [];

    await Promise.all(
      referendumEvents.map(async ({ event: { data, typeDef } }) => {
        const referendumRawEvent: NomidotReferendumV2RawEvent = data.reduce(
          (prev, curr, index) => {
            const type = eventField[index];

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
            `Expected ReferendumIndex missing in the event: ${referendumRawEvent.ReferendumIndex}`
          );
          return null;
        }
        if (!referendumRawEvent.HashInfo?.legacy?.hash && !referendumRawEvent.HashInfo?.lookup?.hash && !referendumRawEvent.HashInfo?.inline?.hash) {
          l.error(
            `Expected preimageHash is missing in the event: ${referendumRawEvent.ReferendumIndex}`
          );
          return null;
        }

        const preimageHash = referendumRawEvent.HashInfo?.legacy?.hash || referendumRawEvent.HashInfo?.lookup?.hash || referendumRawEvent.HashInfo?.inline?.hash;

        const referendumInfoRaw = await api.query.fellowshipReferenda.referendumInfoFor(referendumRawEvent.ReferendumIndex);

        l.log('referendumInfoRaw', JSON.stringify(referendumInfoRaw));

        // const referendumInfo = getReferendumStatus(referendumInfoRaw);
        const referendumInfo =  JSON.parse(JSON.stringify(referendumInfoRaw));

        if (!referendumInfo) {
          l.error(
            `No Fellowship ReferendumInfo found for ReferendumIndex: ${referendumRawEvent.ReferendumIndex}`
          );
          return null;
        }

        const result: NomidotReferendumV2 = {
            referendumIndex: referendumRawEvent.ReferendumIndex,
            trackNumber: referendumInfo.ongoing?.track,
            origin: referendumInfo.ongoing?.origin?.origins || 'root',
            preimageHash: preimageHash,
            status: referendumStatusV2.DECIDING,
            enactmentAt: referendumInfo.ongoing?.enactment?.at,
            enactmentAfter: referendumInfo.ongoing?.enactment?.after,
            SubmittedAt: referendumInfo.ongoing?.submitted,
            submitted: referendumInfo.ongoing?.submissionDeposit,
            decisionDeposit: referendumInfo.ongoing?.decisionDeposit,
            deciding: referendumInfo.ongoing?.deciding,
        };

        l.log(`Nomidot Fellowship Referendum: ${JSON.stringify(result)}`);
        results.push(result);
      })
    );

    return results;
  },
  write: async (blockNumber: BlockNumber, value: NomidotReferendumV2[]) => {
    if (!value) {
      return;
    }

    await Promise.all(
      value.map(async referendum => {
        const {
          trackNumber,
          origin,
          preimageHash,
          referendumIndex,
          status,
          enactmentAt,
          enactmentAfter,
          SubmittedAt,
          decisionDeposit,
          deciding,
          submitted,
        } = referendum;

        const preimages = await prisma.preimageV2s({
          where: {
            hash: preimageHash.toString(),
          },
        });

        // preimage aren't uniquely identified with their hash
        // however, there can only be one preimage with the status "Noted"
        // at a time
        const notedPreimage = preimages.length
          ? preimages.filter(async preimage => {
              await prisma.preimageStatusV2s({
                where: {
                  AND: [
                    {
                      id: preimage.id,
                    },
                    {
                      status: preimageStatusV2.NOTED,
                    },
                  ],
                },
              });
            })[0]
          : undefined;

        await prisma.upsertFellowshipReferendum({
            where: {
                referendumId: referendumIndex,
            },
            update: {
                trackNumber: trackNumber,
                origin: origin,
                referendumId: referendumIndex,
                enactmentAt: enactmentAt?.toString(),
                enactmentAfter: enactmentAfter?.toString(),
                submittedAt: SubmittedAt.toString(),
                submitted: submitted,
                decisionDeposit: decisionDeposit,
                deciding: deciding,
                referendumStatus: {
                    create: {
                    blockNumber: {
                        connect: {
                        number: blockNumber.toNumber(),
                        },
                    },
                    status,
                    uniqueStatus: `${referendumIndex}_${status}`,
                    },
                },
            },
            create: {
                trackNumber: trackNumber,
                origin: origin,
                preimage: notedPreimage
                    ? {
                        connect: {
                        id: notedPreimage.id,
                        },
                    }
                    : undefined,
                preimageHash: preimageHash.toString(),
                referendumId: referendumIndex,
                referendumStatus: {
                    create: {
                    blockNumber: {
                        connect: {
                        number: blockNumber.toNumber(),
                        },
                    },
                    status,
                    uniqueStatus: `${referendumIndex}_${status}`,
                    },
                },
                enactmentAt: enactmentAt?.toString(),
                enactmentAfter: enactmentAfter?.toString(),
                submittedAt: SubmittedAt?.toString(),
                decisionDeposit: decisionDeposit,
                deciding: deciding,
                submitted: submitted,
            }
        });
      })
    );
  },
};

export default updateFellowshipReferendumDecision;
