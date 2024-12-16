import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import TraderSection from "./TraderSection";
import ActivitySection from "./ActivitySection";
import HolderSection from "./HolderSection";
import PerformanceChart from "../../charts/PerformanceChart";
import { getAccountInvestmentHistory } from "../../../web2/api";

const OverviewSection = ({tbaAccountAddress}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const newData = await getAccountInvestmentHistory(tbaAccountAddress);

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
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 1:
        return <TraderSection />;
      case 2:
        return <ActivitySection />;
      case 3:
        return <HolderSection />;
      default:
        return (
          <Box mt={3} sx={{ width: "100%", height: "400px", position: "relative" }}>
            <PerformanceChart chartData={chartData} />
          </Box>
        );
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "8px",
        p: 3,
        boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="overview tabs"
          sx={{
            "& .MuiTab-root": {
              color: "black",
              fontFamily: "Roboto",
              fontWeight: "semibold",
            },
            "& .Mui-selected": {
              color: "black !important",
              fontWeight: "bold",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "black",
            },
          }}
        >
          <Tab label="Overview" />
          <Tab label="Trades" />
          <Tab label="Activity" />
          <Tab label="Holders" />
        </Tabs>
      </Box>
      <hr
        style={{
          color: "#595757",
          height: "1px",
          border: "1px solid #595757",
        }}
      />

      {renderContent()}
    </Box>
  );
};

export default OverviewSection;
