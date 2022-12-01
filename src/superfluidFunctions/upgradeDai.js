import React, { useState } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { Button, Form, FormGroup, FormControl, Spinner, Container, Row, Col } from "react-bootstrap";
import { abi } from '../utils/SuperApp';

//will be used to approve super token contract to spend DAI
async function daiApprove(amt) {
    const contractABI = abi;
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.NODE_ENV_INFURA_URL,  //Your Infura NETWORK ENDPOINTS
        137
      );
    const sf = await Framework.create({
    chainId: 137,
    provider
  });

  const signer = sf.createSigner({
    privateKey: process.env.NODE_ENV_PRIVATE_KEY,
    provider
  });

  const gasPrice = ethers.utils.parseUnits('100', 'gwei');
  const gasLimit = 250000;

  //fDAI on goerli: you can find network addresses here: https://docs.superfluid.finance/superfluid/developers/networks
  //note that this abi is the one found here: https://goerli.etherscan.io/address/0x88271d333C72e51516B67f5567c728E702b3eeE8
  const DAI = new ethers.Contract(
    "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    contractABI,
    signer
  );
  try {
    console.log("approving DAI spend");
    await DAI.approve(
      "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
      ethers.utils.parseEther(amt.toString()),
      { gasLimit: gasLimit }
    ).then(function (tx) {
      console.log(
        `Congrats, you just approved your NEAR spend. You can see this tx at https://polygonscan.com/txs/${tx.hash}`
      );
    });
  } catch (error) {
    console.error(error);
  }
}

//where the Superfluid logic takes place
async function daiUpgrade(amt) {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NODE_ENV_INFURA_URL,  //Your Infura NETWORK ENDPOINTS
    137
    );
  const sf = await Framework.create({
    chainId: 137,
    provider
  });

  const signer = sf.createSigner({
    privateKey: process.env.NODE_ENV_PRIVATE_KEY,
    provider
  });

  const DAIx = await sf.loadSuperToken("0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2");

  try {
    console.log(`upgrading ${amt} DAI to DAIx`);
    const amtToUpgrade = ethers.utils.parseEther(amt.toString());
    const upgradeOperation = DAIx.upgrade({
      amount: amtToUpgrade.toString(),
      gasLimit: 250000
    });
    const upgradeTxn = await upgradeOperation.exec(signer);
    await upgradeTxn.wait().then(function (tx) {
      console.log(
        `
        Congrats - you've just upgraded DAI to DAIx!
      `
      );
    });
  } catch (error) {
    console.error(error);
  }
}

export default function UpgradeDai () {
  const [amount, setAmount] = useState("");
  const [isUpgradeButtonLoading, setIsUpgradeButtonLoading] = useState(false);
  const [isApproveButtonLoading, setIsApproveButtonLoading] = useState(false);

  function UpgradeButton({ isLoading, children, ...props }) {
    return (
      <Button variant="success" className="button" {...props}>
        {isUpgradeButtonLoading ? <Spinner animation="border" /> : children}
      </Button>
    );
  }

  function ApproveButton({ isLoading, children, ...props }) {
    return (
      <Button variant="success" className="button" {...props}>
        {isApproveButtonLoading ? <Spinner animation="border" /> : children}
      </Button>
    );
  }

  const handleAmountChange = (e) => {
    setAmount(() => ([e.target.name] = e.target.value));
  };

  return (
    <div>
      <h2 className="text-center">Upgrade DAI to DAIx</h2>
      <Form>
        <FormGroup className="mb-3">
          <FormControl
            name="amount"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter the dollar amount you'd like to upgrade"
          ></FormControl>
        </FormGroup>
        <Container>
          <Row>
            <Col></Col>
            <Col xs={5}>   
              <ApproveButton
                onClick={() => {
                  setIsApproveButtonLoading(true);
                  daiApprove(amount);
                  setTimeout(() => {
                    setIsApproveButtonLoading(false);
                  }, 1000);
                }}
              >
                Click to Approve Token Upgrade
              </ApproveButton>
          </Col>
          <Col></Col>
          </Row>
        </Container>
        <div className="mt-5">
        <Container>
          <Row>
            <Col></Col>
            <Col xs={5}>
              <UpgradeButton 
                onClick={() => {
                  setIsUpgradeButtonLoading(true);
                  daiUpgrade(amount);
                  setTimeout(() => {
                    setIsUpgradeButtonLoading(false);
                  }, 1000);
                }}
              >
                Click to Upgrade Your Tokens
              </UpgradeButton>
            </Col>
            <Col></Col>
          </Row>
        </Container>
        </div>
      </Form>
    </div>
  );
};