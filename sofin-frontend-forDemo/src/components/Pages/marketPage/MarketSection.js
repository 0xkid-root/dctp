import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bitcoin from "../../../assets/images/binance.svg";
import binance from "../../../assets/images/bitcoin.svg";
import ethereum from "../../../assets/images/ethereum.png";
import jupiter from "../../../assets/images/jupiter.svg";
import marketImage2 from "../../../assets/images/marketNFT3.png";
import marketImage3 from "../../../assets/images/marketNFT4.png";
import marketImage4 from "../../../assets/images/marketNFT5.png";
import marketImage5 from "../../../assets/images/marketNFT6.png";
import matic from "../../../assets/images/matic.svg";
import marketPro from "../../../assets/images/profileSection.svg";
import sofinProfileImage from "../../../assets/images/sofinNFt.svg";
import solana from "../../../assets/images/solona.png";
import uniswap from "../../../assets/images/uniswap.svg";
import verfiedImage from "../../../assets/images/verifiedAccount.svg";
import { Folio1NFT, Folio2NFT } from "../../../contracts/contractAddress";
import { getIpfsUrl } from "../../../utils/ipfsFormater";
import { fetchNFTData } from "../../../web3/MarketNftFetch";
import MarketNftDataLoading from "../../LoadingPage/MarketNftDataLoading";
import "./MarketSection.css";
import TradersPerformance from "./TradersPerformance";

const folioData = [
  {
    name: "Themanager",
    roi: "+25%",
    clones: "10/100",
    aum: "$50K",
    image: marketImage2,
    image2: sofinProfileImage,
    coins: [bitcoin, binance, matic, ethereum],
  },
  {
    name: "Sofinal",
    roi: "+15%",
    clones: "9/100",
    aum: "$10K",
    image: marketImage3,
    image2: marketPro,
    coins: [bitcoin, solana, matic, uniswap],
  },
  {
    name: "Sofinal",
    roi: "-5%",
    clones: "5/100",
    aum: "$5K",
    image: marketImage4,
    image2: sofinProfileImage,
    coins: [jupiter, uniswap, solana, ethereum],
  },
  {
    name: "themanager",
    roi: "-5%",
    clones: "5/100",
    aum: "$5K",
    image: marketImage5,
    image2: marketPro,
    coins: [jupiter, uniswap, solana, matic],
  },

 
];

