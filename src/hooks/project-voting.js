import { useState, useContext, useEffect } from "react";
import Web3 from "web3";
import projectVotingABI from "../../backend/build/contracts/ProjectVoting.json";
import { WalletContext } from "../contexts/WalletContext";

const useProjectVoting = () => {
  const [threshold, setThreshold] = useState(0);
  const walletContext = useContext(WalletContext);

  const web3 = new Web3(Web3.givenProvider || process.env.WEB3_HTTPS_URL);

  const contract = new web3.eth.Contract(
    projectVotingABI.abi,
    process.env.PROJECT_VOTING_CONTRACT_ADDRESS
  );

  useEffect(() => {
    async function init() {
      setThreshold(await getThreshold());
    }

    init();
  }, []);

  async function checkStatus(hash) {
    let receipt = null;

    while (true) {
      try {
        receipt = await web3.eth.getTransactionReceipt(hash);
        if (receipt !== null) {
          if (receipt.status === 1n) {
            console.log("Transaction succeeded");
            return true;
          } else if (receipt.status === 0n) {
            console.log("Transaction has been reverted by the EVM");
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

  const getVoters = async () => {
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

  const getWinners = async () => {
    try {
      const result = await contract.getPastEvents("WinnerAnnounced", {
        fromBlock: 0,
        toBlock: "latest",
      });
      return result.reduce((acc, winner) => {
        console.log("WinnerAnnounced", winner);
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

  const getProjects = async () => {
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

  const getBalance = async () => {
    try {
      const result = await contract.methods.getBalance().call({
        from: walletContext.walletAddress,
      });
      return parseFloat(web3.utils.fromWei(result, "ether"));
    } catch (error) {
      console.error("Error in getting balance:", error);
    }
  };

  const getThreshold = async () => {
    try {
      const result = await contract.methods.getThreshold().call({
        from: walletContext.walletAddress,
      });
      return web3.utils.fromWei(result, "ether");
    } catch (error) {
      console.error("Error in getting threshold:", error);
    }
  };

  const checkHasVoted = async () => {
    try {
      const result = await contract.methods.checkHasVoted().call({
        from: walletContext.walletAddress,
      });
      return result;
    } catch (error) {
      console.error("Error in checking if has voted:", error);
    }
  };

  const getVoteCount = async (id) => {
    try {
      const count = await contract.methods.getVoteCount(id).call({
        from: walletContext.walletAddress,
      });
      return count.toString();
    } catch (error) {
      console.error("Error in getting vote count:", error);
    }
  };

  const vote = async (id, amountInEther, name) => {
    try {
      const minimumEther = 0.001;
      const maximumEther = 0.05;

      if (amountInEther >= minimumEther && amountInEther <= maximumEther) {
        const data = contract.methods.vote(id, name).encodeABI();
        const value = web3.utils.toWei(amountInEther.toString(), "ether");

        const estimatedGas = await web3.eth.estimateGas({
          from: walletContext.walletAddress,
          to: process.env.PROJECT_VOTING_CONTRACT_ADDRESS,
          data,
          value,
        });

        const receipt = await contract.methods
          .vote(id, name)
          .send({ from: walletContext.walletAddress, value, gas: estimatedGas })
          .on("transactionHash", console.log)
          .on("receipt", console.log);

        return receipt.transactionHash;
      } else {
        console.error(
          "Error in voting for project: amount must be between 0.001 and 0.05 ETH"
        );
        throw new Error(
          "Invalid amount: amount must be between 0.001 and 0.05 ETH"
        );
      }
    } catch (error) {
      // Decode the error using the ABI decoder
      const decodedError = web3.eth.abi.decodeParameters(
        ["uint256", "uint256", "uint256"],
        error.data
      );
      console.error("Error in voting for project:", decodedError);
      throw new Error("Error in voting for project: " + decodedError);
    }
  };

  const getVote = async () => {
    try {
      const result = await contract.methods.getVote().call({
        from: walletContext?.walletAddress,
      });

      return result;
    } catch (error) {
      console.error("Error in getting vote:", error);
    }
  };

  return {
    getVoteCount,
    vote,
    checkHasVoted,
    getVote,
    threshold,
    getBalance,
    checkStatus,
    getWinners,
    getProjects,
    getVoters,
  };
};

export default useProjectVoting;
