import { isWhiteListAbi } from '../contracts/abis/WhiteList.js';
import { WHITELIST_CONTRACT } from '../contracts/contractAddress.js';

export async function CheckWhitelistStatus(client, userAddress) {
    try {
        if (!userAddress) {
            console.error("User wallet address not provided");
            return null;
        }

        const isWhitelisted = await client.readContract({
            address: WHITELIST_CONTRACT,
            abi: isWhiteListAbi,
            functionName: 'isWhitelisted',
            args: [userAddress],
        });

        return isWhitelisted;
    } catch (error) {
        console.error("Error checking whitelist status:", error);
        throw error;
    }
}