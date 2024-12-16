export const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 5)}...${address.slice(-6)}`;
  };



  export const  formatDecimalPercentage = (value, decimals = 2) => {
    return Number(value).toFixed(decimals);
  }

  
  export const  formatDecimalBalance = (value, decimals = 4) => {
    return Number(value).toFixed(decimals);
  }