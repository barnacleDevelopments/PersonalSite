import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { expectRevert } from "@openzeppelin/test-helpers";
require("dotenv").config({ path: __dirname + "/../.env" });

const projects = [
  ["Resson's Marketing Website", "xw8cyKXN1eck6aPVlRmajo984tvqGrKZTesseXa3p3I"],
  ["NovaJohnstone&Co", "tTb85KM3Jdgdj7OwD3ecqoZf7OgXTEvint06SkyI7yo"],
  ["MyBoards", "yJjCczdIFA02NAWeR6iaaic1NQR0It9E_ljUxGOaSn8"],
  ["Evernote Clone", "kzUya5V0duWlP_3pORYAqwd8KmUYTnCEiKmEiDblPf0"],
  [
    "BrewersInsight - Planning and Forecasting",
    "Zr_LtcqYA6YcIHOkiiKAF14s9Z9MjyWk36lPgEue_-w",
  ],
  [
    "Brewers Insight - Packaging BOM",
    "YrSKX2_fKeUVHwrLWEZng_Sq5SF3DO-3Y2StiO88GJI",
  ],
];

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

    describe("Should create a project", async () => {
      it("Should create projects", async () => {
        for (let [name, id] of projects) {
          const transaction = await projectVoting.addProject(name, id);
          await transaction.wait();
          const result = await projectVoting.getProjectName(id);
          expect(result).to.equal(name);
        }
      });

      it("Should prevent creating projects with duplicate IDs", async () => {
        const [name, id] = projects[0];
        const transaction = await projectVoting.addProject(name, id);
        await transaction.wait();
        await expectRevert(
          projectVoting.addProject(name, id),
          "Project already exists"
        );
      });

      it("Should prevent creating projects with duplicate names", async () => {
        const [name, id] = projects[0];
        const transaction = await projectVoting.addProject(name, id);
        await transaction.wait();
        const [_, id2] = projects[1];
        await expectRevert(
          projectVoting.addProject(name, id2),
          "Project with that name already exists"
        );
      });
    });

    // TODO: fix this
    it("Should allow voting on a project", async () => {
      const [name, id] = projects[0];
      await projectVoting.addProject(name, id);
      const transaction = await projectVoting.connect(signer).vote(id, "joe", {
        value: ethers.parseEther("0.001"),
        gasLimit: 1000000,
      });

      const receipt = await transaction.wait();
      expect(receipt.status).to.equal(1);
    });

    // TODO: finish this
    it("Should not allow voting on retired project", async () => {
      // add project
      const [name, id] = projects[0];
      await projectVoting.addProject(name, id);
      // retire project

      // vote on retired project
      const transaction = await projectVoting.connect(signer).vote(id, "joe", {
        value: ethers.parseEther("0.001"),
        gasLimit: 1000000,
      });

      const receipt = await transaction.wait();
      expect(receipt.status).to.equal(1);
    });
    it("Vote transaction should have a minimum contribution", async () => {});
    it("Vote transaction should have a maximum contribution", async () => {});
  });
});
