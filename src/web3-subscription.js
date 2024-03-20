import Web3 from "web3";

export default new Web3(
  Web3.givenProvider || process.env.GATSBY_WEB3_HTTPS_URL
);
