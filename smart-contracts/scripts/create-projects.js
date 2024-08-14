const ProjectVoting = artifacts.require("ProjectVoting");
require("dotenv").config();
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

const getHash = (path) =>
  new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const rs = fs.createReadStream(path);
    rs.on("error", reject);
    rs.on("data", (chunk) => hash.update(chunk));
    rs.on("end", () => resolve(hash.digest("hex")));
  });

module.exports = async function (callback) {
  try {
    const myContractInstance = await ProjectVoting.deployed();

    await myContractInstance.add(
      "Resson's Marketing Website",
      await getHash(
        path.join(
          __dirname + "../../../content/projects/ressons-marketing-website.md",
        ),
      ),
    );

    await myContractInstance.add(
      "NovaJohnstone&Co",
      await getHash(
        path.join(__dirname + "../../../content/projects/novajonstone-co.md"),
      ),
    );

    await myContractInstance.add(
      "MyBoards",
      await getHash(
        path.join(__dirname + "../../../content/projects/myboards.md"),
      ),
    );

    await myContractInstance.add(
      "Evernote Clone",
      await getHash(
        path.join(__dirname + "../../../content/projects/evernote-clone.md"),
      ),
    );

    await myContractInstance.add(
      "Brewers Insight - Packaging BOM",
      await getHash(
        path.join(
          __dirname +
            "../../../content/projects/brewers-insight-packaging-bom.md",
        ),
      ),
    );

    await myContractInstance.add(
      "BrewersInsight - Planning and Forecasting",
      await getHash(
        path.join(
          __dirname +
            "../../../content/projects/brewers-insight-planning-and-forecasting.md",
        ),
      ),
    );

    console.log("Completed creating projects ");
  } catch (error) {
    console.error("Error in script execution", error);
  }

  callback();
};
