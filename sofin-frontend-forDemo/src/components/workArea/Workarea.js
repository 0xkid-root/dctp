// import React, { useState, useEffect } from "react";
// import PerformanceChart from "../charts/PerformanceChart";
// import { formatAddress } from "../../utils/AddressFormat";
// import {
//   fetchAllNftForSocialAccounts,
//   fetchFirstsNftCheckAccount,fetchTbaAccountAddresses
// } from "../../web3/IsTbaAccountIntergation";
// import InvestedAmountSection from "./InvestedAmountSection";
// import FundlocationSection from "./FundlocationSection";
// import { getIpfsUrl } from "../../utils/ipfsFormater";
// import NftLoadingfetch from "../LoadingPage/NftLoadingfetch";
// import {useAccount} from "wagmi";
// import { postMultipleAccountInvestment } from "../../web2/api";

// export default function Workarea({ client }) {
//   const { address: userAddress } = useAccount();
//   const [firstNftTokenUri, setFirstNftTokenUri] = useState([]);
//   const [firstNftTokenIds, setFirstNftTokenIds] = useState([]);
//   const [firstNftImages, setFirstNftImages] = useState([]);
//   const [allTokenNftUris, setAllTokenNftUris] = useState([]);
//   const [allTokenIds, setAllTokenIds] = useState([]);
//   const [allTokenImages, setAllTokenImages] = useState([]);
//   const [allErc20Balances, setAllErc20Balances] = useState([]);
//   const [firstErc20Balances, setFirstErc20Balances] = useState([]);
//   const [selectedTokenId, setSelectedTokenId] = useState(null);
//   const [chartSize, setChartSize] = useState({ width: "100%", height: 400 });
//   const [isNftLoading, setIsNftLoading] = useState(true);
//   const [investmentData, setInvestmentData] = useState([]);

//   useEffect(() => {
//     async function fetchAllInvestment() {
//       try {
//         const tbaAccountAddresss = await fetchTbaAccountAddresses(client, userAddress);
//         // console.log(tbaAccountAddresss,"response is here @@@@");

//         const tbaAccountInvestment = await postMultipleAccountInvestment(tbaAccountAddresss);
//         setInvestmentData(tbaAccountInvestment);
//         console.log(tbaAccountInvestment, "hello dear ram");

//       } catch (error) {
//         console.log(error, "hello dear ram");
//       }
//     }
//     fetchAllInvestment();
//   }, [client, userAddress]);

//   useEffect(() => {
//     async function fetchNftInformation() {
//       if (!userAddress) return;

//       try {
//         setIsNftLoading(true);
    
//         const response = await fetchFirstsNftCheckAccount(client, userAddress);
//         if (Array.isArray(response) && response.length > 0) {
//           const firstTokenUris = response.map((nft) => nft.tokenUri);
//           const firstTokenIds = response.map((nft) => nft.tokenId);
//           setFirstNftTokenUri(firstTokenUris);
//           setFirstNftTokenIds(firstTokenIds);

//           // Fetch NFT metadata for the first NFTs
//           const firstNftImages = await Promise.all(
//             firstTokenUris.map(async (uri) => {
//               const metadata = await fetch(getIpfsUrl(uri)).then((res) =>
//                 res.json()
//               );
//               return getIpfsUrl(metadata.image);
//             })
//           );
//           setFirstNftImages(firstNftImages);

//           const firstErc20BalanceData = investmentData.map((balance, index) => ({
//             balance: balance.balance,
//             usdValue: balance.usdValue,
//             percentageOfTotal: balance.percentageOfTotal,
//           }));
//           setFirstErc20Balances(firstErc20BalanceData);
//         }

//         const response2 = await fetchAllNftForSocialAccounts(
//           client,
//           userAddress
//         );
//         if (Array.isArray(response2) && response2.length > 0) {
//           const tokenUris = response2.map((nft) => nft.tokenUri);
//           const tokenIds = response2.map((nft) => nft.tokenId);
//           setAllTokenIds(tokenIds);
//           setAllTokenNftUris(tokenUris);

