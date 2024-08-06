import projectVotingABI from "../../smart-contracts/build/contracts/ProjectVoting.json";
import web3 from "../web3-subscription";

export const getVoters = async () => {
  const contract = new web3.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
  );
  try {
    const result = await contract.getPastEvents("Voted", {
      fromBlock: 0,
      toBlock: "latest",
    });

    return result.map((event) => ({
      id: event.returnValues.voter,
      name: event.returnValues.name,
      project: event.returnValues.projectId,
    }));
  } catch (error) {
    console.error("Error in getting voters:", error);
  }
};

export const getWinners = async () => {
  const contract = new web3.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
  );
  try {
    const result = await contract.getPastEvents("WinnerAnnounced", {
      fromBlock: 0,
      toBlock: "latest",
    });
    return result.reduce((acc, winner) => {
      acc[winner.returnValues.winner] = {
        id: winner.returnValues.winner,
        amount: web3.utils.fromWei(
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
  const contract = new web3.eth.Contract(
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
  const contract = new web3.eth.Contract(
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
  const contract = new web3.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
  );
  try {
    const result = await contract.methods.getBalance().call();
    return parseFloat(web3.utils.fromWei(result, "ether"));
  } catch (error) {
    console.error("Error in getting balance:", error);
  }
};

export const getThreshold = async () => {
  const contract = new web3.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
  );
  try {
    const result = await contract.methods.getThreshold().call();
    return web3.utils.fromWei(result, "ether");
  } catch (error) {
    console.error("Error in getting threshold:", error);
  }
};

export const checkHasVoted = async (walletAddress) => {
  const contract = new web3.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
  );
  try {
    const result = await contract.methods.checkHasVotedForCycle().call({
      from: walletAddress,
    });
    return result;
  } catch (error) {
    console.error("Error in checking if has voted:", error);
  }
};

export const getVoteCount = async (id) => {
  const contract = new web3.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
  );
  try {
    const count = await contract.methods.getCycleVoteCount(id).call();
    return count.toString();
  } catch (error) {
    console.error("Error in getting vote count:", error);
  }
};

export const vote = async (id, amountInEther, name) => {
  const contractAddress = process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS;

  console.log("STARTED VOTE ON CONTRACT: ", contractAddress);

  const contract = new web3.eth.Contract(
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
    const data = contract.methods.vote(id, name).encodeABI();

    const value = window?.BigInt(
      web3.utils.toWei(amountInEther.toString(), "ether"),
    );

    const estimatedGas = await web3.eth.estimateGas({
      from: ethereum.selectedAddress,
      to: process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
      data: data,
      value: value,
    });

    const topic = web3.utils.keccak256("Voted(address,string,string)");

    var subscription = web3.eth.subscribe(
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

    contract.methods
      .vote(id, name)
      .send({
        from: ethereum.selectedAddress,
        value: "0x" + value.toString(16),
        gas: "0x" + estimatedGas.toString(16),
      })
      .on("confirmation", (event) => {
        console.log("TRANSACTION CONFIRMED: ", event);
      })
      .on("error", (error) => {
        console.log("ERROR OCCURED: ", error);
      });
  } catch (error) {
    console.error("Error in voting for project:", error);
    throw error;
  }
};

export const getVote = async (walletAddress) => {
  const contract = new web3.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
  );
  try {
    const result = await contract.methods.getVoteCycleChoice().call({
      from: walletAddress,
    });

    return result;
  } catch (error) {
    console.error("Error in getting vote:", error);
  }
};

export const getActionCIDs = async (walletAddress) => {
  const contract = new web3.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
  );
  try {
    const result = await contract.methods.getAddressAction().call({
      from: walletAddress,
    });

    return result;
  } catch (error) {
    console.error("Error in getting address actions");
  }
};
