import { useState, useContext } from "react";
import Web3 from "web3";
import projectVotingABI from "../../backend/build/contracts/ProjectVoting.json";
import { WalletContext } from "../contexts/WalletContext";

const useProjectVoting = () => {
  const [hasVoted, setHasVoted] = useState(false);
  const walletContext = useContext(WalletContext);

  const web3 = new Web3(Web3.givenProvider || process.env.WEB3_HTTPS_URL);

  const contract = new web3.eth.Contract(
    projectVotingABI.abi,
    process.env.PROJECT_VOTING_CONTRACT_ADDRESS
  );

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

  const vote = async (id) => {
    try {
      const amountInEther = "0.01";
      const data = contract.methods.vote(id).encodeABI();
      const value = web3.utils.toWei(amountInEther, "ether");
      const gas = await web3.eth.estimateGas({
        from: walletContext.walletAddress,
        to: process.env.PROJECT_VOTING_CONTRACT_ADDRESS,
        data,
        value,
      });
      const params = [
        {
          from: walletContext?.walletAddress,
          to: process.env.PROJECT_VOTING_CONTRACT_ADDRESS,
          data,
          gas: web3.utils.toHex(gas),
          value,
        },
      ];
      await window.ethereum.request({
        method: "eth_sendTransaction",
        params,
      });
    } catch (error) {
      console.error("Error in voting for project:", error);
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

  return { hasVoted, getVoteCount, vote, checkHasVoted, getVote };
};

export default useProjectVoting;
