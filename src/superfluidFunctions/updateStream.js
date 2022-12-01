import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

export default async function updateExistingFlow(recipient, flowRate) {
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.NODE_ENV_INFURA_URL,  //Your Infura NETWORK ENDPOINTS
        137
      );

    const signer = new ethers.Wallet(process.env.NODE_ENV_PRIVATE_KEY, provider);

    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    const superfluid = await Framework.create({
        chainId: 137,
        provider: provider,
    });

    const DAIxContract = await superfluid.loadSuperToken("fDAIx");
    const DAIx = DAIxContract.address;

    try {
        const updateFlowOperation = superfluid.cfaV1.updateFlow({
            receiver: recipient,
            flowRate: flowRate,
            superToken: DAIx,
        });

        console.log("Updating your stream...");

        const result = await updateFlowOperation.exec(signer);
        console.log(result);

        console.log(
            `Congrats - you've just updated a money stream!
            View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
            Network: Kovan
            Super Token: DAIx
            Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
            Receiver: ${recipient},
            New FlowRate: ${flowRate}
            `
        );
    } catch (error) {
        console.log(
            "Hmmm, your transaction threw an error. Make sure that this stream already exists, and that you've entered a valid Ethereum address!"
        );
        console.error(error);
    }
} 