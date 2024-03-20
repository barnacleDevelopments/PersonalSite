import { PinningClient } from '@4everland/upload-pin'
exports.handler = function (request, context) {
  const pinningClient = new PinningClient({
    baseURL: PINNING_URL,
    accessToken: process.env.FOUREVERLAND_ACCESS_TOKEN
  });

  

  
 }