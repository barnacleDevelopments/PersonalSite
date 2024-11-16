import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
require("dotenv").config({ path: __dirname + "/../.env" });

describe("Project Voting Contract", () => {
  async function deployFeedbackFixture() {
    const [owner, secondary] = await hre.ethers.getSigners();
    const Feedback = await hre.ethers.getContractFactory("Feedback");
    const feedback = await Feedback.deploy(
      process.env.VRF_COORDINATOR_ADDRESS_SEPOLIA,
      process.env.VRF_SUBSCRIPTION_ID,
      process.env.VRF_KEY_HASH
    );
    return { feedback, owner, secondary };
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
    });
  });

  describe("Manage Feedback Bundles", () => {
    let feedback, owner, signer, secondary;

    const itemId = "example_item_id"; // Define a constant itemId for consistency
    const feedbackId = "example_feedback_id";

    beforeEach(async () => {
      // Load fixture and impersonate the owner account before each test
      ({ feedback, owner, secondary } = await loadFixture(
        deployFeedbackFixture
      ));
      signer = await impersonateAccount(owner.address);
      secondary = await impersonateAccount(secondary.address);
    });

    afterEach(async () => {
      // Stop impersonating after each test
      await stopImpersonatingAccount(owner.address);
      await stopImpersonatingAccount(secondary.address);
    });

    const createFeedbackBundle = async (signer, itemId, value = "1.0") => {
      return await feedback.connect(signer).addFeedbackBundle(itemId, 1, {
        value: ethers.parseEther(value),
      });
    };

    describe("Create Feedback Bundles", () => {
      it("Should create feedback bundle", async () => {
        await createFeedbackBundle(signer, itemId, "1.0");
        // Retrieve the feedback bundle
        const [contractOwner, rewardBalance, settleDeadline, isSettled] =
          await feedback.connect(signer).getFeedbackBundle(itemId);

        expect(contractOwner).to.have.lengthOf(42);
        expect(rewardBalance).to.equal(ethers.parseEther("1.0"));
        expect(settleDeadline).to.equal(1);
        expect(isSettled).to.be.false;
      });

      it("Should refund feedback bundle", async () => {
        await createFeedbackBundle(signer, itemId, "1.0");

        // refund feedback bundle
        const transaction = await feedback
          .connect(signer)
          .refundFeedbackBundle(itemId);

        const receipt = await transaction.wait();
        expect(receipt.status).to.equal(1);
      });
    });

    describe("Settle Bundle", () => {
      it("Should check bundle feedback", async () => {
        await createFeedbackBundle(signer, itemId, "1.0");

        // add feedback to bundle
        const addFeedbackTx = await feedback
          .connect(signer)
          .provideFeedback(itemId, feedbackId);

        const addFeedbackReciept = await addFeedbackTx.wait();
        expect(addFeedbackReciept.status).to.equal(1);

        // should check bundle for feedback
        const hasFeedback = await feedback
          .connect(signer)
          .checkBundleHasFeedback(itemId);

        expect(hasFeedback).be.true;
      });

      it("Should Choose Settle", async () => {
        await createFeedbackBundle(signer, itemId, "1.0");

        // add feedback to bundle
        const addFeedbackTx = await feedback
          .connect(signer)
          .provideFeedback(itemId, feedbackId);

        const addFeedbackReciept = await addFeedbackTx.wait();
        expect(addFeedbackReciept.status).to.equal(1);

        // settle feedback bundle
        const transaction = await feedback
          .connect(signer)
          .settleBundle(secondary, itemId);

        const receipt = await transaction.wait();
        expect(receipt.status).to.equal(1);
      });
    });
    describe("Provide Feedback on Bundle", () => {});
  });
});
