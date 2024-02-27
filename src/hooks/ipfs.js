import { json } from "@helia/json";
import { createHelia } from "helia";

const useIPFS = () => {
    async function uploadJson(jsonObj) {
        try {
          // Convert the JSON object to a string
          const jsonStr = JSON.stringify(jsonObj);
          const helia = await createHelia();
          const j = json(helia);
          const cid = await j.add(jsonStr);
          console.log(cid.bytes)
          return cid.toString()
    
        // Optional: Save the CID to a file for later retrieval
    } catch (error) {
      console.error("Error uploading JSON: ", error);
    }
  }

  return {uploadJson}

}

export default useIPFS