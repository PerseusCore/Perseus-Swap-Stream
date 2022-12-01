import React, { useState } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { Button, Form, FormGroup, FormControl, Spinner, Container, Row, Col } from "react-bootstrap";

//where the Superfluid logic takes place
async function daiDowngrade(amt) {
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

  const DAIx = await sf.loadSuperToken(
    "0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2"
  );

  console.log(DAIx.address);

  try {
    console.log(`Downgrading ${amt} Daix...`);
    const amtToDowngrade = ethers.utils.parseEther(amt.toString());
    const downgradeOperation = Daix.downgrade({
      amount: amtToDowngrade.toString()
    });
    const downgradeTxn = await downgradeOperation.exec(signer);
    await downgradeTxn.wait().then(function (tx) {
      console.log(
        `
        Congrats - you've just downgraded DAIx to DAI!
        You can see this tx at https://polygonscan.com/txs/${tx.transactionHash}
        Network: Goerli
        NOTE: you downgraded the dai of 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721.
        You can use this code to allow your users to do it in your project.
        Or you can downgrade tokens at app.superfluid.finance/dashboard.
      `
      );
    });
  } catch (error) {
    console.error(error);
  }
}

export default function DowngradeDai () {
  const [amount, setAmount] = useState("");
  const [isDowngradeButtonLoading, setIsDowngradeButtonLoading] = useState(
    false
  );

  function DowngradeButton({ isLoading, children, ...props }) {
    return (
      <Button variant="success" className="button" {...props}>
        {isDowngradeButtonLoading ? <Spinner animation="border" /> : children}
      </Button>
    );
  }

  const handleAmountChange = (e) => {
    setAmount(() => ([e.target.name] = e.target.value));
  };

  return (
    <div>
      <h2 className="text-center">Downgrade Daix to Dai</h2>
      <Form>
        <FormGroup className="mb-3">
          <FormControl
            name="amount"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter the whole dollar amount you'd like to downgrade"
          ></FormControl>
        </FormGroup>
        <Container>
          <Row>
            <Col></Col>
            <Col xs={5}>
              <DowngradeButton
                onClick={() => {
                  setIsDowngradeButtonLoading(true);
                  daiDowngrade(amount);
                  setTimeout(() => {
                    setIsDowngradeButtonLoading(false);
                  }, 1000);
                }}
              >
                Click to Downgrade Your Tokens
              </DowngradeButton>
            </Col>
            <Col></Col>
          </Row>
        </Container>
      </Form>
    </div>
  );
};