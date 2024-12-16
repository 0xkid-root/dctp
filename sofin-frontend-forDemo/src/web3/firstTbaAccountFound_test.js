import { Network, Alchemy } from "alchemy-sdk";
import { createPublicClient, http } from "viem";
import { stringToHex } from "viem";
import { baseSepolia } from "viem/chains";
import {
  SOFIN_SOCIAL_NFT,
  SOCIAL_ACCOUNT_FACTORY,
} from "../contracts/contractAddress.js";
import { socialAccountFactoryAbi } from "../contracts/abis/SocialAccountFactory.js";

// Initialize Alchemy settings
const settings = {
  apiKey: "yhvcawFSGcdgQV-OvpnEIh4aa9hzhy6L",
  network: Network.BASE_SEPOLIA,
};
const alchemy = new Alchemy(settings);



export async function fetchFirstsNftCheckSocial(ownerAddress) {
  try {
    // console.log("Fetching NFTs for owner address:", ownerAddress);
    const nftsForOwner = await alchemy.nft.getNftsForOwner(ownerAddress);
    // console.log("Total NFTs found for owner:", nftsForOwner.totalCount);

    for (const nft of nftsForOwner.ownedNfts) {
      // const tokenId = nft.tokenId;
      // const firstTokenUri = nft.tokenUri;
      // console.log(`Token URI for tokenId ${tokenId}:`, firstTokenUri);
      // console.log("first nft is here why you are fear @@@@", nft);
      return nft;
    }
  } catch (error) {
    console.error("Error fetching NFTs for owner:", error);
  }
}