const MarketSection = ({client}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("SPOT");
  const [nftData, setNftData] = useState([]); 
  const [isNftLoading, setIsNftLoading] = useState(true);

  const tokenId = 1;

  const fetchAllNftData = async () => {
    try {
      setIsNftLoading(true)

      const response1 = await fetchNFTData(Folio1NFT, tokenId, client);
      const response2 = await fetchNFTData(Folio2NFT, tokenId, client);
      
      // Wrap single NFT response in an array if not an array
      const firstNftResponse = Array.isArray(response1) ? response1 : [response1];
      const secondNftResponse = Array.isArray(response2) ? response2 : [response2];
  
      const combinedFirstNftResponse = await Promise.all(firstNftResponse.map(async (nft) => {
        // const balanceData = await fetchERC20Balance(nft);
        const metadata = await formatNftMetadata(nft);
        return {
          ...metadata,
        };

      }));
      console.log("combinedFirstNftResponse is here:::",combinedFirstNftResponse);
  
      const combinedSecondNftResponse = await Promise.all(secondNftResponse.map(async (nft) => {
        // const balanceData = await fetchERC20Balance(nft);
        const metadata = await formatNftMetadata(nft);
        return {
          ...metadata,
          // balance: balanceData.balance,
          // symbol: balanceData.symbol,
          // decimals: balanceData.decimals,
        };
      }));
  
      setNftData([...combinedFirstNftResponse, ...combinedSecondNftResponse]);
    } catch (error) {
      console.log("Error fetching NFT data:", error);
    }
    finally {
      setIsNftLoading(false);
    }
  };
  
  
  
  // const fetchERC20Balance = async (nft) => {
  //   try {
  //     if (nft.erc20Balances && nft.erc20Balances.length > 0) {
  //       const balanceData = nft.erc20Balances.map((balance) => ({
  //         contractAddress: balance.contractAddress,
  //         balance: balance.balance,
  //         decimals: balance.decimals,
  //         symbol: balance.symbol,
  //       }));
  //       return balanceData;
  //     } else {
  //       return { balance: 'N/A', decimal: 'N/A', symbol: 'N/A' };
  //     }
  //   } catch (error) {
  //     console.log("Error fetching ERC20 balance:", error);
  //     return { balance: 'N/A', decimal: 'N/A', symbol: 'N/A' };  
  //   }
  // };
  
  const formatNftMetadata = async (nft) => {
    try {
      const metadataResponse = await fetch(nft.tokenURI);
      const metadata = await metadataResponse.json();
  
      return {
        ...nft,
        image: getIpfsUrl(metadata?.image || ""),
        description: metadata?.description || "No description available",
        // name: metadata?.name || "Unknown",
      };
    } catch (error) {
      console.log("Error fetching metadata:", error);
      return nft;  
    }
  };
  

  useEffect(() => {
    fetchAllNftData();
  }, []);

  const handleFunction = (selectedNft) => {
    navigate("/marketchild", {
      state: { selectedNft },
    });
  };  

  return (
    <div className="main-container">
    {
      isNftLoading ? (<MarketNftDataLoading />
      ) : (
        <>
        <div className="market-header">
        <div className="market-header-left">
          <h2>List of Top Performing Folios</h2>
        </div>
        <div className="market-header-right">
          <div className="market-tabs">
            <span
              className={`market-tab ${activeTab === "SPOT" ? "active" : ""}`}
              onClick={() => setActiveTab("SPOT")}
            >
              SPOT
            </span>
            <span
              className={`market-tab ${activeTab === "FUTURES" ? "active" : ""}`}
              onClick={() => setActiveTab("FUTURES")}
            >
              FUTURES
            </span>
            <span
              className={`market-tab ${activeTab === "INDEX" ? "active" : ""}`}
              onClick={() => setActiveTab("INDEX")}
            >
              INDEX
            </span>
          </div>
        </div>
        </div>

      <div className="mainMarketContent">
        <div className="folio-container">
          {/* Map over the NFT data */}
          {nftData.map((folio, index) => (
            <div  key={index} className="folio-card" onClick={() => handleFunction(folio)}>
              <div className="folio-image">
                <img src={folio.image} alt={folio.name} />
              </div>

              <div className="folio-info">
                <div className="folioManagerName">
                  <div className="folioManagerName-left">
                    <img src={sofinProfileImage} alt="Profile Image" />
                    <p>{` ${folio.name}` || ` ${index + 1}`}</p>
                    <img
                      src={verfiedImage}
                      alt="Verified Icon"
                      className="yellowTick"
                    />
                  </div>

                  <div className="folioManagerName-right">
                    <div className="folio-coins">
                      {/* Display coins if available */}
                      {folio.coins?.map((coin, i) => (
                        <img
                          key={i}
                          src={coin}
                          alt="coin icon"
                          className="coin-icon"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="folio-stats">
                  <div className="stat-item">
                    <p className="stat-label">Total ROI</p>
                    <p className="stat-value">{folio.roi || "N/A"}</p>
                  </div>
                  <div className="stat-item">
                    <p className="stat-label"># Clones</p>
                    <p className="stat-value">{folio.clones || "N/A"}</p>
                  </div>
                  <div className="stat-item">
                    <p className="stat-label">AUM</p>
                    <p className="stat-value">{folio.aum || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}


          {/* Map over the hardcoded data */}
          {folioData.map((hardcodedfolio, index) => (
            <div key={index} className="folio-card">
              <div className="folio-image">
                <img src={hardcodedfolio.image} alt={hardcodedfolio.name} />
              </div>

              <div className="folio-info">
                <div className="folioManagerName">
                  <div className="folioManagerName-left">
                    <img src={hardcodedfolio.image2} alt="Profile Image" />
                    <p>{hardcodedfolio.name}</p>
                    <img
                      src={verfiedImage}
                      alt="Verified Icon"
                      className="yellowTick"
                    />
                  </div>

                  <div className="folioManagerName-right">
                    <div className="folio-coins">
                      {hardcodedfolio.coins.map((coin, i) => (
                        <img
                          key={i}
                          src={coin}
                          alt="coin icon"
                          className="coin-icon"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="folio-stats">
                  <div className="stat-item">
                    <p className="stat-label">Total ROI</p>
                    <p className="stat-value">{hardcodedfolio.roi}</p>
                  </div>
                  <div className="stat-item">
                    <p className="stat-label"># Clones</p>
                    <p className="stat-value">{hardcodedfolio.clones}</p>
                  </div>
                  <div className="stat-item">
                    <p className="stat-label">AUM</p>
                    <p className="stat-value">{hardcodedfolio.aum}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <TradersPerformance/>
        </>
      )
    }
    </div>
  );
};

export default MarketSection;
