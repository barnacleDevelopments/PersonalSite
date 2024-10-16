import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { expectRevert } from "@openzeppelin/test-helpers";
require("dotenv").config({ path: __dirname + "/../.env" });

describe("Project Voting Contract", () => {
  async function deployFeedbackFixture() {
    const [owner] = await hre.ethers.getSigners();
    const Feedback = await hre.ethers.getContractFactory("Feedback");
    const feedback = await Feedback.deploy(
      process.env.VRF_COORDINATOR_ADDRESS_SEPOLIA,
      process.env.VRF_SUBSCRIPTION_ID,
      process.env.VRF_KEY_HASH
    );
    return { feedback, owner };
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
      const { feedback } = await loadFixture(deployFeedbackFixture);
      const result = await feedback.subscriptionSet();
      expect(result).to.equal(true);
      console.log("SUBSCRIPTION ADDRESS: ", result);
    });

    it("Should set coordinator", async () => {
      const { feedback } = await loadFixture(deployFeedbackFixture);
      const result = await feedback.vrfCoordinatorSet(); // Assuming this is the function you meant
      expect(typeof result).to.equal("string");
      console.log("COORDINATOR: ", result);
    });

    it("Should set key hash", async () => {
      const { feedback } = await loadFixture(deployFeedbackFixture);
      const result = await feedback.keyHashSet(); // Assuming this is the function you meant
      expect(typeof result).to.equal("string");
      console.log("HASH: ", result);
    });
  });

  describe("Item Vote", () => {
    let feedback: any, owner: any, signer: any;

    beforeEach(async () => {
      // Load fixture and impersonate the owner account before each test
      ({ feedback, owner } = await loadFixture(deployFeedbackFixture));
      signer = await impersonateAccount(owner.address);
    });

    afterEach(async () => {
      // Stop impersonating after each test
      await stopImpersonatingAccount(owner.address);
    });

    // TODO: fix this
    it("Should allow voting on a item", async () => {
      const [owner] = await hre.ethers.getSigners();
      const itemId = "example_id_1";
      const voterDisplayName = "Example Name 1";
      const receiverAddress = owner.address;
      const transaction = await feedback
        .connect(signer)
        .vote(itemId, voterDisplayName, receiverAddress);
      const receipt = await transaction.wait();

      expect(receipt.status).to.equal(1);
    });

    // TODO: finish this
    it("Vote transaction should have a minimum contribution", async () => {});
    it("Vote transaction should have a maximum contribution", async () => {});
  });
});
