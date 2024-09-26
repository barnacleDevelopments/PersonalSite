const { ethers } = require("hardhat");
require("dotenv").config();
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const getHash = (filePath) =>
  new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const rs = fs.createReadStream(filePath);
    rs.on("error", reject);
    rs.on("data", (chunk) => hash.update(chunk));
    rs.on("end", () => resolve(hash.digest("hex")));
  });

const function uploadProjectFiles() {
  // upload files to arweave network.
  // return files hashes to be stored on the project voting smart contract
}

async function createProjects() {
  try {
    const signers = await ethers.getSigners();
    const contractFactory = await ethers.getContractFactory("ProjectVoting");
    const contractInstance = contractFactory.attach(
      "0x68B1D87F95878fE05B998F19b66F4baba5De1aed"
    );

    const projects = [
      [
        "Resson's Marketing Website",
        "../../content/projects/ressons-marketing-website.md",
      ],
      ["NovaJohnstone&Co", "../../content/projects/novajonstone-co.md"],
      ["MyBoards", "../../content/projects/myboards.md"],
      ["Evernote Clone", "../../content/projects/evernote-clone.md"],
      [
        "Brewers Insight - Packaging BOM",
        "../../content/projects/brewers-insight-packaging-bom.md",
      ],
      [
        "BrewersInsight - Planning and Forecasting",
        "../../content/projects/brewers-insight-planning-and-forecasting.md",
      ],
    ];

    for (const [name, filePath] of projects) {
      const hash = await getHash(path.join(__dirname, filePath));
      const tx = await contractInstance.add(name, hash);
      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    }

    const projects = await contractInstance.getProjects();
    console.log("Projects created! ", projects);
  } catch (error) {
    console.error("Error in script execution", error);
  }
}

createProjects()
  .then(() => process.exit(0))
  .catch((error) => console.log(error));
