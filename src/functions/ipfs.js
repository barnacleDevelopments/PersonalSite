import { json } from "@helia/json";
import { createHelia } from "helia";
import {CID} from "multiformats/cid"

const helia = await createHelia();
const j = json(helia);

export async function uploadJson(jsonObj) {
    try {
        // Convert the JSON object to a string
        const jsonStr = JSON.stringify(jsonObj);
        const cid = await j.add(jsonStr);
        console.log(cid.bytes)
        return cid.toString()

        // Optional: Save the CID to a file for later retrieval
    } catch (error) {
        console.error("Error uploading JSON: ", error);
    }
}


export async function getRecords(cids) {
    try {
        let actions = [];
        
        for(const cid of cids) {
            const formatedCID = CID.parse(cid);
            actions.push(await j.get(formatedCID));
            console.log(actions)
        }
        
        return actions;

    } catch(error) {

    }
}