import {base} from "wagmi/chains";
import { ACTION_ROUTER, SOFIN_SALT, ERC6551_REGISTRY, ERC6551_PROXY, ERC6551_IMPLEMENTATION,USDT_ADDRESS, WETH_ADDRESS, ETH_ADDRESS } from "../contracts/contractAddress";
import { actionRouter_abi } from "../contracts/abis/ActionRouter";
import { erc20_abi } from "../contracts/abis/erc20";
import {erc6551_registry_abi} from '../contracts/abis/erc6551Registry';
import { encodeAbiParameters, parseAbiParameters, zeroAddress, encodeFunctionData } from 'viem'
import { Alchemy } from "alchemy-sdk";
import { stringToHex, isAddress} from "viem";
import axios from "axios";

import { alchemySettings } from '../configs/alchemyConfig';

const chainIdData = {sellToken: USDT_ADDRESS, routerAddress: ACTION_ROUTER, wethAddress: WETH_ADDRESS, decimal:6}
const alchemy = new Alchemy(alchemySettings);

export async function cloneFolio(walletClient, client, tokenContractFromUI, tokenIdFromUI, fromAccount, tbaAccountOfUser, fundAmount) {
    
    const cloneData = {chainId: base.id, tokenContract: tokenContractFromUI, tokenId: tokenIdFromUI, slippage:1, toAddress: tbaAccountOfUser };
    const actions = [];
    const subCallData = [];
    let ethValue = "0";

    // Mint Action
    const bytesData = stringToHex("",{size:32});
    actions.push([0, bytesData]);

    const encodedData = encodeAbiParameters( [ { name: 'targetContract', type: 'address' }, { name: 'toAccount', type: 'address' }],[cloneData.tokenContract, cloneData.toAddress]);
    console.log("encodedMintData:", encodedData);
    subCallData.push(encodedData);

    console.log("actions[0]:", actions[0]);
    console.log("subCallData[0]:", subCallData[0]);

    // Create Account Action
    actions.push([1, SOFIN_SALT]);
    subCallData.push(encodeAbiParameters(
        parseAbiParameters(['address, address, address, address, uint256, bool']), [ERC6551_REGISTRY, ERC6551_PROXY, ERC6551_IMPLEMENTATION, cloneData.tokenContract, 0, true]));

    console.log("actions[1]", actions[1])
    console.log("subCallData[1]:", subCallData[1]);

    try {
        const tokenTBAccount = await client.readContract({
                address: ERC6551_REGISTRY,
                abi: erc6551_registry_abi,
                functionName: 'account',
                args: [ERC6551_PROXY, SOFIN_SALT, cloneData.chainId, cloneData.tokenContract, cloneData.tokenId],
            });

        console.log("tokenTBAccount:", tokenTBAccount);

        let tokenHoldings;
        let tokenObj;

        if(tokenTBAccount !== zeroAddress) {
            tokenHoldings = await alchemy.core.getTokenBalances(tokenTBAccount);
            console.log("tokenHoldings:", tokenHoldings);
            // tokenHoldings = {
            //     address: '0xa4f7b5a3dc531729faab9702e743a2174f0b3dfe',
            //     tokenBalances: [
            //       {
            //         contractAddress: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
            //         tokenBalance: '0x989680'
            //       },
            //       {
            //         contractAddress: '0x4200000000000000000000000000000000000006',
            //         tokenBalance: '0xDE0B6B3A7640000'
            //       },
            //       {
            //         contractAddress: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
            //         tokenBalance: '0x1B1AE4D6E2EF500000'
            //       },
            //     ]
            //   }
            //   console.log("new tokenHoldings:", tokenHoldings);
            tokenObj = await getTokenPrice(client,tokenHoldings.tokenBalances, chainIdData, cloneData.chainId, fundAmount);
            console.log("tokenObj:", tokenObj);
        } else {
            throw new Error("Incorrect token info");
        }

        for (const token of tokenObj) {
            if (!token.liquidityAvailable) {
                continue;
            }
  
        const sellAmount = token.tokenAmountInUsdt;
  
        if (chainIdData.sellToken === token.buyToken || !isValidAddress(chainIdData.sellToken) || !isValidAddress(token.buyToken) || BigInt(sellAmount) < 0) {
          continue;
        }
  
        if (chainIdData.sellToken.toLowerCase() === ETH_ADDRESS.toLowerCase()) {
          ethValue = (BigInt(ethValue) + BigInt(sellAmount)).toString();
        }
  
        const responseData = await getZeroXData(cloneData.chainId, chainIdData.sellToken, token.buyToken, sellAmount, chainIdData.routerAddress, chainIdData.wethAddress, "quote");
        if (responseData.liquidityAvailable) {
          const minBuyAmount = (responseData.buyAmount * (100 - cloneData.slippage) / 100).toFixed(0);
          if (BigInt(minBuyAmount) < 0) {
            throw new Error("Zero Amount Out");
          }
  
          actions.push([2, responseData.transaction.data]);
          subCallData.push(encodeAbiParameters(parseAbiParameters(['address', 'address', 'address', 'address', 'address', 'uint256', 'uint256', 'bool']), [
            chainIdData.sellToken, token.buyToken, responseData.transaction.to, fromAccount, cloneData.toAddress, sellAmount, 0, true
          ]));

        console.log("actions[2]", actions[2])
        console.log("subCallData[2]:", subCallData[2]);

        } else {
          throw new Error("Insufficient Liquidity");
        }
      }

      console.log("Actions:", actions);
      console.log("SubCallData:", subCallData)

      const transactionData =  encodeFunctionData({
        abi: actionRouter_abi,
        functionName: 'executeActions',
        args: [actions,subCallData],
      });

      console.log("transactionData:", transactionData);

      const hash = await walletClient.sendTransaction({ 
              to: chainIdData.routerAddress,
              data: transactionData
            })
        
      const txReceipt = await client.waitForTransactionReceipt( 
              { hash: hash }
      )

      return (txReceipt);
    } catch (error) {
      console.error("Error processing request:", error);
      throw error;
    }
} 

