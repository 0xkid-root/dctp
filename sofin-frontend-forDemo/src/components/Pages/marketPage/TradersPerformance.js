import React from "react";
import "./TradersPerformance.css";
import sofinyellow from "../../../assets/images/sofinYellow.png";
import marketPro from "../../../assets/images/profileSection.svg";
import sofinProfileImage from "../../../assets/images/sofinSquareLogo.svg";
import tarderImage from "../../../assets/images/traderImage.svg";
import verfiedImage from "../../../assets/images/verifiedAccount.svg";
import telegramImg from "../../../assets/images/telegramImage.svg";
import twitterXImg from "../../../assets/images/twitterXImage.svg";
import FilterImage from "../../../assets/images/filterSet.svg";
import performingImage from "../../../assets/images/performeIma.svg";

const tradersData = [
  {
    name: "sofinai",
    imgSrc: marketPro,
    badges: [verfiedImage, twitterXImg, telegramImg],
  },
  {
    name: "themanager",
    imgSrc: sofinProfileImage,
    badges: [verfiedImage, twitterXImg, telegramImg],
  },
  {
    name: "thememeKid",
    imgSrc: tarderImage,
    badges: [verfiedImage, twitterXImg, telegramImg],
  },
  {
    name: "sofinai",
    imgSrc: marketPro,
    badges: [verfiedImage, twitterXImg, telegramImg],
  },
  {
    name: "themanager",
    imgSrc: sofinProfileImage,
    badges: [verfiedImage, twitterXImg, telegramImg],
  },
  {
    name: "thememeKid",
    imgSrc: tarderImage,
    badges: [verfiedImage, twitterXImg, telegramImg],
  },
];

const TradersPerformance = () => {
  return (
    <div style={{ width: "100%" }}>
      <div className="traders-performance-container">
        <div className="performance-header">
          <div className="performance-header-left">
            <img src={performingImage} alt="" />
            <h2>List of top performing traders</h2>
          </div>
          <div className="performance-header-right">
            <img
              src={FilterImage}
              alt="filter image"
              className="filter-image"
            />
          </div>
        </div>

        <div className="mainMarketPerformance">
          <div className="traders-grid">
            {tradersData.map((trader, index) => (
              <div className="trader-card" key={index}>
                <div className="trader-header">
                  <img
                    className="trader-logo"
                    src={sofinyellow}
                    alt="Sofin Logo"
                  />
                </div>
                <div className="trader-content">
                  <img
                    className="trader-image"
                    src={trader.imgSrc}
                    alt={trader.name}
                  />
                  <div className="trader-info">
                    <p>{trader.name}</p>
                    <div className="trader-badges">
                      {trader.badges.map((badge, badgeIndex) => (
                        <img key={badgeIndex} src={badge} alt="badge" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradersPerformance;
