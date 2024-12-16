import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useAccount, useSwitchChain, useWalletClient } from "wagmi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Divider from "@mui/material/Divider";
import {handleError} from "../../../utils/ErrorHandle"

import IconCopy from "../../../assets/images/iconsCopy.svg";
import iconStar from "../../../assets/images/iconsStar.svg";
import marketPro from "../../../assets/images/profileSection.svg";
import verfiedImage from "../../../assets/images/verifiedAccount.svg";
import { USDT_ADDRESS } from "../../../contracts/contractAddress";
import { formatDecimalBalance, formatDecimalPercentage } from "../../../utils/AddressFormat";
import { getOneAccountInvestment } from "../../../web2/api";
import { approveUSDT,checkAllowance } from "../../../web3/approveUSDT";
import { cloneFolio } from "../../../web3/cloneFolio";
import { fetchErc20Balance } from "../../../web3/FetchTokenBalance";
import "./MarketSubChild.css";
import OverviewSection from "./OverviewSection";

const MarketSubChild = ({ client, userAddress, tbAccount }) => {
  const location = useLocation();
  const { selectedNft } = location.state || {};

  const [approveLoading, setApproveLoading] = useState(false);
  const [cloneLoading, setCloneLoading] = useState(false);

  const [txHash, setTxHash] = useState("");
  const [approveTxHash, setApproveTxHash] = useState("");
  const [cloneTxHash, setCloneTxHash] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [ownerBalance, setOwnerBalance] = useState('');
  const [errorMessage, setErrorMessage] = useState(""); // Add error message state
  const [maxAllowance,setMaxAllowance] = useState("");
  console.log("ownerBalance si hetre",ownerBalance);


  const { isConnected, chainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { data: walletClient } = useWalletClient();
  const [tokenBalances, setTokenBalances] = useState([]);

  useEffect(() => {
    async function fetchParticularInvestment() {
      try {
        const tbaAccountInvestment = await getOneAccountInvestment(selectedNft.tbaAccountAddress);
        if (tbaAccountInvestment && Array.isArray(tbaAccountInvestment.tokens)) {
          const balances = tbaAccountInvestment.tokens.map(token => ({
            tokenAddress: token.tokenAddress,
            balance: token.balance,
            usdValue: token.usdValue,
            percentageOfTotal: token.percentageOfTotal,
            logo: token.logo,
            symbol: token.symbol,
          }));
          setTokenBalances(balances);
        }
      } catch (error) {
        toast.error("Failed to fetch investment data. Please try again.");
      }
    }
  
    fetchParticularInvestment();
  }, [selectedNft.tbaAccountAddress]);

  // useEffect(()=>{
  //   async function checkOwnerAllowance() {
  //     try{
  //       const allowanceAmount = await checkAllowance(client,userAddress);
  //       console.log("allowance amount is here why you are fear @@@",allowanceAmount);
  //       setMaxAllowance(allowanceAmount);

  //     }catch(error){
  //       console.log(error,"cehckownerallowance");
  //     }
  //   }
  //   checkOwnerAllowance();

  // },[]);

  const isButtonDisabled = maxAllowance >= ownerBalance;


  const handleMaxClick = () => {
    if (ownerBalance) {
      setInputValue(ownerBalance);
      setErrorMessage("");
    }
  };
  const handleApprove = async () => {
    try {
      if (!inputValue) {
        toast.error("Please enter the amount of USDT you want to approve.");
        return; 
      }
      setApproveLoading(true);

      if (Number(maxAllowance) >= Number(inputValue)) {
        toast.info("You already have sufficient allowance.");
        return; 
    }
  
      if (isConnected && walletClient) {
        const targetChainId = parseInt(process.env.REACT_APP_CHAIN_ID);
  
        if (chainId !== targetChainId) {
          await switchChainAsync({ chainId: targetChainId });
        }
  
        const { txReceipt, allowance } = await approveUSDT(walletClient, client, inputValue, userAddress);
        
        console.log("approvalTxReceipt is here :::", txReceipt);
        console.log("allowance is here why you are fear::", allowance.toString());
  
        setApproveTxHash(txReceipt.transactionHash);  
        
        if (txReceipt.status === 'success') {
          toast.success('Successfully Approved!');
        }
      }      
    } catch (error) {
      handleError(error)
    } finally {
      setApproveLoading(false);
      setShowModal(true); 
    }
  };
  const handleClone = async () => {
    try {
      if (inputValue > ownerBalance || inputValue > Number(maxAllowance)) {
        toast.error(`Insufficient funds! Your USDT Balance is ${ownerBalance}, and your Allowance is ${maxAllowance}. Please provide a valid input.`);
        return; 
      }
      // if (inputValue > ownerBalance) {
      //   toast.error(`Your USDT Balance is ${ownerBalance} Please Provided Valid Input! `);
      //   return; 
      // }else if(inputValue > Number(maxAllowance)){
      //   toast.error(`Your Allowance is ${maxAllowance} Please Provided Valid Input! `);
      //   return;
      // }
      if (isConnected && walletClient) {
        const targetChainId = parseInt(process.env.REACT_APP_CHAIN_ID);

        if (chainId !== targetChainId) {
          await switchChainAsync({ chainId: targetChainId });
        }

        setCloneLoading(true);

        const cloneTxReceipt = await cloneFolio(
          walletClient,
          client,
          selectedNft.tokenContract,
          selectedNft.tokenId,
          userAddress,
          tbAccount,
          inputValue
        );
        if(cloneTxReceipt.status === 'success'){
          setCloneTxHash(cloneTxReceipt.transactionHash);
          toast.success('successfully Cloned !');
        }
      }
    } catch (error) {
      console.log("error name is here:",error);
      handleError(error);
      } finally {
      setCloneLoading(false);
      setShowModal(true);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (!isNaN(value) && value >= 0) {
      setInputValue(value);
      if (Number(value) > Number(ownerBalance)) {
        setErrorMessage(`Your max balance is ${formatDecimalBalance(ownerBalance)}`);
      } else {
        setErrorMessage(""); // Clear error if input is valid
      }
    } 
  };

  const fetchOwnerUsdtBalance = async () => {
    try {
      const balance = await fetchErc20Balance(client, USDT_ADDRESS, userAddress);
      setOwnerBalance(balance);
      const allowanceAmount = await checkAllowance(client, userAddress);
      console.log("allowance amount is here why you are fear @@@", allowanceAmount);
      
      setTimeout(() => {
        setMaxAllowance(allowanceAmount);
      }, 2000);
      
    } catch (error) {
      toast.error("Error fetching USDT balance. Please try again.");
    }
  };
  

  useEffect(() => {
    fetchOwnerUsdtBalance();
  }, [client, userAddress]);

  return (
    <div className="main-container">
    <ToastContainer />

      <div className="main-content mb-3">
        <div className="leftImageSection">
          <img
            className="assetImage"
            src={selectedNft.image}
            alt="assets images"
          />
        </div>

        <div className="rightSideSection">
          <div className="headerSection">
            <div className="rightSideAction">
              <div>
                <p className="rightSideTitle">
                  BNB, ETH & SOL smart money fund...
                </p>
              </div>

              <div className="buttonStyle">
                <button className="watchlistButton">
                  <img src={iconStar} alt="iconstar" /> Watchlist
                </button>

                <button className="cloneButton" onClick={handleShowModal}>
                  <img src={IconCopy} alt="iconcopy" /> Clone it
                </button>
              </div>
            </div>

            <div className="rightSideManager">
              <img className="managerImage" src={marketPro} alt="manager" />
              <div className="managerInfo">
                <div className="managerNameContainer">
                  <div className="managerName">{`Ram ${selectedNft.name}`}</div>
                  <img
                    src={verfiedImage}
                    alt="verified Image"
                    className="yellowTick"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="managerDescription">
                {selectedNft.description}
              </div>
            </div>

            <hr style={{ color: "#595757", height: "1px", border: "1px solid #595757" }} />
          </div>

          <div className="fundallocationAsset">
            {tokenBalances?.map((token, index) => (
              <React.Fragment key={index}>
                <div className="findlistAsset">
                  <div className="fundimgAsset">
                    <div className="imge1Asset">
                      <img
                        src={token.logo}
                        alt={`${token.symbol} logo`}
                        />
                    </div>
                    <div className="nameAsset">
                      {`${token.symbol}` || "N/A"}
                    </div>
                    <div className="amount ms-auto">{formatDecimalBalance(token.balance)}</div>
                  </div>

                  <div className="progressbar">
                    <div
                      className="progress"
                      role="progressbar"
                      aria-valuenow={token?.percentageOfTotal}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div
                        className="progress-bar"
                        style={{ width: `${token.percentageOfTotal}%` }}
                        ></div>
                    </div>
                    <span>{formatDecimalPercentage(token?.percentageOfTotal)}%</span>
                  </div>
                </div>

                {index < tokenBalances.length - 1 && (
                  <Divider
                  className="divider-css"
                    orientation="vertical"
                    flexItem
                    sx={{
                      marginLeft: 2,
                      marginRight: 2,
                      backgroundColor: "#ccc",
                      height: "100px",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>

      <OverviewSection tbaAccountAddress={selectedNft.tbaAccountAddress}/>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Clone Amount</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
          
            <div className="d-flex justify-content-end align-items-center">
              <Form.Group controlId="formMaxBalance" className="d-flex align-items-center">
              <span className="maxLabel" style={{ marginRight: '10px' }} onClick={handleMaxClick}>USDT Balance</span> 
              <Form.Control
                  type="text"
                  value={ownerBalance}
                  placeholder="Max balance"
                  style={{ width: '100px', textAlign: 'center' }} 
                  readOnly
                />
              </Form.Group>
            </div>

            <div className="d-flex align-items-center mt-3 mb-2">
              <Form.Label className="me-2" style={{marginTop:"10px" }} 
              >USDT:</Form.Label>
              <Form.Control
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter amount"
                
              />              
            </div>

            {errorMessage && (
              <p className="text-danger ">{errorMessage}</p>
            )}

            {Number(maxAllowance) >= Number(inputValue) && (
              <div className="text-success">{`You have been already  ${maxAllowance} Allowance `}</div>
            )}

            

            {approveTxHash && (
              <div className="mt-3">
                Approved Hash:
            <a href={`https://basescan.org/tx/${approveTxHash}`} target="_blank" rel="noopener noreferrer">Hash
      </a>

              </div>
            )}

            {cloneTxHash && (
              <div className="mt-3">
                Cloned Hash:
                <a href={`https://basescan.org/tx/${cloneTxHash}`} target="_blank" rel="noopener noreferrer">Hash</a>
              </div>
            )}
            
          </Form>
        </Modal.Body>

        <Modal.Footer>
      
        <Button
        onClick={handleApprove}
        disabled={approveLoading || isButtonDisabled}
        className={`custom-disabled ${approveLoading || isButtonDisabled ? 'custom-disabled' : ''}`} // Use custom-disabled for disabled state
        style={{ backgroundColor: '#000', borderColor: '#000', color: '#FFF' }}
      >
        {approveLoading ? <Spinner animation="border" size="sm" /> : "Approve"}
      </Button>
      
          
          <Button
            variant="success"
            onClick={handleClone}
            disabled={cloneLoading}
            style={{ backgroundColor: '#FFDE02', borderColor: '#FFDE02', color: '#000' }} 

          >
            {cloneLoading ? <Spinner animation="border" size="sm" /> : "Clone"}
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default MarketSubChild;
