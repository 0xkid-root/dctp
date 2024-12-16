import { usePrivy, useWallets } from "@privy-io/react-auth";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "../src/style.css";
import ProtectedRoute from "./auth/ProtectedRoute";
import Header from "./components/Header";
import LoadingComponent from "./components/LoadingPage/LoadingComponent";
import LoansSection from "./components/Pages/LoansSection";
import MarketSection from "./components/Pages/marketPage/MarketSection";
import MarketSubChild from "./components/Pages/marketPage/MarketSubChild";
import ProfileSection from "./components/Pages/ProfileSection";
import StackingSection from "./components/Pages/StackingSection";
import WalletSection from "./components/Pages/WalletSection";
import ParticlesComponent from "./components/particles/Particles";
import NavbarSection from "./components/PrivyLogin/NarbarSection";
import Sidemenu from "./components/Sidemenu";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import Workarea from "./components/workArea/Workarea";
import SmartAccountModal from "./ModelComponent/SmartAccountModal";
import SettingSection from "./components/Pages/SettingSection"

import { useSetActiveWallet } from "@privy-io/wagmi";
import { useAccount, usePublicClient, useSwitchChain, useWalletClient } from 'wagmi';
import { wagmiConfig } from "./configs/wagmiConfig";
import { IsSocialAccountPresent } from './web3/IsSocalAccountPresent';
import { CheckWhitelistStatus } from "./web3/WhitelistStatus";

function App() {
  const { ready, authenticated, user, connectWallet } = usePrivy();
  const { ready: walletsReady, wallets } = useWallets();
  const {setActiveWallet} = useSetActiveWallet();
  const {address: userAddress, isConnected, chainId} = useAccount({config: wagmiConfig});
  const navigate = useNavigate();
  const location = useLocation();
  const [isWhitelisted, setIsWhitelisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isModalShown, setIsModalShown] = useState(false);
  const [tbAccount, setTBAccount] = useState('');
  const client = usePublicClient(); // Get the public client
  const {switchChainAsync, isSuccess} = useSwitchChain({config: wagmiConfig});
  const {data: walletClient} = useWalletClient({config: wagmiConfig});

  const handleAsyncCheckWhiteList = async (userAddress) => {
    try {
      console.log('client:', client, 'userAddress:',userAddress);
      const result = await CheckWhitelistStatus(client, userAddress); // Pass client to the function
      console.log("Whitelist check result:", result);
      return result;
    } catch (error) {
      console.log("Error checking whitelist status:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkAuthenticationAndWhitelist = async () => {

      if (ready) {
        if (authenticated && walletsReady) {
            const activeWallet = wallets.find(
              (wallet) => wallet.address === user?.wallet?.address
            );
            
            console.log('user:', user);
            console.log('wallets:', wallets);
            console.log('activeWallet:', activeWallet);
            
            if (activeWallet) {
              setActiveWallet(activeWallet);
            } else {
              connectWallet();
            } 
          

          if(isConnected && userAddress && client && walletClient) { // Ensure client is ready

            const targetChainId = parseInt(process.env.REACT_APP_CHAIN_ID);
            console.log('targetChainId:', targetChainId);

            if(chainId !== targetChainId) {
              try {
                await switchChainAsync({chainId: targetChainId});
              } catch(error) {
                console.log(`Error during chain switching`, error);
                throw error;
              }
            }

            const whitelistStatus = await handleAsyncCheckWhiteList(userAddress);
            setIsWhitelisted(whitelistStatus);

            if (whitelistStatus) {
              if (location.pathname === "/" || location.pathname === "/welcome") {
                setLoading(false);
                navigate("/user", { replace: true });
              }

              const accountObj = await IsSocialAccountPresent(client, userAddress)
              console.log("Token Bound Account: ", accountObj);
              const isCheckModel= accountObj[1];
              setTBAccount(accountObj[0]);

              if (location.pathname === "/user" && !isCheckModel) {
                setTimeout(() => {
                  setShowModal(true);
                  
                }, 500);
              }

            } else {
              setLoading(false);
              navigate("/welcome", { replace: true });
            }
          }
        } else {
          setIsWhitelisted(false);
          if (location.pathname === "/welcome" && location.pathname !== "/") {
            setLoading(false);
            navigate("/", { replace: true });
          }
        }
        setLoading(false);
      }
    };

    checkAuthenticationAndWhitelist();
  }, [ready, walletsReady, authenticated, user, navigate, location.pathname, isModalShown, isConnected, client, walletClient, isSuccess]);

  const showParticles = location.pathname !== "/";

  if (loading || !ready) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <ParticlesComponent />
        <LoadingComponent />
      </div>
    );
  }

  return (
    <React.Fragment>
      {showParticles && <ParticlesComponent />}
      <Routes>
        {(isConnected && isWhitelisted) ? (
          <>
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <Header />
                  <Sidemenu />
                  <Workarea client={client}/>
                </ProtectedRoute>
              }
            />
            <Route
              path="/market"
              element={
                <ProtectedRoute>
                  <Header />
                  <Sidemenu />
                  <MarketSection client={client} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marketchild"
              element={
                <ProtectedRoute>
                  <Header />
                  <Sidemenu />
                  <MarketSubChild client={client} userAddress={userAddress} tbAccount={tbAccount} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wallet"
              element={
                <ProtectedRoute>
                  <Header />
                  <Sidemenu />
                  <WalletSection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stacking"
              element={
                <ProtectedRoute>
                  <Header />
                  <Sidemenu />
                  <StackingSection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/loans"
              element={
                <ProtectedRoute>
                  <Header />
                  <Sidemenu />
                  <LoansSection />
                </ProtectedRoute>
              }
            />

            <Route
            path="/setting"
            element={
              <ProtectedRoute>
                <Header />
                <Sidemenu />
                <SettingSection />
              </ProtectedRoute>
            }
          />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Header />
                  <Sidemenu />
                  <ProfileSection />
                </ProtectedRoute>
              }
            />
            <Route path="/welcome" element={<Navigate to="/user" replace />} />
            <Route path="*" element={<Navigate to="/user" replace />} />
          </>
        ) : (
          <>
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/" element={<NavbarSection />} />
            <Route path="*" element={<Navigate to="/welcome" replace />} />
          </>
        )}
      </Routes>

      <SmartAccountModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Smart Account"
        content="Your account type is not supported."
        client={client}
      />
    </React.Fragment>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}