const getTokenPrice = async (client, tokenHoldings, chainIdData, chainId, usdAmount) => {
    let totalBalance = 0;
    const tokenObj = [];
  
    await Promise.all(tokenHoldings.map(async (tokenHolding) => {
      try {
        const tokenContract = tokenHolding.contractAddress;
        const tokenBalance = BigInt(tokenHolding.tokenBalance).toString();
  // tokenBalance = 0.001*10**18
        const decimal = await client.readContract({
            address: tokenContract,
            abi: erc20_abi,
            functionName: 'decimals',
        });
        // console.log("tokenContract:", tokenContract, " tokenBalance:", tokenBalance, " decimal:",decimal);
        // console.log("inputValues:", chainId, tokenContract, chainIdData.sellToken, tokenBalance, chainIdData.routerAddress, chainIdData.wethAddress);
        const responseData = await getZeroXData(chainId, tokenContract, chainIdData.sellToken, tokenBalance, chainIdData.routerAddress, chainIdData.wethAddress, "quote");

        // console.log("responseData:", responseData);
  
        if (!responseData || !responseData.liquidityAvailable) {
          tokenObj.push({ liquidityAvailable: false, buyToken: tokenContract });
          return;
        }
  
        let balance = responseData.buyAmount / (10 ** chainIdData.decimal);
        tokenObj.push({ liquidityAvailable: true, buyToken: tokenContract, tbaBalanceInUSD: balance, decimal: decimal });
        totalBalance += balance;
      } catch (error) {
        console.error(`Error processing token ${tokenHolding.contractAddress}:`, error);
        tokenObj.push({ liquidityAvailable: false });
      }
    }));
  
    tokenObj.filter(token => token.liquidityAvailable).forEach(token => {
      token.percentage = token.tbaBalanceInUSD / totalBalance;
      token.tokenAmountInUsdt = ((usdAmount * token.percentage) * 10 ** chainIdData.decimal).toFixed(0);
      token.tokenAmountInUsd = (usdAmount * token.percentage);
      token.tokenAmount = token.tokenAmountInUsd / token.tbaBalanceInUSD;
    });
  
    return tokenObj;
  };

  const getZeroXData = async (chainId, sellToken, buyToken, sellAmount, taker, wethAddress, type) => {
    try {
      sellToken = sellToken.toLowerCase() !== ETH_ADDRESS.toLowerCase() ? sellToken : wethAddress;
      buyToken = buyToken.toLowerCase() !== ETH_ADDRESS.toLowerCase() ? buyToken : wethAddress;

      let urlString = `http://api.0x.org/swap/allowance-holder/${type}?chainId=${chainId}&sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${sellAmount}&taker=${taker}`;
      
      if(process.env.REACT_APP_ENV === 'development') {
        urlString = `https://cors-anywhere.herokuapp.com/`+ urlString;
      }

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        // url: `http://api.0x.org/swap/allowance-holder/${type}?chainId=${chainId}&sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${sellAmount}&taker=${taker}`,
        url: urlString,
        headers: {
          '0x-api-key': '81633ba3-d215-42f3-85ae-a70fb0a539e4',
          "0x-version" : 'v2'
        }
      };
  
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Error fetching swap data:", error);
      return false;
    }
  }

  const isValidAddress = (address) => {
    if (address !== null && address !== undefined && address.trim() !== "") {
      return isAddress(address.toLowerCase());
    } else {
      return false;
    }
  }

