import { useState, useEffect, useContext } from "react";
import Web3 from "web3";
import projectVotingABI from "../../backend/build/contracts/ProjectVoting.json";
import { WalletContext } from "../contexts/WalletContext";

const useProjectVoting = (id) => {
  const [voteCount, setVoteCount] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const { walletAddress } = useContext(WalletContext);

  const web3 = new Web3(Web3.givenProvider || "http://localhost:9545");
  const contractAddress = "0x9F88CbE3f79F1a2780ede54480A2e5EfbB73c135";
  const contract = new web3.eth.Contract(projectVotingABI.abi, contractAddress);

  useEffect(() => {
    const init = async () => {
      try {
        await getVoteCount();
        await checkHasVoted();
      } catch (error) {
        console.error("Error in useEffect initialization:", error);
      }
    };
    init();
  }, [id]);

  const checkHasVoted = async () => {
    try {
      const result = await contract.methods.hasVotedForProject().call();
      setHasVoted(result);
    } catch (error) {
      console.error("Error in checking if has voted:", error);
    }
  };

  const getVoteCount = async () => {
    try {
      const count = await contract.methods.getVoteCount(id).call();
      setVoteCount(count.toString() || 0);
    } catch (error) {
      console.error("Error in getting vote count:", error);
    }
  };

  const voteForProject = async () => {
    try {
      const functionData = contract.methods.voteForProject(id).encodeABI();
      const gas = await web3.eth.estimateGas({
        from: walletAddress,
        to: contractAddress,
        data: functionData,
      });

      await contract.methods.voteForProject(id).send({
        from: walletAddress,
        value: web3.utils.toWei("0", "ether"),
        gas: gas * 5n,
      });

      await getVoteCount(id);
    } catch (error) {
      console.error("Error in voting for project:", error);
    }
  };

  return { voteCount, hasVoted, getVoteCount, voteForProject, checkHasVoted };
};

export default useProjectVoting;
