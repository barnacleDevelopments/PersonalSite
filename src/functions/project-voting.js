import projectVotingABI from "../../smart-contracts/build/contracts/ProjectVoting.json";
import web3 from "../web3-subscription";
import { uploadJson } from "./ipfs";

export async function checkStatus(hash) {
  let receipt = null;

  while (true) {
    try {
      receipt = await web3.eth.getTransactionReceipt(hash);
      if (receipt !== null) {
        if (receipt.status === 1n) {
          console.log("Transaction succeeded");
          return true;
        } else if (receipt.status === 0n) {
          return false;
        }
      } else {
        console.log("Receipt not found, waiting...");
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Error fetching transaction receipt", error);
      break;
    }
  }
}

export const getVoters = async () => {
  const contract = new web3.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS
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
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS
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
          "ether"
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
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS
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
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS
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
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS
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
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS
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
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS
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

export const getVoteCount = async (id) => {
  const contract = new web3.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS
  );
  try {
    const count = await contract.methods.getVoteCount(id).call();
    return count.toString();
  } catch (error) {
    console.error("Error in getting vote count:", error);
  }
};

export const vote = async (id, amountInEther, name) => {
  const contract = new web3.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS
  );
  const ethereum = window.ethereum;
  try {
    const minimumEther = 0.001;
    const maximumEther = 0.05;

    if (amountInEther < minimumEther || amountInEther > maximumEther) {
      throw new Error(
        "Invalid amount: amount must be between 0.001 and 0.05 ETH"
      );
    }
    const data = contract.methods.vote(id, name).encodeABI();

    const value = window?.BigInt(
      web3.utils.toWei(amountInEther.toString(), "ether")
    );

    const estimatedGas = await web3.eth.estimateGas({
      from: ethereum.selectedAddress,
      to: process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
      data: data,
      value: value,
    });

    const transactionParameters = {
      to: process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
      from: ethereum.selectedAddress,
      value: value.toString(16),
      data: data,
      gas: estimatedGas.toString(16),
    };

    const txHash = await ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });

    return txHash;
  } catch (error) {
    console.error("Error in voting for project:", error);
    throw error;
  }
};

export const getVote = async (walletAddress) => {
  const contract = new web3.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS
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

export const getActionCIDs = async (walletAddress) => {
  const contract = new web3.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS
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

export const uploadAction = async (walletAddress, { task, projectId }) => {
  const contract = new web3.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS
  );
  if (window.ethereum) {
    try {
      const data = {
        task,
        projectId,
        walletAddress: walletAddress,
      };

      // const signature = await window.ethereum.request({
      //   method: "personal_sign",
      //   params: [data, walletAddress],
      // });

      const hash = await uploadJson(data);

      const abi = contract.methods.addActions([hash]).encodeABI();

      const estimatedGas = await web3.eth.estimateGas({
        from: walletAddress,
        to: process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
        data: abi,
      });

      const transactionParameters = {
        to: process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
        from: walletAddress,
        data: abi,
        gas: estimatedGas.toString(16),
      };

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      console.log("Action Result: ", txHash);
    } catch (error) {
      console.error("Error signing data:", error);
    }
  } else {
    console.log("MetaMask is not installed!");
  }
};
