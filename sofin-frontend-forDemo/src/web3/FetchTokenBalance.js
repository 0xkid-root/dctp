import { formatUnits } from "viem";
import { erc20_abi } from "../contracts/abis/erc20.js";

export async function fetchErc20Balance(client, erc20Contract ,userAddress) {
    try {

      const balance = await client.readContract({
            address: erc20Contract,
            abi: erc20_abi,
            functionName: 'balanceOf',
            args: [userAddress]
          });

      const decimals = await client.readContract({
            address: erc20Contract,
            abi: erc20_abi,
            functionName: 'decimals',
      });

      const humanReadableBalance = formatUnits(balance, decimals);
      console.log("humanReadableBalance is here ",humanReadableBalance);
  
      return humanReadableBalance;
    } catch (error) {
      console.error(`Error fetching ERC20:${erc20Contract} balance for address:`, userAddress, error);
      throw error;
    }
  }