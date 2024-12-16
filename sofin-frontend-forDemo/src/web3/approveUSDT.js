import { USDT_ADDRESS, ACTION_ROUTER } from "../contracts/contractAddress";
import { erc20_abi } from "../contracts/abis/erc20";
import { encodeFunctionData, parseUnits,formatUnits } from "viem";

export async function approveUSDT(walletClient, client, fundAmount, owner) {
  try {
    const decimals = await client.readContract({
      address: USDT_ADDRESS,
      abi: erc20_abi,
      functionName: "decimals",
    });

    const approvalAmount = parseUnits(fundAmount.toString(), decimals);
    console.log("approvalAmount:", approvalAmount);

    const transactionData = encodeFunctionData({
      abi: erc20_abi,
      functionName: 'approve',
      args: [ACTION_ROUTER, approvalAmount],
    });

    console.log("transactionData:", transactionData);

    const hash = await walletClient.sendTransaction({
      to: USDT_ADDRESS,
      data: transactionData
    });

    const txReceipt = await client.waitForTransactionReceipt({ hash: hash });
    console.log(txReceipt);

    const allowance = await checkAllowance(client, owner);
    
    return { txReceipt, allowance };
  } catch (error) {
    console.error("Error approving USDT:", error.message);
    throw error;
  }
}

export async function checkAllowance(client, owner) {
  try {

    const decimals = await client.readContract({
      address: USDT_ADDRESS,
      abi: erc20_abi,
      functionName: "decimals",
    });
    const allowance = await client.readContract({
      address: USDT_ADDRESS,
      abi: erc20_abi,
      functionName: "allowance",
      args: [owner, ACTION_ROUTER],  
    });
    
    console.log(allowance.toString(),decimals);

    const allowanceBalance = formatUnits(allowance.toString(),decimals);
    console.log("hey sushil ####" ,allowanceBalance);

    
    return allowanceBalance;
  } catch (error) {
    console.error("Error checking allowance:", error.message);
    throw error;
  }
}
