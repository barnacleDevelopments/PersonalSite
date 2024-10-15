import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import "dotenv/config";
require("dotenv").config();

// TODO: need to change each of these to new project files on Arweave
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

// TODO: need to setup local VRF deployment/setup
function getCoordinator(network: string) {
  let coordinator;
  if (network === "sepolia" || network === "develop") {
    coordinator = process.env.VRF_COORDINATOR_ADDRESS_SEPOLIA;
  } else if (network === "mainnet") {
    coordinator = process.env.COORDINATOR_ADDRESS_MAINNET;
  } else {
    throw new Error(
      `File: 1_project-voting.migration.js / Line: 23 / ERROR: Unsupported network: ${network}`
    );
  }
  return coordinator;
}

const ProjectVotingModule = buildModule("ProjectVotingModule", (m) => {
  const coordinator = m.getParameter("coordinator", getCoordinator("develop"));
  const subscriptionId = m.getParameter(
    "subscriptionId",
    process.env.VRF_SUBSCRIPTION_ID
  );
  const keyHash = m.getParameter("keyHash", process.env.VRF_KEY_HASH);

  const projectVotingContract = m.contract("ProjectVoting", [
    coordinator,
    subscriptionId,
    keyHash,
  ]);

  // create projects
  let index = 0;
  for (const [name, hash] of projects) {
    m.call(projectVotingContract, "addProject", [name, hash], {
      id: "addProject" + index,
    });
    index++;
  }

  // set initial prize pool balance?

  return { projectVotingContract };
});

export default ProjectVotingModule;
