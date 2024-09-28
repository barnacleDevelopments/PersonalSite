const { ethers } = require("hardhat");
require("dotenv").config();
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

async function createProjects() {
  try {
    const signers = await ethers.getSigners();
    const contractFactory = await ethers.getContractFactory("ProjectVoting");
    const contractInstance = contractFactory.attach(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3"
    );

    const projects = [
      // [
      //   "Resson's Marketing Website",
      //   "../../content/projects/ressons-marketing-website.md",
      // ],
      // ["NovaJohnstone&Co", "../../content/projects/novajonstone-co.md"],
      // ["MyBoards", "../../content/projects/myboards.md"],
      // ["Evernote Clone", "../../content/projects/evernote-clone.md"],
      // [
      //   "BrewersInsight - Planning and Forecasting",
      //   "../../content/projects/brewers-insight-planning-and-forecasting.md",
      // ],
      [
        "Brewers Insight - Packaging BOM",
        "YrSKX2_fKeUVHwrLWEZng_Sq5SF3DO-3Y2StiO88GJI",
      ],
    ];

    for (const [name, hash] of projects) {
      const tx = await contractInstance.add(name, hash);
      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    }

    const result = await contractInstance.getProjects();
    console.log("PROJECTS CREATED: ", result);
  } catch (error) {
    console.error("Error in script execution", error);
  }
}

createProjects()
  .then(() => process.exit(0))
  .catch((error) => console.log(error));
