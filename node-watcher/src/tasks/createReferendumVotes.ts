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
  NomidotReferendumRawVoteEvent,
  NomidotReferendumVote,
  Task,
} from './types';

const l = logger('Task: Referendum Votes');

const eventField = [
	'voter',
    'refIndex',
    'vote',
];

/*
 *  ======= Table (createReferendumVote) ======
 */
const createReferendumVote: Task<NomidotReferendumVote[]> = {
    name: 'createReferendumVote',
    read: async (
        blockHash: Hash,
        cached: Cached,
        api: ApiPromise
    ): Promise<NomidotReferendumVote[]> => {
        const { events } = cached;

        const referendumVoteEvents = filterEvents(
            events,
            'democracy',
            'Voted'
        );

        const results: NomidotReferendumVote[] = [];

        await Promise.all(
        	referendumVoteEvents.map(async ({ event: { data, typeDef } }) => {
                const referendumVoteRawEvent: NomidotReferendumRawVoteEvent = data.reduce(
                    (prev, curr, index) => {
                        let type = eventField[index];
                        console.log(index, curr.toJSON());
                        return {
                            ...prev,
                            [type]: curr.toJSON(),
                        };
                    },
                    {});
                    l.log(`referendumVoteRawEvent: ${JSON.stringify(referendumVoteRawEvent)}`);
                    console.log('ref', JSON.stringify(referendumVoteRawEvent));
                    if (
                        !referendumVoteRawEvent.refIndex &&
                        referendumVoteRawEvent.refIndex !== 0
                    ) {
                        l.error(
                            `Expected refIndex missing in the event: ${referendumVoteRawEvent.refIndex}`
                        );
                        return null;
                    }
                    if (
                        !referendumVoteRawEvent.vote ||
                        !referendumVoteRawEvent.voter
                    ) {
                        l.error(
                            `Expected referendum vote event: ${ JSON.stringify(referendumVoteRawEvent)}`
                        );
                        return null;
                    }
                    const vote: NomidotReferendumVote = {
                        refIndex: referendumVoteRawEvent.refIndex,
                        voter: referendumVoteRawEvent.voter,
                        vote: Object(referendumVoteRawEvent?.vote)['standard']['vote'],
                        lockedValue: Object(referendumVoteRawEvent?.vote)['standard']['balance']
                    }
                    l.log(`Nomidot referendum vote: ${JSON.stringify(vote)}`);
                    results.push(vote);
                }
            )
        );
        return results;
    },
    write: async (blockNumber: BlockNumber, value: NomidotReferendumVote[]) => {
        await Promise.all(
          value.map(async prop => {
            const {
                refIndex,
                voter,
                vote,
                lockedValue
            } = prop;
    
            await prisma.createReferendumVote({
              voter: voter.toString(),
              vote: vote,
              lockedValue: lockedValue.toString(),
              blockNumber: {
                connect: {
                  number: blockNumber.toNumber(),
                },
              },
              referendum: {
                connect: {
                    referendumId: refIndex,
                },
              },
            });
          })
        );
      },
};

export default createReferendumVote;
