var ProjectVoting = artifacts.require("ProjectVoting");

module.exports = function (deployer, network) {
  const coordinator = getCoordinator(network);
  const subscriptionId = process.env.VRF_SUBSCRIPTION_ID;
  const keyHash = process.env.VRF_KEY_HASH;
  console.log(process.env.VRF_KEY_HASH);
  console.log(process.env.VRF_SUBSCRIPTION_ID);
  console.log(process.env.VRF_COORDINATOR_ADDRESS_SEPOLIA);
  deployer
    .then(() => {
      return deployer.deploy(
        ProjectVoting,
        coordinator,
        subscriptionId,
        keyHash
      );
    })
    .catch((e) => {
      console.error(e);
    });
};

function getCoordinator(network) {
  let coordinator;
  if (network === "sepolia" || network === "develop") {
    coordinator = process.env.VRF_COORDINATOR_ADDRESS_SEPOLIA;
  } else if (network === "mainnet") {
    coordinator = process.env.COORDINATOR_ADDRESS_MAINNET;
  } else {
    throw new Error(
      `File: 1_project-voting.migration.js / Line: 23 / ERROR: Unsupported network: ${network}`
    );
  }
  return coordinator;
}
