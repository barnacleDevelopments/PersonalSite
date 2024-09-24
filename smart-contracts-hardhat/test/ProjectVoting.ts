import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
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
    let projectVoting, owner, signer;

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

    it("Should create a project", async () => {
      const transaction = await projectVoting.add("New Project", "id");
      const receipt = await transaction.wait();
      const projects = await projectVoting.getProjects();
      expect(projects[0]).to.equal("New Project");
    });

    it("Should allow voting on a project", async () => {
      await projectVoting.add("New Project", "id");

      const transaction = await projectVoting
        .connect(signer)
        .vote("id", "Devin", {
          value: ethers.parseEther("0.001"),
          gasLimit: 1000000,
        });

      const receipt = await transaction.wait();
      expect(receipt.status).to.equal(1);
    });
  });
});
