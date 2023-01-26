import { ApiPromise, WsProvider } from '@polkadot/api';


export async function nodeWatcher() {

  const provider = new WsProvider('ws://127.0.0.1:9944');

  const api = await ApiPromise.create({ provider });

  setInterval(async () => {
    console.log(api.isConnected)
  }, 1000);
}

nodeWatcher().then(() => console.log('done')).catch(console.error);