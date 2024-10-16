import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { expectRevert } from "@openzeppelin/test-helpers";
require("dotenv").config({ path: __dirname + "/../.env" });

describe("Project Voting Contract", () => {
  async function deployProjectVotingFixture() {
    const [owner] = await hre.ethers.getSigners();
    const ProjectVoting = await hre.ethers.getContractFactory("ProjectVoting");
    const projectVoting = await ProjectVoting.deploy(
      process.env.VRF_COORDINATOR_ADDRESS_SEPOLIA,
      process.env.VRF_SUBSCRIPTION_ID,
      process.env.VRF_KEY_HASH
    );
    return { projectVoting, owner };
  }

  async function impersonateAccount(address: string) {
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [address],
    });
    return ethers.getSigner(address);
  }

  async function stopImpersonatingAccount(address: string) {
    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [address],
    });
  }

  // TODO: this can be improved
  describe("Deployment", () => {
    it("Should set subscription address", async () => {
      const { projectVoting } = await loadFixture(deployProjectVotingFixture);
      const result = await projectVoting.subscriptionSet();
      expect(result).to.equal(true);
      console.log("SUBSCRIPTION ADDRESS: ", result);
    });

    it("Should set coordinator", async () => {
      const { projectVoting } = await loadFixture(deployProjectVotingFixture);
      const result = await projectVoting.vrfCoordinatorSet(); // Assuming this is the function you meant
      expect(typeof result).to.equal("string");
      console.log("COORDINATOR: ", result);
    });

    it("Should set key hash", async () => {
      const { projectVoting } = await loadFixture(deployProjectVotingFixture);
      const result = await projectVoting.keyHashSet(); // Assuming this is the function you meant
      expect(typeof result).to.equal("string");
      console.log("HASH: ", result);
    });
  });

  describe("Project Vote", () => {
    let projectVoting: any, owner: any, signer: any;

    beforeEach(async () => {
      // Load fixture and impersonate the owner account before each test
      ({ projectVoting, owner } = await loadFixture(
        deployProjectVotingFixture
      ));
      signer = await impersonateAccount(owner.address);
    });

    afterEach(async () => {
      // Stop impersonating after each test
      await stopImpersonatingAccount(owner.address);
    });

    // TODO: fix this
    it("Should allow voting on a project", async () => {
      const projectId = "";
      const voterDisplayName = "";
      const transaction = await projectVoting
        .connect(signer)
        .vote(projectId, voterDisplayName, {
          value: ethers.parseEther("0.001"),
          gasLimit: 1000000,
        });

      const receipt = await transaction.wait();
      expect(receipt.status).to.equal(1);
    });

    // TODO: finish this
    it("Vote transaction should have a minimum contribution", async () => {});
    it("Vote transaction should have a maximum contribution", async () => {});
  });
});
