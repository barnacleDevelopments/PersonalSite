const ProjectVoting = artifacts.require("ProjectVoting");
require("dotenv").config();

module.exports = async function (callback) {
  try {
    // Get the deployed contract instance
    const myContractInstance = await ProjectVoting.deployed();

    // Example of calling a contract function
    await myContractInstance.add(
      "Resson's Marketing Website",
      "5e95c5f3-51b5-4d7b-8b4c-39f01dc12598"
    );

    await myContractInstance.add(
      "NovaJohnstone&Co",
      "98198c87-45e8-4651-8393-0f6893ck6ab5e"
    );

    await myContractInstance.add(
      "MyBoards",
      "3d9daa52-deed-43ad-8cad-cde6e608db20"
    );

    await myContractInstance.add(
      "Evernote Clone",
      "f134b43b-acac-47fa-93eb-301c8ce37dc5"
    );

    await myContractInstance.add(
      "Brewers Insight - Packaging BOM",
      "ca7d73d1-1c78-42b7-956e-ec580994c232"
    );

    const projects = await myContractInstance.getAll();
    console.log(projects);
  } catch (error) {
    console.error("Error in script execution", error);
  }

  callback();
};
