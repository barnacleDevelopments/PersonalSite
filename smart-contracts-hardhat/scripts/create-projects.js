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

async function createProjects() {
  try {
    const signers = await ethers.getSigners();
    console.log("DEBUG: ", signers);
    const contractFactory = await ethers.getContractFactory("ProjectVoting");
    const contractInstance = contractFactory.attach(
      "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82"
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
      console.log("HASH: ", hash);
      const tx = await contractInstance.add(name, hash);
      const receipt = await tx.wait(); // Ensure transaction is mined
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    }

    console.log("Completed creating projects");

    // const filter = contractInstance.filters.ProjectAdded();
    // const events = await contractInstance.queryFilter(filter, 0, "latest");

    // events.forEach((event) => {
    //   console.log(
    //     `ProjectAdded event! Project ID: ${event.args.projectId}, Project Name: ${event.args.projectName}`
    //   );
    // });

    // contractInstance.on("ProjectAdded", (projectId, projectName, event) => {
    //   console.log(
    //     `Real-time event detected! Project ID: ${projectId}, Project Name: ${projectName}`
    //   );
    // });
    console.log(contractInstance);
    const tx2 = await contractInstance.getProjects();
    console.log("DEBUG: ", tx2);

    console.log("PROJECTS: ", reseipt2);
  } catch (error) {
    console.error("Error in script execution", error);
  }
}

createProjects()
  .then(() => process.exit(0))
  .catch((error) => console.log(error));
