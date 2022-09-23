// Copyright 2018-2020 @paritytech/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import {
  BlockNumber,
  Hash
} from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';
import { prisma } from '../generated/prisma-client';
import { filterEvents } from '../util/filterEvents';
import {
  Cached,
  NomidotReferendumVote,
  Task,
} from './types';

const l = logger('Task: Referendum Votes');

// const eventField = [
// 	'voter',
//   'refIndex',
//   'vote',
// ];

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
        	referendumVoteEvents.map(async ({ event: { data } }) => {
                const rawData: any = data.toHuman();
                const refIndex: number = rawData[1];
                const voter: string = rawData[0];
                const vote: string = rawData[2]?.Standard?.vote?.vote
                const conviction: string = rawData[2]?.Standard?.vote?.conviction
                const lockedValue: string = rawData[2]?.Standard?.balance

                l.log(`Nomidot input for vote event ${refIndex}, ${voter}, ${vote}, ${conviction}, ${lockedValue}`);

                if(!vote || !voter || !conviction || !lockedValue || !refIndex){
                    l.error(`Nomidot unexpected input for vote event ${JSON.stringify(rawData, null, 2)}`)
                    return null
                }

                const voteData: NomidotReferendumVote = {
                    refIndex: refIndex,
                    voter: voter,
                    vote: vote ,
                    conviction: conviction,
                    lockedValue: lockedValue
                }

                l.log(`Nomidot referendum vote: ${JSON.stringify(voteData)}`);
                
                results.push(voteData);
            })
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
                lockedValue,
                conviction
            } = prop;
    
            await prisma.createReferendumVote({
              voter: voter.toString(),
              vote: vote,
              lockedValue: lockedValue.toString(),
              conviction: conviction,
              blockNumber: {
                connect: {
                  number: blockNumber.toNumber(),
                },
              },
              referendum: {
                connect: {
                  referendumId: Number(refIndex),
                },
              },
            });
          })
        );
      },
};

export default createReferendumVote;
