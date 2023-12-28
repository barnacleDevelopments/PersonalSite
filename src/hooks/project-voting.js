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

  useEffect(() => {
    const init = async () => {
      try {
        await checkHasVoted();
      } catch (error) {
        console.error("Error in useEffect initialization:", error);
      }
    };
    init();
  }, []);

  const checkHasVoted = async () => {
    try {
      const result = await contract.methods.hasVotedForProject().call({
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
    if (id < 0) return 0;
    try {
      const count = await contract.methods.getVoteCount(id).call({
        from: walletAddress,
      });
      return count.toString();
    } catch (error) {
      console.error("Error in getting vote count:", error);
    }
  };

  const voteForProject = async (id) => {
    if (id < 0) return console.error("No project id provided", id);

    try {
      // check if already vote
      const amountInEther = "0.01";
      const data = contract.methods.voteForProject(id).encodeABI();
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
      console.log(params);
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params,
      });
      console.log("txHash", txHash);
    } catch (error) {
      console.error("Error in voting for project:", error);
    }
  };

  return { hasVoted, getVoteCount, voteForProject, checkHasVoted };
};

export default useProjectVoting;