// const tokenContracts = ["0x4200000000000000000000000000000000000006","0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb"]

// export async function transferAssetsFromAccount() {

//   const tbaAccountOfUser = "0x220020328e939675ee54b643cee9562fe9bdcce8";

//   tokenContracts.map( async (tokenContract) => {
    
//     const balance = await client.readContract({
//       address: tokenContract,
//       abi: erc20_abi,
//       functionName: 'balanceOf',
//       args: [tbaAccountOfUser],
//     });

//     console.log(`Balance in ${tokenContract} is:`, balance);
    
//     const transactionData = encodeFunctionData({
//       abi: erc20_abi,
//       functionName: "transfer",
//       args: [fromAccount, balance]
//     })

//     const encoded6551Data = encodeFunctionData({
//       abi: erc6551_account_abi,
//       functionName: "executeNested",
//       args:[tokenContract, 0n, transactionData, 0, []]
//     })

//     const wClient = createWalletClient({
//       chain: base,
//       transport: http("https://rpc.tenderly.co/fork/f5008be2-15ad-4e26-a015-a26fc806f71e")
//     });
           
//     const account = privateKeyToAccount('0xc0aa94f4afd558ad57fb73c3bd4b68f6f83670c60be1c348a5a2ca53a1a9b5d1');
    
//     const hash = await wClient.sendTransaction({ 
//       account,
//       to: tbaAccountOfUser,
//       data: encoded6551Data
//     });
    
//     const txReceipt = await client.waitForTransactionReceipt( 
//       { hash: hash }
//     );

//     console.log('******************************************************************************');
//     console.log(txReceipt);
//   });
// }

// async function caller() {
//   let result = await CloneAccount();

//   if(result.success){
//     const wClient = createWalletClient({
//       chain: base,
//       transport: http("https://rpc.tenderly.co/fork/f5008be2-15ad-4e26-a015-a26fc806f71e")
//     })
     
//     const account = privateKeyToAccount('0xc0aa94f4afd558ad57fb73c3bd4b68f6f83670c60be1c348a5a2ca53a1a9b5d1');

//     // console.log("account:" ,account);

//     const hash = await wClient.sendTransaction({ 
//       account,
//       to: result.data.routerAddress,
//       data: result.data.transactionData
//       // value: 1n
//     })

//     const txReceipt = await client.waitForTransactionReceipt( 
//       { hash: hash }
//     )
//     console.log('******************************************************************************');
//     console.log(txReceipt);
//   }
//   else {
//     console.log("Not successful");
//   }
// }

// caller()

// transferAssetsFromAccount()