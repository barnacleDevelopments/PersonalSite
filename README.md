# Introduction

This repository is my personal portfolio site! I'm publicaly documenting the development process so that others can have a example project to build their own decentralized portfolio websites.

# Live Deployment

You can view the live deployed website at [devdeveloper.ca](https://devdeveloper.ca/). It is also hosted on [Fleek](https://app.fleek.xyz/) and can be accessed via the Ethereum Name Service (ENS) at [devdeveloper.eth](devdeveloper.eth).

Please note that while ENS is operational, it is still in the early stages of adoption, so accessibility may vary. For the best experience when using ENS, consider using a browser like Brave, which supports blockchain technologies and ENS natively. This means it can resolve ENS names directly without needing additional extensions or configurations.

Alternatively, you can access the site through a `.limo` extension, which provides a straightforward way to reach Ethereum-based domains by resolving them through a specific service designed for this purpose. This can be particularly useful if you're using a browser that doesn’t natively support ENS.

# Setup

This repository contains two projects:

- Main GatsbyJs Project
- Smart Contract Project (developed with Hardhat)

## Smart Contract Project

The smart contract project is what runs the `/projects` page of my site.

The smart contract project uses Hardhat for development. Follow these steps to set up a local blockchain environment. For detailed setup instructions, refer to the [Hardhat documentation](https://hardhat.org/docs).

All commands below should be run inside the `smart-contracts-hardhat` directory.

### Install Dependencies

```bash
cd smart-contracts-hardhat
npm install
```

### Start the Local Blockchain:

```bash
npx hardhat node
```

#### Create Environment Variable File

Create `.env` file inside the smart-contracts-hardhat directory.

**Production Deployment Network Variables**
These variables are used to deploy the project voting smart contract to the blockchain. Both these variables are only required for production deploy. You should keep these private, especially the private key.

- `PRIVATE_KEY` Wallet private key for deploy
- `SEPOLIA_URL` RPC test node url for deploy
- `ETHERIUM_URL` RPC production node url for deploy
- `ARWEAVE_WALLET_ADDRESS` Arweave wallet address to retrieve project markdown files.
- `ARWEAVE_TAG_PROJECT_FILE_VERSION` Arweave tag to retrieve project files by version.

**Verifiable Randomness Function (VRF) Variables**
These variables are public ids that are used to reference a VRF instance. These are required for choosing the winner when the prize pool reaches the threshold in the project voting smart contract.

You can readmore about VRF on their [official documentation](https://docs.chain.link/vrf).

- VRF_KEY_HASH
- VRF_SUBSCRIPTION_ID
- VRF_COORDINATOR_ADDRESS_SEPOLIA

#### TODO: Setup CCIP local simulator

The CCIP local simular allows us to run Chainlink services locally for development purposes. This project utilizes Chainlink VRF to create verifiable randomness on the blockchain.

#### Deploy the Project Voting Smart Contract Localy Using Hardhat Ignition

This command will use the hardhat ignition script to deploy a local version of the smart contract on the hardhat node. The script does the following tasks:

1. Deploys the smart contract.
2. Retrieves project transaction ids and data from Arweave. The script uses the Arweave wallet address environment variable to find the project files. Also, a project version tag is used to retrieve the correct file type (this is nessisary because I'm iterating on the markdown format to eventually move to using MDX).
3. Create a project on the smart contract for each Arweave project.

```bash
npx hardhat ignition deploy ./ignition/modules/ProjectVoting.ts --network localhost --reset
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

Take note of the smart contract address `0x68B1D87F95878fE05B998F19b66F4baba5De1aed`.

#### Initialize and Apply Projects to the Blockchain:

Run the initialization script to add new projects to the local blockchain. You can then see these projects on the `/projects` page.

```bash

npx hardhat --network localhost run scripts/create-projects.js
```

#### TODO: Test Scripts

There is a test script for the project voting smart contract and all should pass before proceeding.

```bash
npx hardhat test
```

#### TODO: The Graph Subgraph Integration

I plan on updating this project to utilize the [The Graph](https://thegraph.com/) which is a blockchain indexer for efficient data querying. This project currently interacts directly with the RPC layer through the injected `ethereum provider` of the browser.

#### TODO: Arweave Integration

I plan on changing the content source of my project from local files stored on the repository to files stored on [Arweave](https://arweave.org/build) to futher decentralize my project. These assets will be pulled from arweave at build time to staticaly generate pages. This will make page load times fast and prevent needing to access arweave for every page load. A link to the original file will be provided on the static page for cross-reference.

_The point of storing the projects on Arweave is to have a permanent reference to their existence (immutibility). Each file stored on Arweave is writen in markdown and all images referenced within are links to image files also stored on Arweave. This is crutial to insure that there is always a reference to the file in a specific state to insure transparency in the voting process. This is a demonstration of how democratic voting would work on the blockchain using smart contracts and decentralized storage solutions._

##### Steps:

- Create a gatsby-source-arweave project

## GatsbyJS Project

GatsbyJs is a powerful static site generator. You can read more about it on their [offical documentation](https://www.gatsbyjs.com/docs).

### Create `.env` file for development

The following variables are used to comunicate for with the project voting smart contract. On the `/projects` page. For the `GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS` variable use the contract address from the smart contract deployment.

- GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS=0x68B1D87F95878fE05B998F19b66F4baba5De1aed
- GATSBY_WEB3_HTTPS_URL="http://localhost:8545"
- GATSBY_WEB3_WS_URL="ws://localhost:8545"
- GATSBY_WEB3_NETWORK="Local"

### Install Gatsby Project Dependencies

```bash
npm install
```

### Run Gatsby Project

```bash
npm run develop
```

# Additional Resources:

- [Areweave Cost Qualculator](https://ar-fees.arweave.dev/)
- [Arweave Documentation](https://arweave.org/build)
- [Arweave File Upload Documentation](https://cookbook.arweave.dev/concepts/post-transactions.html)
- [Arweave GraphQL Guide](https://gql-guide.arweave.dev/)
- [Create a Gatsby Source Plugin](https://www.gatsbyjs.com/docs/tutorial/creating-a-source-plugin/part-0/)
