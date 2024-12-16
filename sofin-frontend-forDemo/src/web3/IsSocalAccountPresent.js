import { Alchemy } from "alchemy-sdk";
import { SOFIN_SOCIAL_NFT} from "../contracts/contractAddress.js";
import {alchemySettings} from "../configs/alchemyConfig.js"
import { getNFTAccount } from "./utils/erc6551Utils.js";

const alchemy = new Alchemy(alchemySettings);

export async function IsSocialAccountPresent(client, ownerAddr) {
  // console.log("fetching NFTs for address:", ownerAddr);
  // console.log("...");

  const nftsForOwner = await alchemy.nft.getNftsForOwner(ownerAddr);
  // console.log("NFTs for owner found:", nftsForOwner.totalCount);

  const tokenContract = SOFIN_SOCIAL_NFT; 

  for (const nft of nftsForOwner.ownedNfts) {
    if(nft.contract.address === tokenContract){
    
      const tokenId = nft.tokenId; 
      // console.log(`Calling account function for tokenId: ${tokenId}`);

      try {
        const result = await getNFTAccount(client, tokenContract, tokenId);
        const accountExists = result[1];
        // console.log("Account Exists:", accountExists);

        return accountExists ? result : undefined;

      } catch (error) {
        console.error(`Error getting account info for user: ${ownerAddr} and tokenId ${tokenId}:`, error);
      }
    }
  }
  return false;
}
