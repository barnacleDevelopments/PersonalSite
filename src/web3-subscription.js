import Web3 from "web3";

// const provider = new WebSocketProvider(
//   process.env.GATSBY_WEB3_HTTPS_URL,
//   {},
//   {
//     delay: 500,
//     autoReconnect: true,
//     maxAttempts: 10,
//   },
// );
//
export default new Web3(Web3.givenProvider || process.env.GATSBY_WEB3_WS_URL);
