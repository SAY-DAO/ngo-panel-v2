/* eslint-disable import/prefer-default-export */
import { http, createConfig } from 'wagmi';
import { mainnet, base } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, base],
  connectors: [
    // walletConnect({ projectId: process.env.REACT_APP_WC_PROJECT_ID }),
    metaMask(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
});
