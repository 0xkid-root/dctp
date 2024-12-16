export function roundOffNumber(balance, decimals) {
    return Math.round(balance * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }