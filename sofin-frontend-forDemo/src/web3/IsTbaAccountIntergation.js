import { Alchemy } from "alchemy-sdk";
import { formatEther } from 'viem';
import { alchemySettings } from "../configs/alchemyConfig.js";
import { SOFIN_SOCIAL_NFT } from "../contracts/contractAddress.js";
import { getNFTAccount } from "./utils/erc6551Utils.js";
import {roundOffNumber} from '../utils/roundOffNumber.js';


const alchemy = new Alchemy(alchemySettings);

// export async function fetchFirstsNftCheckAccount(client, ownerAddress) {
//   try {
//     const nftsForOwner = await alchemy.nft.getNftsForOwner(ownerAddress);
//     const nftDataArray = [];

//     for (const nft of nftsForOwner.ownedNfts) {
//       if(nft.contract.address === SOFIN_SOCIAL_NFT) {
//         const tokenId = nft.tokenId;
    
//         try {
//           const [firstAccountAddress, firstAccountExits]  = await getNFTAccount(client, SOFIN_SOCIAL_NFT, tokenId);

//           if (firstAccountExits) {
//             const nftsForFirstAccount = await alchemy.nft.getNftsForOwner(firstAccountAddress);
//             const erc20Balances = await fetchERC20Balances(firstAccountAddress);
//             console.log("hey hey ram ram jau shree ram @@",erc20Balances);

//             nftDataArray.push({
//               tokenId: nft.tokenId,
//               tokenUri: nft.tokenUri,
//               contractAddress: nft.contract.address,
//               accountAddress: firstAccountAddress,
//               accountExists: firstAccountExits,
//               nftsForFirstAccount: nftsForFirstAccount.ownedNfts,
//               erc20Balances: erc20Balances,
//             });
//           }
//         } catch (error) {
//           console.error(`Error calling account function for tokenId ${tokenId}:`, error);
//         }
//       }
//     }
//     return nftDataArray;
//   } catch (error) {
//       console.error("Error fetching NFTs for owner:", error);
//       throw error;
//   }
// }

export async function fetchFirstsNftCheckAccount(client, ownerAddress) {
  try {
    const nftsForOwner = await alchemy.nft.getNftsForOwner(ownerAddress);
    const nftDataArray = [];

    for (const nft of nftsForOwner.ownedNfts) {
      if (nft.contract.address === SOFIN_SOCIAL_NFT) {
        const tokenId = nft.tokenId;

        try {
          const [accountAddress, accountExists] = await getNFTAccount(client, SOFIN_SOCIAL_NFT, tokenId);

          if (accountExists) {
            const accountNfts = await alchemy.nft.getNftsForOwner(accountAddress);
            // const erc20Balances = await fetchERC20Balances(accountAddress);

            // const erc20WithMetadata = await Promise.all(erc20Balances.map(async (token) => {
            //   const tokenContractAddress = token.contractAddress;
            //   const tokenBalance =  token.balance;

            //   const metadata = await alchemy.core.getTokenMetadata(tokenContractAddress);

            //   return {
            //     contractAddress: tokenContractAddress,
            //     balance: tokenBalance,
            //     name: metadata.name || 'Unknown Token',    
            //     symbol: metadata.symbol || 'UNKNOWN',
            //     decimals: metadata.decimals
            //   };
            // }));

            nftDataArray.push({
              ...nft,
              tbaAccountAddress: accountAddress,
              tbaAccountExists: accountExists,
              accountNfts: accountNfts.ownedNfts,
              // erc20Balances: erc20WithMetadata,  
            });
          }
        } catch (error) {
          console.error(`Error calling account function for tokenId ${tokenId}:`, error);
        }
      }
    }
    // console.log("nftDataArray is here ",nftDataArray)

    return nftDataArray;
  } catch (error) {
    console.error("Error fetching NFTs for owner:", error);
    throw error;
  }
}


// export async function fetchERC20Balances(accountAddress) {
//   try {
//     const tokenBalances = await alchemy.core.getTokenBalances(accountAddress);

