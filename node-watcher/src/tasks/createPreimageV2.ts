// Copyright 2018-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { Bytes, GenericCall, Option } from '@polkadot/types';
import hash from '@polkadot/util-crypto/blake2/asU8a';
import {
  AccountId,
  Balance,
  BlockNumber,
  Hash,
  PreimageStatus,
  Proposal,
} from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';
import { logger } from '@polkadot/util';
import "@polkadot/api-augment";
import { prisma } from '../generated/prisma-client';
import { filterEvents } from '../util/filterEvents';
import { preimageStatusV2 } from '../util/statuses';
import {
  Cached,
  NomidotPreimageEventV2,
  NomidotPreimageRawEvent,
  NomidotPreimageV2,
  Task,
} from './types';

type PreimageInfo = [Bytes, AccountId, Balance, BlockNumber];
type OldPreimage = ITuple<PreimageInfo>;

const l = logger('Task: PreimageV2');

// const isCurrentPreimage = function(
//   api: ApiPromise,
//   imageOpt: Option<OldPreimage> | Option<PreimageStatus>
// ): imageOpt is Option<PreimageStatus> {
//   return !!imageOpt && !api.query.democracy.dispatchQueue;
// };

// let proposal: Proposal | undefined;

const constructProposal = function(
  api: ApiPromise,
  bytes: Bytes
): Proposal | undefined {
  let proposal: Proposal | undefined;

  try {
    proposal = api.registry.createType('Proposal', bytes.toU8a(true));
  } catch (error) {
    l.log(error);
  }

  return proposal;
};

const eventField = [
  'Hash'
];

/*
 *  ======= Table (Preimage) ======
 */
const createPreimageV2: Task<NomidotPreimageV2[]> = {
  name: 'createPreimageV2',
  read: async (
    blockHash: Hash,
    cached: Cached,
    api: ApiPromise
  ): Promise<NomidotPreimageV2[]> => {
    const { events } = cached;

    const preimageEvents = filterEvents(
      events,
      'preimage',
      preimageStatusV2.NOTED
    );

    const results: NomidotPreimageV2[] = [];
    l.log('preimageEvents', JSON.stringify(preimageEvents));
    await Promise.all(
      preimageEvents.map(async ({ event }) => {
        const types = event.typeDef;

        const preimageArgumentsRaw: NomidotPreimageRawEvent = event.data.reduce(
          (prev, curr, index) => {
            const type: any = eventField[index];

            console.log(index, curr.toJSON());

            return {
              ...prev,
              [type]: curr.toString(),
            };
          },
          {}
        );

        l.log(`preimageArgumentsRaw: ${JSON.stringify(preimageArgumentsRaw)}`);

        if (!preimageArgumentsRaw.Hash) {
          l.error(
            `preimageArgumentsRaw.Hash missing: ${preimageArgumentsRaw.Hash}`
          );
          return null;
        }

        const preimageArguments: NomidotPreimageEventV2 = {
          hash: preimageArgumentsRaw.Hash,
        };

        const preimageStatus = await api.query.preimage.statusFor(preimageArguments.hash);

        if (!preimageStatus || preimageStatus.isNone) {
          l.error(`preimageStatus missing: ${preimageStatus}`);
          return null;
        }

        l.log('preimageStatus', JSON.stringify(preimageStatus));

        const preimageStatusJSON = JSON.parse(JSON.stringify(preimageStatus));

        const status = Object.keys(preimageStatusJSON)[0]

        console.log(preimageStatusJSON);
        const preimageStatusEvent = {
          status: Object.keys(preimageStatusJSON)[0],
          deposit: preimageStatusJSON[status].deposit ? preimageStatusJSON[status].deposit[1] : preimageStatusJSON[status][1],
          size: preimageStatusJSON[status].len,
          author: preimageStatusJSON[status].deposit ? preimageStatusJSON[status].deposit[0] : preimageStatusJSON[status][0],
        }

        l.log('preimageStatusEvent', preimageStatusEvent);

        const preimageRaw: any = await api.query.preimage.preimageFor([preimageArguments.hash, preimageStatusEvent.size]);

        let proposal = null;

        const preimage = preimageRaw.unwrapOr(null);

        // const [bytes] = (preimage as unknown) as OldPreimage;
        proposal = constructProposal(api, preimage);

        if(!proposal) {
          l.error(`proposal missing: ${proposal}`);
          return null;
        }

        console.log('proposal', JSON.stringify(proposal));

        const { meta, method, section } = api.registry.findMetaCall(
          proposal.callIndex
        );

        const params = proposal.meta ? proposal.meta.args
        .filter(({ type }): boolean => type.toString() !== 'Origin')
        .map(({ name }) => name.toString()) : [];

        const values = proposal.args;

        const preImageArguments =
          proposal.args &&
          params &&
          params.map((name, index) => {
            return {
              name,
              value: values[index].toString().length > 1000 ? "Large data. Check it on subscan from below link." : values[index].toString()
            };
          });

        proposal = proposal.toHuman();

        l.log('proposal', proposal);

        const args = JSON.parse(JSON.stringify(proposal.args));

        console.log('args', args);

        if (!args) {
          l.error(`args missing: ${args}`);
          return null;
        }

        const result = {
          preImageArguments: preImageArguments,
          method: method.toString(),
          section: section.toString(),
          metaDescription: meta?.docs.toString(),
          origin: args.proposal_origin?.Origins?.toString(),
          preimageHash: preimageArguments.hash,
          enactmentPeriod: args?.enactment_moment?.At || args?.enactment_moment?.After,
          status: preimageStatusV2.NOTED,
          author: preimageStatusEvent.author,
          depositAmount: preimageStatusJSON[status]?.deposit[1],
          length: preimageStatusEvent.size,
        }
        results.push(result);
        l.log(`Nomidot Preimage: ${JSON.stringify(result)}`);
      })
    );

    return results;
  },
  write: async (blockNumber: BlockNumber, value: NomidotPreimageV2[]) => {
    await Promise.all(
      value.map(async prop => {
        const {
          author,
          depositAmount,
          enactmentPeriod,
          preimageHash: h,
          metaDescription,
          method,
          origin,
          preImageArguments: pA,
          section,
          status,
          length,
        } = prop;

        const referenda = await prisma.referendumV2s({
          where: { preimageHash: h.toString() },
          orderBy: 'referendumId_DESC',
        });

        await prisma.createPreimageV2({
          author: author.toString(),
          depositAmount: depositAmount?.toString(),
          hash: h.toString(),
          metaDescription,
          method,
          length: length,
          preimageArguments: {
            create: pA,
          },
          enactmentPeriod: enactmentPeriod?.toString(),
          origin: origin?.toString(),
          preimageStatus: {
            create: {
              blockNumber: {
                connect: {
                  number: blockNumber.toNumber(),
                },
              },
              status,
            },
          },
          referendum: referenda.length != 0
            ? {
                connect: {
                  id: referenda[0].id,
                },
              }
            : null,
          section,
        });
      })
    );
  },
};

export default createPreimageV2;
