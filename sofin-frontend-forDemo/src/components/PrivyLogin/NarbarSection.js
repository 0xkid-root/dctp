import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import "./NavbarSection.css";
import WalletLoginIcon from "../../assets/images/WalletLoginIcon.svg";
import Logo from "../../assets/images/sofinYellow.png";
import HeroSection from "./HeroSection";
import LoginCardSection from "./LoginCardSection";

const NavbarSection = () => {
  const { login } = usePrivy();

  return (
    <div className="mainDiv">
      <div className="navbar-container">
        <div className="logo-wrapper">
          <img src={Logo} alt="Company Logo" className="company-logo" />
        </div>

        <div className="connect-wrapper" onClick={login}>
          <img src={WalletLoginIcon} alt="Wallet Icon" />
          <button className="connect-button">Login</button>
        </div>
      </div>

      <HeroSection />
      <LoginCardSection />
    </div>
  );
};

export default NavbarSection;
