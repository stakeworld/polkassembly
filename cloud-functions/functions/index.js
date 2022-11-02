const functions = require("firebase-functions");

require("@polkadot/api-augment");

const {ApiPromise, WsProvider} = require("@polkadot/api");
const cors = require("cors");

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const getEndpoint = (network) => {
  switch (network) {
    case "kusama":
      return "wss://kusama-rpc.polkadot.io";
    case "polkadot":
      return "wss://rpc.polkadot.io";
    default:
      return "";
  }
};

const corsHandler = cors({origin: true});

exports.proxies = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    const network = request.query.network?.toString();
    const address = request.query.address?.toString();

    if (!network) {
      return response.json({
        error: "Network not provided",
      });
    }

    if (!address) {
      return response.json({
        error: "Address not provided",
      });
    }

    const WS_PROVIDER = getEndpoint(network);

    if (!WS_PROVIDER) {
      return response.json({
        error: "Network not valid",
      });
    }

    const provider = new WsProvider(WS_PROVIDER);
    const api = new ApiPromise({provider});

    await api.isReady;

    const result = await api.query.proxy.proxies(address);

    const proxies = [];

    result[0].forEach((account) => {
      proxies.push(account.delegate.toString());
    });

    response.json({
      proxies,
    });
  });
});
