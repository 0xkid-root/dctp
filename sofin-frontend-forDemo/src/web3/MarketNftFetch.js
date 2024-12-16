import { folioNFT_abi } from "../contracts/abis/FolioNFT.js";
// import { fetchERC20Balances } from "./IsTbaAccountIntergation.js";
import { getNFTAccount } from "./utils/erc6551Utils.js";
// import { Alchemy, Network } from "alchemy-sdk";
// import {alchemySettings} from "../configs/alchemyConfig.js"

// const alchemy = new Alchemy(alchemySettings);

export async function fetchNFTData(contractAddress, tokenId,client) {
  try {
    // Fetch the owner of the NFT
    const owner = await client.readContract({
      address: contractAddress,
      abi: folioNFT_abi,
      functionName: 'ownerOf',
      args: [tokenId],
    });

    // Fetch the token URI (metadata URI) for the NFT
    const tokenURI = await client.readContract({
      address: contractAddress,
      abi: folioNFT_abi,
      functionName: 'tokenURI',
      args: [tokenId],
    });

    const name = await client.readContract({
      address: contractAddress,
      abi: folioNFT_abi,
      functionName: 'name',
    });

    const symbol = await client.readContract({
      address: contractAddress,
      abi: folioNFT_abi,
      functionName: 'symbol',
    });

    // Fetch the associated account for the NFT
    const [accountAddress, accountExists] = await getNFTAccount(client, contractAddress, tokenId);
    
    // console.log("Account Address:", accountAddress);
    // console.log("Account Exists is here:", accountExists);
    
    // let erc20Balances = null;
    // let tokenMetadataList = [];

    // if (accountExists) {
    //   erc20Balances = await fetchERC20Balances(accountAddress);
    //   console.log("ERC-20 Balances:", erc20Balances);

    //   for (const token of erc20Balances) {
    //     const tokenContractAddress = token.contractAddress;
    //     const tokenBalance = token.balance;

    //     // console.log(`Token Contract Address: ${tokenContractAddress}`);
    //     // console.log(`Token Balance: ${tokenBalance}`);

    //     // Fetch metadata for the ERC-20 token
    //     const metadata = await alchemy.core.getTokenMetadata(tokenContractAddress);
    //     console.log("Token Metadata:", metadata);

    //     // Add the metadata and balance to the token metadata list
    //     tokenMetadataList.push({
    //       contractAddress: tokenContractAddress,
    //       balance: tokenBalance,
    //       name: metadata.name,
    //       symbol: metadata.symbol,
    //       decimals: metadata.decimals,
    //     });
    //   }
    // }

    return { owner, tokenURI, tokenContract: contractAddress, tokenId, tbaAccountAddress:accountAddress, name, symbol };
  } catch (error) {
    console.error("Error fetching NFT data:", error);
    return null;
  }
}

// Example usage
// fetchNFTData(Folio1NFT, 1);
