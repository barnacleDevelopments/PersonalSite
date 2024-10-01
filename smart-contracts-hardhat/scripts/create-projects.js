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
      [
        "Resson's Marketing Website",
        "xw8cyKXN1eck6aPVlRmajo984tvqGrKZTesseXa3p3I",
      ],
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

    for (const [name, hash] of projects) {
      const tx = await contractInstance.addProject(name, hash);
      const receipt = await tx.wait();
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
    }

    const result = await contractInstance.getProjectIds();
    console.log("Projects Created!", result);
  } catch (error) {
    console.error("Error in script execution", error);
  }
}

createProjects()
  .then(() => process.exit(0))
  .catch((error) => console.log(error));
