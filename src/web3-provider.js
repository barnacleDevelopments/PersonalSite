import Web3 from "web3";

export default new Web3(
  typeof window !== "undefined"
    ? window.ethereum || process.env.GATSBY_WEB3_WS_URL
    : process.env.GATSBY_WEB3_WS_URL,
);
