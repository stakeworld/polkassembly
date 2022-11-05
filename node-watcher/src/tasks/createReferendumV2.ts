// Copyright 2018-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';
import type { Option } from '@polkadot/types-codec';
import "@polkadot/api-augment";
import type { PalletReferendaReferendumInfoConvictionVotingTally } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { referendumStatusV2, preimageStatusV2 } from '../util/statuses';
import {
  Cached,
  NomidotReferendumV2,
  NomidotReferendumV2RawEvent,
  Task,
} from './types';

const l = logger('Task: Referenda');

const eventField = [
  'ReferendumIndex',
  'TrackNumber',
  'HashInfo',
];

const createReferendumV2: Task<NomidotReferendumV2[]> = {
  name: 'createReferendum',
  read: async (
    blockHash: Hash,
    cached: Cached,
    api: ApiPromise
  ): Promise<NomidotReferendumV2[]> => {
    const { events } = cached;

    const referendumEvents = events.filter(
        ({ event: { method, section } }) =>
          section === 'referenda' && [
            "Submitted",
            "DecisionStarted",
        ].includes(method)
    );

    console.log('referendumEvents', JSON.stringify(referendumEvents));

    const results: NomidotReferendumV2[] = [];

    await Promise.all(
      referendumEvents.map(async ({ event: { data, typeDef } }) => {
        const referendumRawEvent: NomidotReferendumV2RawEvent = data.reduce(
          (prev, curr, index) => {
            const type = eventField[index];

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
            `Expected ReferendumIndex missing in the event: ${referendumRawEvent.ReferendumIndex}`
          );
          return null;
        }
        if (!referendumRawEvent.HashInfo?.legacy?.hash && !referendumRawEvent.HashInfo?.lookup?.hash) {
          l.error(
            `Expected preimageHash is missing in the event: ${referendumRawEvent.ReferendumIndex}`
          );
          return null;
        }

        const preimageHash = referendumRawEvent.HashInfo?.legacy?.hash || referendumRawEvent.HashInfo?.lookup?.hash;

        const referendumInfoRaw: Option<PalletReferendaReferendumInfoConvictionVotingTally> = await api.query.referenda.referendumInfoFor(referendumRawEvent.ReferendumIndex);

        console.log('referendumInfoRaw', JSON.stringify(referendumInfoRaw));

        // const referendumInfo = getReferendumStatus(referendumInfoRaw);
        const referendumInfo =  JSON.parse(JSON.stringify(referendumInfoRaw));

        if (!referendumInfo) {
          l.error(
            `No ReferendumInfo found for ReferendumIndex: ${referendumRawEvent.ReferendumIndex}`
          );
          return null;
        }

        const result: NomidotReferendumV2 = {
            referendumIndex: referendumRawEvent.ReferendumIndex,
            trackNumber: referendumInfo.ongoing?.track,
            track: referendumInfo.ongoing?.origin?.origins,
            preimageHash: preimageHash,
            status: referendumStatusV2.ONGOING,
            enactmentAt: referendumInfo.ongoing?.enactment?.at,
            SubmittedAt: referendumInfo.ongoing?.submitted,
            submitted: referendumInfo.ongoing?.submissionDeposit,
            decisionDeposit: referendumInfo.ongoing?.decisionDeposit,
            deciding: referendumInfo.ongoing?.deciding,
        };

        l.log(`Nomidot Referendum: ${JSON.stringify(result)}`);
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
          track,
          preimageHash,
          referendumIndex,
          status,
          enactmentAt,
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

        await prisma.upsertReferendumV2({
            where: {
                referendumId: referendumIndex,
            },
            update: {
                trackNumber: trackNumber,
                track: track,
                preimage: notedPreimage
                    ? {
                        connect: {
                        id: notedPreimage.id,
                        },
                    }
                    : undefined,
                preimageHash: preimageHash.toString(),
                referendumId: referendumIndex,
                enactmentAt: enactmentAt,
                submittedAt: SubmittedAt.toString(),
                submitted: submitted,
                decisionDeposit: decisionDeposit,
                deciding: deciding,
            },
            create: {
                trackNumber: trackNumber,
                track: track,
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
                enactmentAt: enactmentAt,
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

export default createReferendumV2;
