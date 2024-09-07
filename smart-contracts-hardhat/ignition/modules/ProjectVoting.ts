import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import "dotenv/config";

console.log(process.env.VRF_KEY_HASH);
console.log(process.env.VRF_SUBSCRIPTION_ID);
console.log(process.env.VRF_COORDINATOR_ADDRESS_SEPOLIA);

function getCoordinator(network: string) {
  let coordinator;
  if (network === "sepolia" || network === "develop") {
    coordinator = process.env.VRF_COORDINATOR_ADDRESS_SEPOLIA;
  } else if (network === "mainnet") {
    coordinator = process.env.COORDINATOR_ADDRESS_MAINNET;
  } else {
    throw new Error(
      `File: 1_project-voting.migration.js / Line: 23 / ERROR: Unsupported network: ${network}`,
    );
  }
  return coordinator;
}

const ProjectVotingModule = buildModule("ProjectVotingModule", (m) => {
  const coordinator = m.getParameter("coordinator", getCoordinator("develop"));
  const subscriptionId = m.getParameter(
    "subscriptionId",
    process.env.VRF_SUBSCRIPTION_ID,
  );
  const keyHash = m.getParameter("keyHash", process.env.VRF_KEY_HASH);

  const projectVotingContract = m.contract("ProjectVoting", [
    coordinator,
    subscriptionId,
    keyHash,
  ]);

  return { projectVotingContract };
});

export default ProjectVotingModule;
