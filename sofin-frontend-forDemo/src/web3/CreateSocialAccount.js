import { encodeFunctionData } from 'viem';
import { socialAccountFactoryAbi } from '../contracts/abis/SocialAccountFactory.js'
import { SOCIAL_ACCOUNT_FACTORY,SOFIN_SOCIAL_NFT,SOFIN_SALT } from '../contracts/contractAddress.js';


export async function createSocialAccount(walletClient, client) {

  try {
    const createAccountData =  encodeFunctionData({
      abi: socialAccountFactoryAbi,
      functionName: 'createAccount',
      args: [SOFIN_SALT, SOFIN_SOCIAL_NFT, 0n],
    });

    const hash = await walletClient.sendTransaction({
      to: SOCIAL_ACCOUNT_FACTORY,
      data: createAccountData,
      value: 0n
    });
    console.log('tx hash submitted', hash);

    const txReceipt = await client.waitForTransactionReceipt( 
      { hash: hash });

    return (txReceipt);

  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
}
