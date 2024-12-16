import React from "react";
import Socal from "../../assets/images/socal.png";


const ChatCommunity = () => {
  return (
    <>
      {" "}
      <div className="fundallocation mb-4 text-center">
        <img className="img-gluid" src={Socal}></img>
        <h5 className="text-black mt-4" style={{ fontSize: "16px" }}>
          Chat with community
        </h5>
        <p className="text-black mt-2 mb-3" style={{ fontSize: "10px" }}>
          Chat with other like minded investors holding similar portfolios.
        </p>
        <button className="btn viewall w-100">View All</button>
      </div>
    </>
  );
};

export default ChatCommunity;
