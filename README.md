# Introduction

This repository is my personal portfolio site! I'm publicaly documenting the development process so that others can have a example project to build their own decentralized portfolio websites.

## Decentralized Feedback Framework: Gated Rewards for Feedback (WIP)

This website includes a decentralized element where users can utilize a smart contract designed to insentivice feedback. This smart contract is designed to help people recieve geniune feedback on "things" through offering tangible rewards for genuine interactions. Geniune feedback is a hard thing to crowd source because credibility is hard to ensure.

The solution to this is putting the feedback receiver in control. Everyone knows what it feels like to receive genuine feedback. When we know we have received genuine feedback we are much more likely to reward those who have given it. Paying people directly for feedback is not enough because this only results in the bare minimum for the reward. Rewards should be gated so that the receiver determines when they are satified with the feedback they have received. Further, feedback providers should have the opportunity to gain credibility to no only signal their worth but to increase their chances of compensation. The planned incentivised behaviors are the following.

1. `COMMENTING` is short form piece of feedback that provides a deeper level of interest (MVP).
2. `REVIEW` is a long form pieve of feedback that provides a deep level of interest.
3. `SPONSOR` is a long term investment from an individual and shows a exeptional level of interest. (Still thinking about this)

There are two roles that the contract users can participate in:

1. `Feedback Recievers` Those recieving feedback
2. `Feedback Providers` Those providing feedback

## Registering Feedback Items (MVP)

`Feedback Items` are references to things `Feedback Providers` can provide feedback on. The `Feedback Recievers` add `Feedback Items` to the smart contract utilizing the `addFeedbackBundle` function of the smart contract. Each `Feedback Bundle` contains a `rewardBalance`, a `itemId`, and a `prizeReleaseDate`. 30% of the prize balance is given back to the feedback reciever for choosing a winner. The `Feedback Receiver` can perform a withdraw of their prize balance with a 30% penalty only if they have already received feedback. This penalty is distributed to all `Feedback Provider` who have provided feedback on the `Feedback Item` in question.

## Providing Feedback on Items (MVP)

To provide feedback on items users use the `provideFeedback` function. It takes 3 arguments including the `receiverAddress`, `itemId`, and `feedbackId`. The `feedbackId` needs to be signed by the `Feedback Provider` to be considered valid.

### Ideas

- Eventually have mutliple `feedbackIds`?

## Recieving Feedback on Items (MVP)

If `Feedback Providers` manage to provide feedback that is useful to the `Feedback Reciever` they may receive the `Feedback Bundle` reward. When the `Feedback Reciever` receives a piece of feedback they are satified with, they choose a `Feedback Provider` using the `sendReward` function to recieve the `Feedback Bundle` reward.

### Ideas

- The `Feedback Receiver` can decide to provide `sponsored gas` which allows the first few `Feedback Providers` to provide feedback without paying gas fees. This kick starts the feedback process.

## Reward Settelment (MVP)

Prizes are distributed in two ways. The first is triggered when the `Feedback Provider` choses the winner. This can only happen once at least one piece of feedback is provided to an item. A percentage of the feedback prize is given back to the feedback reciever as a reward for choosing a winner. Choosing a winner has a side effect of giving the feedback provider `Feedback Tokens`.

_Feedback tokens are used in the future to signal the quality of `Feedback Provider's` feedback to prospective `Feedback Recievers`._

The second way prizes are released is on the prize release date. The `settleBundle` method can be called at any time by anyone with a item id and `Feedback Reciever` address. When this method is called it checks the bundle release time to insure that it's past the schedualed deadline and if it is, the prize will be released randomly using the Chainlink VRF for verifiable randomness. This release method is crutial to insure that the prize is eventually released. Gaining tokens gives you a higher probably of recieving the prize balance in this random selection process. This rewards `Feedback Providers` for gaining reputations on the contract.

_During a random selection `Feedback Tokens` are still distributed to the winner but at a reduced amount._

### Contract Demonstration

To demonstrate this contract I have implemented it into my portfolio website. Users can provide feedback on my projects. It's a simple demonstration but clearly shows how the contract works.

## Ideas

1. Voting on a project could later reward a user for their honest feedback. A complete history of project files are stored on Arweave to provide a transparent history of a project over time. Users can see how a project changes over time through adjutments made to the files.
2. Later I want to add a feature where if a project changes as a result of feedback it has recieved, the user who provided that feedback will be rewarded.
3. Feedback providers should unlock new capabilities once they have reached a threshold of feedback tokens. Maybe they could create partical feedback and full access to that feedback is provided if the feedback reciever pays for it.

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
