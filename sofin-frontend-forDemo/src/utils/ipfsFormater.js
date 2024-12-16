  export const getIpfsUrl = (uri) => {
    if (uri.startsWith("ipfs://")) {
      return `https://ipfs.io/ipfs/${uri.split("ipfs://")[1]}`;
    }
    return uri;
  };
  