//           const allNftImages = await Promise.all(
//             tokenUris.map(async (uri) => {
//               const metadata = await fetch(getIpfsUrl(uri)).then((res) =>
//                 res.json()
//               );
//               return getIpfsUrl(metadata.image);
//             })
//           );
//           setAllTokenImages(allNftImages);

//           // const erc20BalanceData = response2.flatMap((nft) =>
//           //   nft.erc20Balances.map((balance) => ({
//           //     tokenId: nft.tokenId,
//           //     contractAddress: balance.contractAddress,
//           //     balance: balance.balance,
//           //     decimals: balance.decimals,
//           //     symbol: balance.symbol,
//           //     name: balance.name,
//           //   }))
//           // );
//           // setAllErc20Balances(erc20BalanceData);
//           const erc20BalanceData = investmentData.map((balance, index) => ({
//             balance: balance.balance,
//             usdValue: balance.usdValue,
//             percentageOfTotal: balance.percentageOfTotal,
//           }));
//           console.log("erc20BalanceData balance data is here::",erc20BalanceData);
          
//           setAllErc20Balances(erc20BalanceData);



//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       } finally {
//         setIsNftLoading(false);
//       }
//     }

//     fetchNftInformation();
//   }, [userAddress]);

//   const handleNftClick = (tokenId) => {
//     if (tokenId === firstNftTokenIds[0]) {
//       setSelectedTokenId(null);
//     } else {
//       setSelectedTokenId(tokenId);
//     }
//   };

//   return (
//     <div className="main-container">
//       <h4 className="text-black mb-4 d-block d-lg-none">
//         Welcome Back, {formatAddress(userAddress)}
//       </h4>

//       <div className="row">
//         <div className="col-xl-9 col-lg-8">
//           <InvestedAmountSection investmentData={investmentData} />

//           <div className="row">
//             {/* NFT Section */}
//             {isNftLoading ? (
//               <NftLoadingfetch />
//             ) : (
//               <>
//                 {/* Dynamic first NFTs */}
//                 {firstNftImages.map((image, index) => (
//                   <div className="col-sm-4 mb-4" key={index}>
//                     <div
//                       className="card cardcustom"
//                       style={{ border: "none" }}
//                       onClick={() => handleNftClick(firstNftTokenIds[index])}
//                     >
//                       <div className="card-body p-0" style={{ border: "none" }}>
//                         <img
//                           className="w-100"
//                           src={image}
//                           alt={`Token ID ${firstNftTokenIds[index]}`}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ))}

//                 {/* All other NFTs */}
//                 {allTokenImages.map((image, index) => (
//                   <div className="col-sm-4 mb-4" key={index}>
//                     <div
//                       className="card cardcustom"
//                       style={{ border: "none" }}
//                       onClick={() => handleNftClick(allTokenIds[index])}
//                     >
//                       <div className="card-body p-0" style={{ border: "none" }}>
//                         <img
//                           className="w-100"
//                           src={image}
//                           alt={`Token ID ${allTokenIds[index]}`}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </>
//             )}

//             <div className="col-md-12 mb-4">
//               <div className="chartmain">
//                 <PerformanceChart chartSize={chartSize} />
//               </div>
//             </div>
//           </div>
//         </div>

//         <FundlocationSection
//           allerc20Balances={allErc20Balances}
//           firstErc20Balances={firstErc20Balances}
//           selectedTokenId={selectedTokenId}
//         />
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import PerformanceChart from "../charts/PerformanceChart";
import { formatAddress } from "../../utils/AddressFormat";
import {
  fetchAllNftForSocialAccounts,
  fetchFirstsNftCheckAccount,
  fetchTbaAccountAddresses,
} from "../../web3/IsTbaAccountIntergation";
import InvestedAmountSection from "./InvestedAmountSection";
import FundlocationSection from "./FundlocationSection";
import { getIpfsUrl } from "../../utils/ipfsFormater";
import NftLoadingfetch from "../LoadingPage/NftLoadingfetch";
import { useAccount } from "wagmi";
import { postMultipleAccountInvestment, postMultipleAccountInvestmentHistory } from "../../web2/api";

