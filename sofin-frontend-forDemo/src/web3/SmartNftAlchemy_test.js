import { Network, Alchemy } from "alchemy-sdk";
import { createPublicClient, http } from 'viem';
import { stringToHex } from 'viem';
import { baseSepolia } from 'viem/chains'; 
import { SOFIN_SOCIAL_NFT, SOCIAL_ACCOUNT_FACTORY,Folio1NFT } from "../contracts/contractAddress.js";
import { socialAccountFactoryAbi } from "../contracts/abis/SocialAccountFactory.js";

// Initialize Alchemy settings
const settings = {
  apiKey: "yhvcawFSGcdgQV-OvpnEIh4aa9hzhy6L",
  network: Network.BASE_SEPOLIA,
};
const alchemy = new Alchemy(settings);

// Initialize client for viem
const client = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

// Function to get NFTs for an owner and check social account existence
export async function fetchOwnerAndCheckSocialAccounts(ownerAddress) {
  try {
    console.log("Fetching NFTs for owner address:", ownerAddress);
    const nftsForOwner = await alchemy.nft.getNftsForOwner(ownerAddress);
    console.log("Total NFTs found for owner:", nftsForOwner.totalCount);

    const salt = stringToHex('0', { size: 32 });
    const tokenContract = Folio1NFT; // Your contract address

    // Iterate over each NFT owned by the owner
    for (const nft of nftsForOwner.ownedNfts) {
      const tokenId = nft.tokenId; 
      const firstTokenUri = nft.tokenUri;
      console.log(`Token URI for tokenId ${tokenId}:`, firstTokenUri);

      try {
        // Call the contract to check if the account exists
        const result = await client.readContract({
          address: SOCIAL_ACCOUNT_FACTORY,
          abi: socialAccountFactoryAbi,
          functionName: 'account',
          args: [salt, tokenContract, tokenId],
        });

        const [accountAddress, accountExists] = result;
        console.log("Account Address:", accountAddress);
        console.log("Account Exists:", accountExists);

        if (accountExists) {
          console.log(`Fetching NFTs for account address: ${accountAddress}`);
          const nftsForAccount = await alchemy.nft.getNftsForOwner(accountAddress);

          console.log(`Number of NFTs found for account ${accountAddress}:`, nftsForAccount.totalCount);
          for (const nftAccount of nftsForAccount.ownedNfts) {
            console.log("NFT Contract Address:", nftAccount.contract.address);
            console.log("NFT Token ID:", nftAccount.tokenId);
            console.lob("second nftAccount is here Jay Shree Ram *****",nftAccount)

            // Call the contract again for NFTs under the account address
            const result = await client.readContract({
              address: SOCIAL_ACCOUNT_FACTORY,
              abi: socialAccountFactoryAbi,
              functionName: 'account',
              args: [salt, nftAccount.contract.address, nftAccount.tokenId],
            });

            const [nftAccountAddress, NftaccountExists] = result;
            console.log("NFT Account Address:", nftAccountAddress);
            console.log("NFT Account Exists:", NftaccountExists);

            if (NftaccountExists) {
              console.log(`Fetching ERC20 token balances for account address: ${nftAccountAddress}`);
              const balanceofToken = await alchemy.core.getTokenBalances(nftAccountAddress);
              console.log(`Token balances for ${nftAccountAddress}:`, balanceofToken);
            }
          }
        }
      } catch (error) {
        console.error(`Error calling account function for tokenId ${tokenId}:`, error);
      }
    }
  } catch (error) {
    console.error("Error fetching NFTs for owner:", error);
  }
}



export async function fetchFirstsNftCheckAccount(ownerAddress) {
  try {
    const nftsForOwner = await alchemy.nft.getNftsForOwner(ownerAddress);
    console.log("owner addresss is here:",ownerAddress);
    const salt = stringToHex('0', { size: 32 });
    const tokenContract = SOFIN_SOCIAL_NFT; 

    for (const nft of nftsForOwner.ownedNfts) {
      const tokenId = nft.tokenId;
      console.log("tokenid ishere:::",tokenId);
      console.log("nft part console is here:",nft);
      try {
        const result = await client.readContract({
          address: SOCIAL_ACCOUNT_FACTORY,
          abi: socialAccountFactoryAbi,
          functionName: 'account',
          args: [salt, tokenContract, tokenId],
        });

        const [firstAccountAddress, firstAccountExits] = result;

        if (firstAccountExits) {
          const nftsForFirstAccount = await alchemy.nft.getNftsForOwner(firstAccountAddress);
          console.log(`Number of NFTs found for account ${firstAccountAddress}:`, nftsForFirstAccount.totalCount);

        }
      } catch (error) {
        console.error(`Error calling account function for tokenId ${tokenId}:`, error);
      }
    }


  } catch (error) {
    console.error("Error fetching NFTs for owner:", error);
    throw error;
  }
}


fetchFirstsNftCheckAccount("0xb8113c12B30732f74cBD8392B7e321E20133903B")