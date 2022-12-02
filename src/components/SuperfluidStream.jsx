import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Balance from "../utils/Balance";
import { SwapWidget } from "../bridges/Swapbridge";
import { WidgetSwap } from "../bridges/Bridgeswap";
import { Button, Form, CardGroup} from "./../utils/Scripts";
import { FormGroup, FormControl, Spinner, Card, Container, Row, Col, Stack } from "react-bootstrap";
import createNewFlow from './../superfluidFunctions/createStream';
import updateExistingFlow from './../superfluidFunctions/updateStream';
import deleteFlow from './../superfluidFunctions/deleteStream';
import Navbar from './navbar/Navbar';
import "./../SuperfluidStream.css";
import { abi } from '../utils/SuperApp';

const SuperfluidStream = () => {
    const [recipient, setRecipient] = useState("");
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [flowRate, setFlowRate] = useState("");
    const [flowRateDisplay, setFlowRateDisplay] = useState("");
    const [currentAccount, setCurrentAccount] = useState("");

    const connectWallet = async () => {
        const { ethereum } = window;
        if (!ethereum) {
            console.log("Ensure you have a MetaMask");
        }

        try {
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log("Error connecting to wallet: ", error);
        }
    };

    const checkIfWalletIsConnected = async () => {
        const { ethereum } = window;
        if (!ethereum) {
            console.log("Ensure you have a MetaMask");
        }
        const accounts = await ethereum.request({
            method: "eth_requestAccounts",
        });
        const chain = await ethereum.request({ method: "eth_chainId" });
        console.log("chain ID:", chain);

        console.log(accounts[0]);
        console.log('0x888D08001F91D0eEc2f16364779697462A9A713D');

        if (accounts.length > 0) {
            console.log("Found an authorized account: ", accounts[0]);
            setCurrentAccount(accounts[0]);
        } else {
            console.log("No authorized account found");
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    });

    function calculateFlowRate(amount) {
        if (
            typeof Number(amount) !== "number" ||
            isNaN(Number(amount)) === true
        ) {
            alert("You can only calculate a flowRate based on a number");
            return;
        } else if (typeof Number(amount) === "number") {
            if (Number(amount) === 0) {
                return 0;
            }
            const amountInWei = ethers.BigNumber.from(amount);
            const monthlyAmount = ethers.utils.formatEther(
                amountInWei.toString()
            );
            const calculatedFlowRate = monthlyAmount * 3600 * 24 * 30;
            return calculatedFlowRate;
        }
    }

    function CreateButton({ isLoading, children, ...props }) {
        return (
            <Button variant="success" className="button" {...props}>
                {isButtonLoading ? <Spinner animation="border" /> : children}
            </Button>
        );
    }

    function UpdateButton({ isLoading, children, ...props }) {
        return (
            <Button variant="success" className="button" {...props}>
                {isButtonLoading ? <Spinner animation="border" /> : children}
            </Button>
        );
    }

    function DeleteButton({ isLoading, children, ...props }) {
        return (
            <Button variant="success" className="button" {...props}>
                {isButtonLoading ? <Spinner animation="border" /> : children}
            </Button>
        );
    }

    const handleRecipientChange = (event) => {
        setRecipient(() => ([event.target.name] = event.target.value));
    };

    const handleFlowRateChange = (event) => {
        setFlowRate(() => ([event.target.name] = event.target.value));
        let newFlowRateDisplay = calculateFlowRate(event.target.value);
        setFlowRateDisplay(newFlowRateDisplay.toString());
    };

    return (
      <div>
        <div className='per__navi'>
        <Navbar />
       </div>
       <div className="sfb__heather">
         <h1>Create a Flow</h1>
       </div>
       <div>
       <CardGroup>
         <Card>
           <Card.Body>
             <Card.Title>Bridge Coins</Card.Title>
             <SwapWidget />
           </Card.Body>
         </Card>
         <Card>
           <Card.Body>
             <Card.Title>Send Stream</Card.Title>
             <Form>
              <FormGroup className="mb-4">
              <Form.Label>Stream to Address</Form.Label> 
                <FormControl
                    name="recipient"
                    value={recipient}
                    onChange={handleRecipientChange}
                    placeholder="Enter recipient address"
                ></FormControl>
              </FormGroup>
              <FormGroup className="mb-4">
              <Form.Label>Amount to Stream</Form.Label>
                <FormControl
                    name="flowRate"
                    value={flowRate}
                    onChange={handleFlowRateChange}
                    placeholder="Enter a flowRate in wei/second"
                ></FormControl>
                </FormGroup>
            </Form>
            <Stack gap={3}>
            <div className="description">
              <div className="calculation">
                <p>Your flow will be equal to:</p>
                <p>
                <b>{flowRateDisplay !== " " ? flowRateDisplay : 0}</b>{" "}
                DAIx/month
                </p>
              </div>
            </div>
            <Container>
             <Row>
               <Col></Col>
               <Col xs={5}>
                 <CreateButton
                   onClick={() => {
                     setIsButtonLoading(true);
                     createNewFlow(recipient, flowRate);
                     setTimeout(() => {
                       setIsButtonLoading(false);
                       }, 1000);
                     }}
                     >
                     Click to Create Your Stream
                 </CreateButton>
                </Col>
                <Col></Col>
             </Row>
            </Container>
            </Stack>
           </Card.Body>
         </Card>
         <Card>
           <Card.Body>
             <Card.Title>Withdraw Coins</Card.Title>
             <WidgetSwap />
           </Card.Body>
         </Card>
       </CardGroup>    
      </div>
      <div className="sfb__heather">
        <h1>Change a Flow</h1>
      </div>
      <div>
       <CardGroup>
         <Card>
           <Card.Body>
             <Card.Title>Update a Stream</Card.Title>
             <Form>
                <FormGroup className="mb-3"> 
                    <FormControl
                        name="recipient"
                        value={recipient}
                        onChange={handleRecipientChange}
                        placeholder="Enter your Ethereum address"
                    ></FormControl>
                </FormGroup>
                <FormGroup className="mb-3">
                    <FormControl
                        name="flowRate"
                        value={flowRate}
                        onChange={handleFlowRateChange}
                        placeholder="Enter a flowRate in wei/second"
                    ></FormControl>
                </FormGroup>
                <Container>
                <Row>
                  <Col></Col>
                  <Col xs={5}>
                    <UpdateButton
                    onClick={() => {
                        setIsButtonLoading(true);
                        updateExistingFlow(recipient, flowRate);
                        setTimeout(() => {
                            setIsButtonLoading(false);
                        }, 1000);
                    }}
                >
                       Click to Update Your Stream
                    </UpdateButton>
                  </Col>
                  <Col></Col>
                </Row>
                </Container>
              </Form>
           </Card.Body>
         </Card>
         <Card>
           <Card.Body>
             <Card.Title>Delete a Stream</Card.Title>
             <Form>
                <FormGroup className="mb-3">
                    <FormControl
                        name="recipient"
                        value={recipient}
                        onChange={handleRecipientChange}
                        placeholder="Enter your Ethereum address"
                    ></FormControl>
                </FormGroup>
              </Form>  
            <Container>
             <Row>
               <Col></Col>
               <Col xs={5}>
               <DeleteButton
                    onClick={() => {
                        setIsButtonLoading(true);
                        deleteFlow(recipient);
                        setTimeout(() => {
                            setIsButtonLoading(false);
                        }, 1000);
                    }}
                >
                    Click to Delete Your Stream
                </DeleteButton>
                </Col>
                <Col></Col>
             </Row>
            </Container>
           </Card.Body>
         </Card>
       </CardGroup>    
      </div>
    </div>
    );
};

export default SuperfluidStream;