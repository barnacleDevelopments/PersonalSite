# Setup

This repository contains two projects:

- Main GatsbyJs Project
- Smart Contract Project (developed with Hardhat)

## Install Project Dependencies

Install Gatsby Project Dependencies:

```bash
npm install
```

## Install Smart Contract Dependencies:

```bash
cd smart-contracts-hardhat
npm install
```

## Run Gatsby Project

GatsbyJs is a powerful static site generator. You can read more about it on their [offical documentation](https://www.gatsbyjs.com/docs).

### Create `.env` file for development

The following variables are used to comunicate for with the project voting smart contract. On the `/projects` page.

- GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS
- GATSBY_WEB3_HTTPS_URL="http://localhost:8545"
- GATSBY_WEB3_WS_URL="ws://localhost:8545"
- GATSBY_WEB3_NETWORK="Local"

## Start the Project

```bash
npm run develop
```

## Run Smart Contract Project

The smart contract project uses Hardhat for development. Follow these steps to set up a local blockchain environment. For detailed setup instructions, refer to the Hardhat documentation.

All commands below should be run inside the smart-contracts-hardhat directory.

### Start the Local Blockchain:

```bash
npx hardhat node
```

### Deploy the Smart Contract:

Their are several steps to get the local development environment setup for smart contract development. Hardhat makes the process much easier.

#### Create Environment Variable File

Create `.env` file inside the smart-contracts-hardhat directory.

**Production Deployment Network Variables**

- MNEMONIC
- SEPOLIA_URL

**Verifiable Randomness Function (VRF) Variables**

You can readmore about VRF on their [official documentation](https://docs.chain.link/vrf).

- VRF_KEY_HASH
- VRF_SUBSCRIPTION_ID
- VRF_COORDINATOR_ADDRESS_SEPOLIA

#### TODO: Setup CCIP local simulator

The CCIP local simular allows us to run Chainlink services locally for development purposes. This project utilizes Chainlink VRF to create verifiable randomness on the blockchain.

#### Deploy the Project Voting Smart Contract Locally Using Hardhat Ignition

```bash
npx hardhat ignition deploy ./ignition/modules/ProjectVoting.ts --network localhost --reset
Example Output:
```

**Output:**

```bash
✔ Confirm deploy to network localhost (1337)? … yes
✔ Confirm reset of deployment "chain-1337" on chain 1337? … yes
0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae
31086227373420339012238125121383490468463288885464863631894038698457908591621
0x9ddfaca8183c41ad55329bdeed9f6a8d53168b1b
Hardhat Ignition 🚀

Deploying [ ProjectVotingModule ]

Batch #1
Executed ProjectVotingModule#ProjectVoting

[ ProjectVotingModule ] successfully deployed 🚀

Deployed Addresses:

ProjectVotingModule#ProjectVoting - 0x68B1D87F95878fE05B998F19b66F4baba5De1aed
```

## Initialize and Apply Projects to the Blockchain:

Run the initialization script to add new projects to the local blockchain:

```bash

npx hardhat --network localhost run scripts/create-projects.js
```
