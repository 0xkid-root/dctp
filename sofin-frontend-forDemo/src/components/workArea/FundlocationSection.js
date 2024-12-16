import React from "react";
import ChatCommunity from "./ChatCommunity";
import { formatDecimalPercentage, formatDecimalBalance } from "../../utils/AddressFormat";

const FundlocationSection = ({ tokenBalances }) => {
  return (
    <div className="col-xl-3 col-lg-4">
      <div className="fundallocation mb-4">
        <h4 className="fund_title">Fund Allocation</h4>

        {tokenBalances.map((balance, index) => (
          <div className="findlist" key={index}>
            <div className="fundimg">
              <div className="imge1">
                <img
                  src={balance.logo}
                  alt={`${balance.symbol} logo`}
                />
              </div>
              <div className="name">
                {balance.symbol}
              </div>
              <div className="amount ms-auto">
                {formatDecimalBalance(balance.balance)}
              </div>
            </div>

            <div className="progressbar">
              <div
                className="progress"
                role="progressbar"
                aria-label="Fund allocation progress"
                aria-valuenow={balance.percentageOfTotal}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  className="progress-bar"
                  style={{ width: `${balance.percentageOfTotal}%` }}
                ></div>
              </div>
              <span>{formatDecimalPercentage(balance.percentageOfTotal)}%</span>
            </div>
          </div>
        ))}

        <button className="btn viewall w-100">View All</button>
      </div>

      <ChatCommunity />
    </div>
  );
};

export default FundlocationSection;
