import { json } from "@helia/json";
import { createHelia } from "helia";
import { CID } from "multiformats/cid";

const helia = await createHelia();
const j = json(helia);

export async function uploadJson(jsonObj) {
  try {
    // Convert the JSON object to a string and store in local memory
    const jsonString = JSON.stringify(jsonObj);
    const cid = await j.add(jsonString);
    const cidString = cid.toString();
    const cidObject = CID.parse(cidString);
    const value = await j.get(cidObject);
    console.log(value);

    // TODO: store in blockstorage

    return cid.toString();

    // Optional: Save the CID to a file for later retrieval
  } catch (error) {
    console.error("Error uploading JSON: ", error);
  }
}

export async function getRecords(cids) {
  try {
    let actions = [];
    console.log("Getting records...", cids);
    const formatedCID = CID.parse(cids[2]);
    console.log("Hello", formatedCID);
    const value = await j.get(formatedCID);

    console.log(value);
    return actions;
  } catch (error) {}
}
