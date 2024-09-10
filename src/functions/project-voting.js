import projectVotingABI from "../../smart-contracts-hardhat/ignition/deployments/chain-31337/artifacts/ProjectVotingModule#ProjectVoting.json";
import Web3 from "web3";
import provider from "../web3-provider";

export const getCurrentCycle = async () => {
  const contract = new provider.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
  );
  try {
    const result = await contract.methods.getCurrentCycle().call();
    return result;
  } catch (error) {
    console.error("Error in getCurrentCycle", error);
  }
};

export const getVoters = async (cycle) => {
  const contract = new provider.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
  );
  try {
    const result = await contract.getPastEvents("Voted", {
      fromBlock: 0,
      toBlock: "latest",
    });

    return result
      .filter((x) => x.returnValues.cycle !== cycle)
      .map((event) => ({
        id: event.returnValues.voter,
        name: event.returnValues.name,
        project: event.returnValues.projectId,
        cycle: event.returnValues.cycle,
      }));
  } catch (error) {
    console.error("Error in getting voters:", error);
  }
};

export const getWinners = async (cycle) => {
  const contract = new provider.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
  );
  try {
    const result = await contract.getPastEvents("WinnerAnnounced", {
      fromBlock: 0,
      toBlock: "latest",
    });
    console.log("DEBUG LOG FOR WINNER: ", result);
    return result
      .filter((x) => x.returnValues.cycle !== cycle)
      .reduce((acc, winner) => {
        acc[winner.returnValues.winner] = {
          id: winner.returnValues.winner,
          amount: provider.utils.fromWei(
            winner.returnValues.amount.toString(),
            "ether",
          ),
        };

        return acc;
      }, {});
  } catch (error) {
    console.error("Error in getting winners:", error);
  }
};

export const getProjects = async () => {
  const contract = new provider.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
  );
  try {
    const result = await contract.getPastEvents("ProjectAdded", {
      fromBlock: 0,
      toBlock: "latest",
    });
    return result.map((project) => ({
      id: project.returnValues.projectId,
      title: project.returnValues.projectName,
    }));
  } catch (error) {
    console.error("Error in getting projects:", error);
  }
};

// TODO: get project content from IPFS
export const getProjectById = async (id) => {
  const contract = new provider.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
  );
  try {
    const result = await contract.methods.getProjectById(id).call();
    return result;
  } catch (error) {
    console.error("Error in getProjectById", error);
  }
};

export const getBalance = async () => {
  const contract = new provider.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
  );
  try {
    const result = await contract.methods.getBalance().call();
    return parseFloat(provider.utils.fromWei(result, "ether"));
  } catch (error) {
    console.error("Error in getting balance:", error);
  }
};

export const getThreshold = async () => {
  const contract = new provider.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
  );
  try {
    const result = await contract.methods.getThreshold().call();
    return provider.utils.fromWei(result, "ether");
  } catch (error) {
    console.error("Error in getting threshold:", error);
  }
};

export const checkHasVoted = async (walletAddress) => {
  const contract = new provider.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
  );
  try {
    const result = await contract.methods.checkHasVoted().call({
      from: walletAddress,
    });
    return result;
  } catch (error) {
    console.error("Error in checking if has voted:", error);
  }
};

export const getProjectVoteCounts = async () => {
  const contract = new provider.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
  );

  try {
    const results = await contract.getPastEvents("Voted", {
      fromBlock: 0,
      toBlock: "latest",
    });

    return results.reduce((acc, { returnValues }) => {
      if (!acc[returnValues.projectId]) {
        acc[returnValues.projectId] = 1;
      } else {
        acc[returnValues.projectId]++;
      }
      return acc;
    }, {});
  } catch (error) {
    console.error("Error in getting vote count:", error);
  }
};

export const vote = async (id, amountInEther, name) => {
  const contractAddress = process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS;

  console.log("STARTED VOTE ON CONTRACT: ", contractAddress);

  const contract = new provider.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
  );
  const ethereum = window.ethereum;
  try {
    const minimumEther = 0.001;
    const maximumEther = 0.05;

    if (amountInEther < minimumEther || amountInEther > maximumEther) {
      throw new Error(
        "Invalid amount: amount must be between 0.001 and 0.05 ETH",
      );
    }

    const value = window?.BigInt(
      provider.utils.toWei(amountInEther.toString(), "ether"),
    );

    const topic = provider.utils.keccak256("Voted(address,string,string)");

    provider.eth.subscribe(
      "logs",
      {
        address: process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
        topics: [topic],
      },
      (error, result) => {
        console.log("Vote Event");
        if (!error) console.log("log", result);
      },
    );

    return new Promise(async (resolve, reject) => {
      try {
        const voteMethod = contract.methods.vote(id, name).encodeABI();

        const estimatedGas = await provider.eth.estimateGas({
          from: ethereum.selectedAddress,
          to: process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
          data: voteMethod,
          value: value,
        });

        const options = {
          to: process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
          from: ethereum.selectedAddress,
          value: "0x" + value.toString(16),
          data: voteMethod,
          gas: "0x" + estimatedGas.toString(16),
        };

        provider.eth
          .sendTransaction(options)
          .on("confirmation", async (event) => {
            console.log("TRANSACTION CONFIRMED: ", event);
            resolve();
          })
          .on("error", (error) => {
            console.log("ERROR OCCURED: ", error);
            reject();
          })
          .catch((error) => {
            console.log("ERROR OCCURED: ", error);
            reject(error);
          });
      } catch (error) {
        console.log("Error", error.data.data.reason);
        reject({ message: error.data.data.reason });
      }
    });
  } catch (error) {
    console.error("Error in voting for project:", error);
    throw error;
  }
};

export const getVote = async (walletAddress) => {
  const contract = new provider.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
  );
  try {
    const result = await contract.methods.getVote().call({
      from: walletAddress,
    });

    return result;
  } catch (error) {
    console.error("Error in getting vote:", error);
  }
};