//     const humanReadableBalances = await Promise.all(
//       tokenBalances.tokenBalances.map(async (balanceData) => {
//         const { contractAddress, tokenBalance } = balanceData;

//         const formattedBalance = parseInt(tokenBalance);
//         const humanReadableBalance = formatEther(formattedBalance);
//         const roundedBalance = roundOffNumber(humanReadableBalance, 5); 

//         // Only return balances greater than zero is here why you are fear 
//         if (roundedBalance > 0) {
//           return {
//             contractAddress,
//             balance: roundedBalance,
//           };
//         } else {
//           return null;
//         }
//       })
//     );

//     const filteredBalances = humanReadableBalances.filter(balance => balance !== null);

//     return filteredBalances;
//   } catch (error) {
//     console.error(`Error fetching token balances for account ${accountAddress}:`, error);
//     throw error;
//   }
// }

export async function fetchAllNftForSocialAccounts(client, socialNFT) {
  const accountNfts =  socialNFT.accountNfts;
  try {
    // console.log("Fetching NFTs for owner address:", ownerAddress);
    const folioAccounts = [];
    const folioNftsData = [];

    if(Array.isArray(accountNfts) && accountNfts.length > 0 ) {

      for (const nft of accountNfts) {

        const [nftAccountAddress, nftAccountExists] = await getNFTAccount(client, nft.contract.address, nft.tokenId);
        if (nftAccountExists) {
          // const balanceOfToken = await fetchERC20Balances(nftAccountAddress);
          // // console.log(balanceOfToken,"balanceOfToken ishere why you are fear@@###");
          // const erc20WithMetadata =  await Promise.all(balanceOfToken.map(async (token)=>{
          //   const tokenContractAddress = token.contractAddress;
          //   const tokenBalance = token.balance;
          //   const metadata = await alchemy.core.getTokenMetadata(tokenContractAddress);
          //   // console.log("metadata is here Jay shree ram ",metadata);
          //   return {
          //     contractAddress: tokenContractAddress,
          //     balance: tokenBalance,
          //     name: metadata.name || 'Unknown Token',    
          //     symbol: metadata.symbol || 'UNKNOWN',
          //     decimals: metadata.decimals,
          //   };
          // }));
          folioAccounts.push(nftAccountAddress);
          folioNftsData.push({
            ...nft,
            tbaAccountAddress: nftAccountAddress,
            tbaAccountExists: nftAccountExists,
            // erc20Balances: erc20WithMetadata,
          });
        }
      }
    }
    socialNFT.folioAccounts = folioAccounts;
    // console.log("socialNFT, folioNftsData",socialNFT, folioNftsData);
    return {socialNFT, folioNftsData}; 
    
  } catch (error) {
    console.error(`Error calling account function for:`,accountNfts ,error);
  }
}
    

export async function fetchTbaAccountAddresses(client, ownerAddress) {
  try {
    const nftAccountAddressesArray = [];

    const nftsForOwner = await alchemy.nft.getNftsForOwner(ownerAddress);

    for (const nft of nftsForOwner.ownedNfts) {
      const tokenId = nft.tokenId;

      try {
        const [accountAddress, accountExists] = await getNFTAccount(client, nft.contract.address, tokenId);

        if (accountExists) {
          nftAccountAddressesArray.push(accountAddress);

          const nftsForAccount = await alchemy.nft.getNftsForOwner(accountAddress);
          
          for (const nftAccount of nftsForAccount.ownedNfts) {
            const [nftAccountAddress, nftAccountExists] = await getNFTAccount(client, nftAccount.contract.address, nftAccount.tokenId);

            if (nftAccountExists) {
              nftAccountAddressesArray.push(nftAccountAddress);
            }
          }
        }
      } catch (error) {
        console.error(`Error calling account function for tokenId ${tokenId}:`, error);
      }
    }

    // Return the array containing all NFT account addresses
    return nftAccountAddressesArray;

  } catch (error) {
    console.error("Error fetching NFT account addresses for owner:", error);
    throw error;
  }
}