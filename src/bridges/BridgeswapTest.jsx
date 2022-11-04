import React from "react";
import LIFI from '@lifi/sdk';
import { ethers } from 'ethers';
 
export default async function WidgetSwapTest() {

  const config = { 
    ConfigUpdate: {
      apiUrl: 'https://staging.li.quest/v1/'
  }
  };
  
  const lifi = new LIFI(config);

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
  const signer = new ethers.Wallet(process.env.NODE_ENV_PRIVATE_KEY, provider);
  const wallet = ethers.Wallet.fromMnemonic(process.env.NODE_ENV_MNEMONIC).connect(provider);

console.log(">> Request route");
const routesRequest = {
  fromChain: 5, //from Goerli
  fromToken: '0x88271d333C72e51516B67f5567c728E702b3eeE8',  //from fdai
  fromAmount: '1000000000000000000', //1 fDai
  toChain: 5, //to Goerli
  toToken: '0xb5B640E6414b6DeF4FC9B3C1EeF373925effeCcF', //to USDC
};

const routeResponse = await lifi.getRoutes(routesRequest);

const route = routeResponse.routes[0];
console.log(">>Got route");
console.log(route);

//Execute Route
  const Exchange = await lifi.executeRoute(wallet, route);
  console.log("Done");

  Exchange();

}


