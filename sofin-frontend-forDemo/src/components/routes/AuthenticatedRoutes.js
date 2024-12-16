import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidemenu from "../Sidemenu";
import Header from "../Header";
import Workarea from "../Workarea";
import MarketSection from "../Pages/MarketSection";
import WalletSection from "../Pages/WalletSection";
import StackingSection from "../Pages/StackingSection";
import LoansSection from "../Pages/LoansSection";
import ProfileSection from "..//Pages/ProfileSection";
import WelcomePage from "../WelcomePage/WelcomePage";
import NavbarSection from "../PrivyLogin/NarbarSection";
import ProtectedRoute from "../../auth/ProtectedRoute";

const AuthenticatedRoutes = () => (
  <>
    <Route
      path="/user"
      element={
        <ProtectedRoute>
          <Header />
          <Sidemenu />
          <Workarea />
        </ProtectedRoute>
      }
    />
    <Route
      path="/market"
      element={
        <ProtectedRoute>
          <Header />
          <Sidemenu />
          <MarketSection />
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
);

const UnauthenticatedRoutes = () => (
  <>
    <Route path="/welcome" element={<WelcomePage />} />
    <Route path="/" element={<NavbarSection />} />
    <Route path="*" element={<Navigate to="/welcome" replace />} />
  </>
);

export { AuthenticatedRoutes, UnauthenticatedRoutes };
