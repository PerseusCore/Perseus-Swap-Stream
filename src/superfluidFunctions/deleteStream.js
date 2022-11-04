import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

export default async function deleteFlow(recipient) {
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.NODE_ENV_INFURA_URL,  //Your Infura NETWORK ENDPOINTS
        137
      );

    const signer = new ethers.Wallet(process.env.NODE_ENV_PRIVATE_KEY, provider);

    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    const superfluid = await Framework.create({
        chainId: Number(chainId),
        provider: provider,
    });

    const DAIxContract = await superfluid.loadSuperToken("fDAIx");
    const DAIx = DAIxContract.address;

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

    try {
        const deleteFlowOperation = superfluid.cfaV1.deleteFlow({
            sender: accounts[0],
            receiver: recipient,
            superToken: DAIx,
        });

        console.log("Deleting your stream...");

        await deleteFlowOperation.exec(signer);

        console.log(
            `Congrats - you've just deleted your money stream!
            Network: Kovan
            Super Token: DAIx
            Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
            Receiver: ${recipient}
            `
        );
    } catch (error) {
        console.error(error);
    }
}