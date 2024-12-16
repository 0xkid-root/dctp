import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Button, Modal, ProgressBar, Spinner } from "react-bootstrap";
import { useAccount, useSwitchChain, useWalletClient } from "wagmi";
import { createSocialAccount } from '../web3/CreateSocialAccount';
import "./SmartAccountModal.css";
import {handleError} from "../utils/ErrorHandle"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SmartAccountModal = ({ show, onClose, title, client }) => {
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const [isMessageSigned, setIsMessageSigned] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [txHashLoading, setTxHashLoading] = useState(false); // Loading state for txHash

  const { isConnected, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { data: walletClient } = useWalletClient();
  const [errorMessage,setErrorMessage]= useState("");
  const [successMessage,setSuccessMessage]= useState("");
  

  async function handleAccountCreation() {
    setLoading(true);  

    try {

      if(isConnected && walletClient) { // Ensure client is ready

        const targetChainId = parseInt(process.env.REACT_APP_CHAIN_ID);

        if(chainId !== targetChainId) {
          try {
            await switchChainAsync({chainId: targetChainId});
          } catch(error) {
            console.log(`Error during chain switching`, error);
            throw error;
          }
        }

        console.log("walletClient:",walletClient);
        console.log("client:",client);
  
        setTxHashLoading(true);
        const txReceipt = await createSocialAccount(walletClient, client);
        console.log("Transaction Hash:", txReceipt?.transactionHash);
  
        setTxHash(txReceipt?.transactionHash);
        if(txReceipt.status === 'success'){
          toast.success('Successfully Created Social Account!');
        }
        setIsAccountCreated(true);
        setIsMessageSigned(true);
        setCurrentStep(4);
      }
    } catch (error) {
      console.error("Error during Social Account Creation:", error);
      handleError(error)
    } finally {
      setLoading(false);
    }
  }
  
  const renderStepContent = () => (
    <div className="steps-container">
      <div className="step">
        <h5>Step 1: Smart Account</h5>
        <div className="step-status">
          {isAccountCreated ? (
            <span className="green-tick">✔</span>
          ) : (
            <span className="pending">•</span>
          )}
          {isAccountCreated
            ? "Account Created"
            : "Initializing Smart Account..."}
        </div>
      </div>

      <div className="step">
        <h5>Step 2: Sign Message</h5>
        <div className="step-status">
          {isMessageSigned ? (
            <span className="green-tick">✔</span>
          ) : (
            <span className="pending">•</span>
          )}
          {isMessageSigned ? "Message Signed" : "Signing Message..."}
        </div>
      </div>

      <div className="step">
        <h5>Step 3: Wait for Transaction</h5>
        <div className="step-status">
          {txHash ? (
            <div>
              Transaction Hash:{" "}
              <a
                href={`https://basescan.org/tx//${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="tx-link"
              >
                Hash{" "}
              </a>
            </div>
          ) : txHashLoading ? (
            <div>
              Waiting for Transaction Hash...{" "}
              <Spinner animation="border" size="sm" />
            </div>
          ) : (
            "Waiting for Transaction Hash..."
          )}
        </div>
      </div>

      {currentStep === 4 && (
        <div className="step-completed">
          <span className="green-tick">✔</span> All Steps Completed
          Successfully!
        </div>
      )}
    </div>
  );

  const progressPercentage = ((currentStep - 1) / 3) * 100;

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton={!loading}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>       
        {/* Step Progress */}
        <ProgressBar now={progressPercentage} className="mb-3 custom-progress-bar"  sx={{backgroundColor:"black"}} />
        {renderStepContent()}
      </Modal.Body>

      

      <div className="modal-footer-custom">
        {!loading && currentStep === 1 && (
          <Button className="custom-close-button" onClick={handleAccountCreation}>
            Start Creation
          </Button>
        )}
        {!loading && currentStep === 4 && (
          <Button onClick={onClose} className="custom-close-button">
            Close
          </Button>
        )}
      </div>
      <ToastContainer />

    </Modal>
  );
};

export default SmartAccountModal;
