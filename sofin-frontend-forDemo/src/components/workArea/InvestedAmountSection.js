import React, { useEffect, useState } from "react";
import Value from "../../assets/images/Value.png";
import ROI from "../../assets/images/roi.png";
import Invested from "../../assets/images/Invested.png";

import { formatDecimalPercentage } from "../../utils/AddressFormat";

const InvestedAmountSection = ({investmentData}) => {

  return (
    <>
      <div className="top-data mb-4">
        <div className="state-value">
          <div className="icon">
            <img src={Value} alt="Value Icon" />
          </div>
          <div className="valume">
            <p>Total Value</p>
            <h1>{formatDecimalPercentage(investmentData?.currentUsdInvestment || 0, 2)}</h1>
          </div>
        </div>

        <div className="state-value">
          <div className="icon">
            <img src={Invested} alt="Invested Icon" />
          </div>
          <div className="valume">
            <p>Total Invested</p>
            <h1>{formatDecimalPercentage(investmentData?.initialUsdInvestment || 0, 2)}</h1>
          </div>
        </div>

        <div className="state-value">
          <div className="icon">
            <img src={ROI} alt="ROI Icon" />
          </div>
          <div className="valume">
            <p>ROI</p>
            <h1>{formatDecimalPercentage(investmentData?.roi || 0, 2)}</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestedAmountSection;
