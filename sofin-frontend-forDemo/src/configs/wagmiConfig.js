import {createConfig} from '@privy-io/wagmi';

import {http} from 'wagmi';
import {base,baseSepolia} from 'wagmi/chains';

const baseHttpObj = process.env.REACT_APP_ENV === 'development'
  ? http(process.env.REACT_APP_TRENDLY_TRANSPORT_URL)
  : http()

  export const wagmiConfig = createConfig({
    chains: [base,baseSepolia],
    transports: {
      [base.id]: baseHttpObj,
      [baseSepolia.id]: http(),
    },
  });