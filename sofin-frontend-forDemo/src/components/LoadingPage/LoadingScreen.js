import React from "react";
import ParticlesComponent from "../particles/Particles";
import LoadingComponent from '../LoadingPage/LoadingComponent';

const LoadingScreen = () => (
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

export default LoadingScreen;
