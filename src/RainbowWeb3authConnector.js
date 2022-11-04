import { Web3AuthConnector } from "@web3auth/web3auth-wagmi-connector";

export const rainbowWeb3AuthConnector = ({ chains }) => ({
  id: "web3auth",
  name: "Web3Auth",
  iconUrl: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
  iconBackground: "#fff",
  createConnector: () => {
    const connector = new Web3AuthConnector({
      chains: chains,
      options: {
        enableLogging: true,
        clientId: "BL3ccIni_Rgg3sfTyqF4R3dEpxTPMJZI4gDSEqa4XyTtgse2YSIk9yFn4DxtTkAK2Q5-a0af83p_ZWtI53VdSeg", // Get your own client id from https://dashboard.web3auth.io
        network: "testnet",
        chainId: "0x1",
        socialLoginConfig: {
          mfaLevel: "default",
        }
      },
    });
    return {
      connector,
    };
  },
});