import React from "react";
import LIFI from '@lifi/sdk';
import { ethers } from 'ethers';

const config = { 
  ConfigUpdate: {
    apiUrl: 'https://staging.li.quest/v1/'
}
};

const lifi = new LIFI(config)
 
export default async function SwapWidgetTest() {

  //setup wallet
  if (!process.env.NODE_ENV_MNEMONIC) {
    console.warn('Please specify a MNEMONIC phrase in your environment variables: export MNEMONIC="..."');
    return;
  }

  console.log(">> Setup Wallet");
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NODE_ENV_INFURA_URL_TEST,  //Your Infura NETWORK ENDPOINTS
    5
  );
  const wallet = ethers.Wallet.fromMnemonic(process.env.NODE_ENV_MNEMONIC).connect(provider);

console.log(">> Request route");
const routesRequest = {
  fromChain: 5, //from Goerli
  fromToken: '0x88271d333C72e51516B67f5567c728E702b3eeE8',  //from fdai
  fromAmount: '1000000000000000000', //1 fDai
  toChain: 5, //to Goerli
  toToken: '0xF2d68898557cCb2Cf4C10c3Ef2B034b2a69DAD00', //to fdaix
};

const routeResponse = await lifi.getRoutes(routesRequest);

const route = routeResponse.routes[0];
console.log(">>Got route");
console.log(route);

//Execute Route
  const Swap = await lifi.executeRoute(wallet, route);
  console.log(Swap);

}


