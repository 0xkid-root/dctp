import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {WagmiProvider} from '@privy-io/wagmi';
import { wagmiConfig } from "../configs/wagmiConfig";
import { privyConfig } from "../configs/privyConfig";

const queryClient = new QueryClient();

export default function Providers({ children }) {
  return (
    <PrivyProvider
      appId="clybtrzr60c4huawdv82093ka"
      config={privyConfig}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}

