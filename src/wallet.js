import { createClient, configureChains, mainnet } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
// import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { createPublicClient, http } from 'viem'

// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
export const { chains, provider, webSocketProvider } = configureChains(
  [mainnet],
  [alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_KEY }), publicProvider()],
);

// Set up client
export const wagmiClient = createClient({
  autoConnect: true,
  publicClient: createPublicClient({
    chain: mainnet,
    transport: http(),
  }),
  // connectors: [
  //   new MetaMaskConnector({ chains }),
  //   // new CoinbaseWalletConnector({
  //   //   chains,
  //   //   options: {
  //   //     appName: 'wagmi',
  //   //   },
  //   // }),
  //   new WalletConnectConnector({
  //     chains,
  //     options: {
  //       projectId: process.env.REACT_APP_WC_PROJECT_ID,
  //     },
  //   }),
  // ],
  provider,
  webSocketProvider,
});