export default function Workarea({ client }) {
  const { address: userAddress } = useAccount();
  const [firstNftData, setFirstNftData] = useState([]);
  const [allNftData, setAllNftData] = useState([]);
  const [isNftLoading, setIsNftLoading] = useState(true);
  const [investmentData, setInvestmentData] = useState([]);
  const [tokenBalances, setTokenBalances] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [tbaAccountAddresses, setTbaAccountAddresses] = useState([]);

  // Fetch NFT information
  useEffect(() => {
    async function fetchNftInformation() {
      if (!userAddress) return;

      try {
        setIsNftLoading(true);

        const socialNFTsData = await fetchFirstsNftCheckAccount(client, userAddress);
        console.log("socialNFTsData is workarea ",socialNFTsData);
        const updatedSocialNFTsData = [];
        const allFolioNftsData = [];

        if (Array.isArray(socialNFTsData) && socialNFTsData.length > 0) {
          await Promise.all(
            socialNFTsData.map(async (nft, index) => {
              const {socialNFT, folioNftsData} = await fetchAllNftForSocialAccounts(client, nft);
              updatedSocialNFTsData.push(socialNFT)
              if (Array.isArray(folioNftsData) && folioNftsData.length > 0) {
                folioNftsData.map((folioNft, index) =>{
                  allFolioNftsData.push(folioNft);
                }) 
              }
            })
          )
          // console.log('&&&& allFolioNftsData', allFolioNftsData);
          // console.log('&&&& socialNFTsData', socialNFTsData);
          // console.log('&&&& updatedSocialNFTsData', updatedSocialNFTsData);
          setAllNftData(allFolioNftsData);
          setFirstNftData(updatedSocialNFTsData); // check this carefully
        }
      } catch (error) {
        console.error("Error fetching NFT information:", error);
      } finally {
        setIsNftLoading(false);
      }
    }

    fetchNftInformation();
  }, [userAddress, client]);

  useEffect(()=>{    
    async function getAllTBAccountAddresses() {
      try{
        const tbaAccountAddresses = await fetchTbaAccountAddresses(client, userAddress);
        console.log('tbaAccountAddresses:', tbaAccountAddresses);
        setTbaAccountAddresses(tbaAccountAddresses);

      }catch(error){
        console.error("Error in getting the TBAAddresses", error);
      }
    }

    getAllTBAccountAddresses();
  },[client, userAddress]);

  // Fetch all investment data for the users TBaccounts here 
  useEffect(() => {
    async function fetchAllInvestments() {
      try {
          const tbaAddresses = await fetchTbaAccountAddresses(client, userAddress);
          if(tbaAddresses.length > 0) {

            console.log("***** investment data called for", tbaAddresses);
            const tbaInvestments = await postMultipleAccountInvestment(tbaAddresses);
            console.log("tbaInvestments is here :", tbaInvestments);
            
            setInvestmentData(tbaInvestments);
          }
      } catch (error) {
        console.error("Error fetching investment data:", error);
      }
    }

    fetchAllInvestments();

  }, [client, userAddress]);

  useEffect(() => {
    async function fetchFundAllocations() {
      try {
        console.log("***** fundallocation data called for", tbaAccountAddresses);
        if(tbaAccountAddresses.length > 0) {

          const tbaAccountInvestment = await postMultipleAccountInvestment(tbaAccountAddresses);
          console.log('***** tbaAccountInvestment:', tbaAccountInvestment);
          if (tbaAccountInvestment && Array.isArray(tbaAccountInvestment.tokens)) {
            const balances = tbaAccountInvestment.tokens.map(token => ({
              tokenAddress: token.tokenAddress,
              balance: token.balance,
              usdValue: token.usdValue,
              percentageOfTotal: token.percentageOfTotal,
              logo: token.logo,
              symbol: token.symbol,
            }));
            setTokenBalances(balances);
          }
        }
      } catch (error) {
        console.error("Error fetching fundAllocation data:", error);
      }
    }

    fetchFundAllocations();

  }, [tbaAccountAddresses]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        console.log("***** fetchChartdata called for", tbaAccountAddresses);
        if(tbaAccountAddresses.length > 0) {

          // const tbaAccountAddresses = await fetchTbaAccountAddresses(client, userAddress);
          const newData = await postMultipleAccountInvestmentHistory(tbaAccountAddresses);
          console.log('***** chartdata:', newData);
          setChartData(newData);
          
          // Update the data with the latest point only
          // setChartData(prevData => {
          //   const updatedData = [...prevData, ...newData]
          //     .reduce((unique, item) => {
          //       if (!unique.some(entry => entry.time === item.time)) {
          //         unique.push(item);
          //       }
          //       return unique;
          //     }, [])
          //     .sort((a, b) => a.time - b.time); // Sort to ensure ascending order
          
          //   return updatedData;
          // });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchChartData();

    const interval = setInterval(fetchChartData, 60000);

    return () => clearInterval(interval);

  }, [tbaAccountAddresses]);

  const handleNftClick = (nft) => {
    if(nft.folioAccounts?.length > 0){
      setTbaAccountAddresses([nft.tbaAccountAddress, ...nft.folioAccounts]);
    } else {
      setTbaAccountAddresses([nft.tbaAccountAddress]);
    }
  }

  // Handle NFT click to fetch specific investment data
  // const handleNftClick = async (nft) => {
    // try {

    //   // const investmentData = await postMultipleAccountInvestment(nft.tbaAccountAddresses);
    //   // console.log(`Investment data for ${nft.tbaAccountAddresses}:`, investmentData);

    //   // if (investmentData && Array.isArray(investmentData.tokens)) {
    //   //   const balances = investmentData.tokens.map((token) => ({
    //   //     tokenAddress: token.tokenAddress,
    //   //     balance: token.balance,
    //   //     usdValue: token.usdValue,
    //   //     percentageOfTotal: token.percentageOfTotal,
    //   //     logo: token.logo,
    //   //     symbol: token.symbol,
    //   //   }));
    //   //   setTokenBalances(balances);
    //   // }

    //   // setInvestmentData(investmentData);
    // } catch (error) {
    //   console.error("Error fetching specific investment data:", error);
    // }
  // };

  // console.log('******************************************', firstNftData);
  console.log('****************************************', allNftData)

  return (
    <div className="main-container">
      <h4 className="text-black mb-4 d-block d-lg-none" style={{marginLeft:'63px', fontSize:'smaller'}}>
        Welcome Back, {formatAddress(userAddress)}
      </h4>

      <div className="row">
        <div className="col-xl-9 col-lg-8">
          <InvestedAmountSection investmentData={investmentData} />

          <div className="row">
          {isNftLoading ? (
            <NftLoadingfetch />
          ) : (
            <>
              {/* Display first NFTs */}
              {firstNftData.map((nft, index) => (
                <div
                  className="col-sm-4 mb-4"
                  key={index}
                  onClick={() => handleNftClick(nft)}
                >
                  <div className="card cardcustom">
                    <div className="card-body p-0">
                      <div className="img-wrapper">
                        {nft.image?.originalUrl ? (
                          <img
                            src={nft.image?.originalUrl}
                            alt={`Token ID ${nft.tokenId}`}
                          />
                        ) : (
                          <p>Image not available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          
              {/* Display all other NFTs */}
              {allNftData.map((nft, index) => (
                <div
                  className="col-sm-4 mb-4"
                  key={index}
                  onClick={() => handleNftClick(nft)}
                >
                  <div className="card cardcustom">
                    <div className="card-body p-0">
                      <div className="img-wrapper">
                        {nft.image?.originalUrl ? (
                          <img
                            src={nft.image?.originalUrl}
                            alt={`Token ID ${nft.tokenId}`}
                          />
                        ) : (
                          <p>Image not available</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
          
          
            <div className="col-md-12 mb-4">
              <div className="chartmain">
                <PerformanceChart chartData={chartData} />
              </div>
            </div>
          </div>
        </div>

        <FundlocationSection tokenBalances={tokenBalances} />
      </div>
    </div>
  );
}
