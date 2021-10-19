import fetch from 'node-fetch'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import apolloClient from 'apollo-client';
const { ApolloClient } = apolloClient
import { sendmail, fetchLastBlockNumber } from './utils.js';

const url = process.env.KARURA_HASURA_GRAPHQL || 'https://karura-hasura.herokuapp.com/v1/graphql'

const httpLink = createHttpLink({
  uri: url,
  fetch: fetch
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

function graphqlApiCall(query) {
  return client
    .query({
      query: query
  })
  .then(
    results => {return results.data.blockNumbers[0].number}
  ).catch(e =>
    console.error('Something wrong with apollo', e));
}

import { ApiPromise, WsProvider } from '@polkadot/api'

const ARCHIVE_NODE_ENDPOINT = 'wss://kusama-rpc.polkadot.io'
const provider = new WsProvider(ARCHIVE_NODE_ENDPOINT);
// const ARCHIVE_NODE_ENDPOINT = 'wss://rpc.polkadot.io';

async function main () {

  const blockNumber = await graphqlApiCall(fetchLastBlockNumber);
  console.log(blockNumber);

  const api = await ApiPromise.create({provider});

  const unsubscribe = await api.rpc.chain.subscribeNewHeads((header) => {
    console.log(`Chain is at block: ${header.number}`);
    unsubscribe();
    if (header.number - blockNumber > 10){
      sendmail();
    }
    process.exit(0);
  });
}

main().catch(console.error);


