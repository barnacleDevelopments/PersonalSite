import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const urlSepolia = process.env.SEPOLIA_URL;
const privateKey = process.env.PRIVATE_KEY as string;

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    sepolia: {
      url: urlSepolia,
      accounts: [privateKey],
    },
  },
};

export default config;
