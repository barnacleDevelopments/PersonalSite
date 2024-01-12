import { useState, useContext, useEffect } from "react";
import Web3 from "web3";
import projectVotingABI from "../../backend/build/contracts/ProjectVoting.json";
import { WalletContext } from "../contexts/WalletContext";

const useProjectVoting = () => {
  const [hasVoted, setHasVoted] = useState(false);
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

      setHasVoted(result);
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

  const vote = async (id, amountInEther) => {
    try {
      console.log(amountInEther);
      const minimumEther = 0.001;
      const maximumEther = 0.05;
      if (amountInEther >= minimumEther && amountInEther <= maximumEther) {
        const data = contract.methods.vote(id).encodeABI();
        const value = web3.utils.toWei(amountInEther.toString(), "ether");
        const estimatedGas = await web3.eth.estimateGas({
          from: walletContext.walletAddress,
          to: process.env.PROJECT_VOTING_CONTRACT_ADDRESS,
          data,
          value,
        });

        // const gasBuffer = (estimatedGas * 20n) / 100n;
        // estimatedGas += gasBuffer;

        const params = [
          {
            from: walletContext?.walletAddress,
            to: process.env.PROJECT_VOTING_CONTRACT_ADDRESS,
            data,
            gas: web3.utils.toHex(estimatedGas),
            value,
          },
        ];

        return await window.ethereum.request({
          method: "eth_sendTransaction",
          params,
        });
      } else {
        console.error(
          "Error in voting for project: amount must be greater than 0.001 ETH"
        );
      }
    } catch (error) {
      const decodedError = web3.eth.abi.decodeParameters(
        ["uint256", "uint256", "uint256"],
        error.data
      );
      console.error("Error in voting for project:", decodedError);
      throw Error("Error in voting for project:", decodedError);
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
    hasVoted,
    getVoteCount,
    vote,
    checkHasVoted,
    getVote,
    threshold,
    getBalance,
    checkStatus,
  };
};

export default useProjectVoting;
