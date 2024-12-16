import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import ParticlesComponent from '../components/particles/Particles';

const ProtectedRoute = ({ children }) => {
  const { ready, authenticated } = usePrivy();

  if (!ready) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}
      >
        <ParticlesComponent />
      </div>
    );
  }

  return authenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
