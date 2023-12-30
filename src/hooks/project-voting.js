import { useState, useEffect, useContext } from "react";
import Web3 from "web3";
import projectVotingABI from "../../backend/build/contracts/ProjectVoting.json";
import { WalletContext } from "../contexts/WalletContext";

const useProjectVoting = () => {
  const [hasVoted, setHasVoted] = useState(false);
  const { walletAddress } = useContext(WalletContext);

  const web3 = new Web3(Web3.givenProvider || "http://localhost:9545");
  const contractAddress = "0x9F88CbE3f79F1a2780ede54480A2e5EfbB73c135";
  const contract = new web3.eth.Contract(projectVotingABI.abi, contractAddress);

  const checkHasVoted = async () => {
    try {
      const result = await contract.methods.checkHasVoted().call({
        from: walletAddress,
      });

      console.log("has voted", result);
      setHasVoted(result);
    } catch (error) {
      console.error("Error in checking if has voted:", error);
    }
  };

  const getVoteCount = async (id) => {
    console.log("Rerieving vote count for project:", id);
    try {
      const count = await contract.methods.getVoteCount(id).call({
        from: walletAddress,
      });

      console.log("vote count", count);
      return count.toString();
    } catch (error) {
      console.error("Error in getting vote count:", error);
    }
  };

  const vote = async (id) => {
    try {
      const amountInEther = "0.01";
      const data = contract.methods.vote(id).encodeABI();
      const value = web3.utils.toWei(amountInEther, "ether");
      const gas = await web3.eth.estimateGas({
        from: walletAddress,
        to: contractAddress,
        data,
        value,
      });
      const params = [
        {
          from: walletAddress,
          to: contractAddress,
          data,
          gas: web3.utils.toHex(gas),
          value,
        },
      ];
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params,
      });
      console.log("txHash", txHash);
    } catch (error) {
      console.error("Error in voting for project:", error);
    }
  };

  const getVote = async () => {
    try {
      const result = await contract.methods.getVote().call({
        from: walletAddress,
      });

      return result;
    } catch (error) {
      console.error("Error in getting vote:", error);
    }
  };

  return { hasVoted, getVoteCount, vote, checkHasVoted, getVote };
};

export default useProjectVoting;
