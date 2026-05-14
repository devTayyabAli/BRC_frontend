// ** Web3 Imports
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { bsc, bscTestnet,sepolia } from 'wagmi/chains'; // Corrected import
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { walletConnectProvider, EIP6963Connector } from "@web3modal/wagmi";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'; // Import jsonRpcProvider
import { ENV } from "src/configs/env";
const projectId = process.env.NEXT_PUBLIC_WEB3_PROJECT_ID;
// const projectId = "88660d06e2cfb815df911764f617401a";
if (!projectId) {
  throw new Error("Error: NEXT_PUBLIC_WEB3_PROJECT_ID is not defined. Please set it in your .env file.");
}

// WalletConnect validates metadata.url against the site origin; keep it aligned with deployment.
const appOrigin = (ENV.frontendBaseUrl || "").replace(/\/$/, "") || "https://blackrockcommunity.cloud";
const metadata = {
  name: "BRC Platform",
  description: "World's Largest Crypto Earning Platform",
  url: appOrigin,
  icons: [`${appOrigin}/images/pages/Logo-signup.png`],
};

const walletConnectWalletIds = (ENV?.wallets || []).filter(Boolean);

// Define your chains based on ENV
const activeChains = [];
if (ENV.chainId === 56) {
  activeChains.push(bsc);
} else if (ENV.chainId === 97) {
  activeChains.push(bscTestnet);
} else if (ENV.chainId === 11155111) {
  activeChains.push(sepolia);
} else {
  // Fallback or error if chainId is not supported
  console.warn(`Unsupported chainId: ${ENV.chainId}. Defaulting to BSC Mainnet.`);
  activeChains.push(bsc); // Or throw an error
}

// --- RPC Configuration ---
// Option A: Using WalletConnect's RPC (ensure you have a unique projectId with enough quota)
// const rpcProviders = [walletConnectProvider({ projectId }), publicProvider()];

// Option B: Using a dedicated third-party RPC (e.g., Alchemy) - Recommended for higher traffic
 // https://bnb-mainnet.g.alchemy.com/v2/nLkxIReAcZZLSpK7jLtmd/getNFTs/?owner=vitalik.eth
const bscRpcUrl = "https://bnb-mainnet.g.alchemy.com/v2/nLkxIReAcZZLSpK7jLtmd"; // e.g., from Alchemy: https://bsc-mainnet.g.alchemy.com/v2/YOUR_KEY
const bscTestnetRpcUrl = "https://bnb-mainnet.g.alchemy.com/v2/t2m-k706O1_CKUrV_fIYVVYYdew4oZrx"; // e.g., from Alchemy
const sepoliaRpcUrl = "https://eth-sepolia.g.alchemy.com/v2/gbnhSoSy4pQ2eiWkI2KQoAxiFgAQWVf9"; // e.g., from Infura

if (ENV.chainId === 56 && !bscRpcUrl) {
  console.warn("Warning: NEXT_PUBLIC_BSC_RPC_URL is not defined for BSC Mainnet. Falling back to public provider, which might be rate-limited.");
}
if (ENV.chainId === 97 && !bscTestnetRpcUrl) {
  console.warn("Warning: NEXT_PUBLIC_BSC_TESTNET_RPC_URL is not defined for BSC Testnet. Falling back to public provider, which might be rate-limited.");
}
if (ENV.chainId === 11155111 && !sepoliaRpcUrl) {
  console.warn("Warning: NEXT_PUBLIC_SEPOLIA_RPC_URL is not defined for Sepolia. Falling back to public provider, which might be rate-limited.");
}



const rpcProviders = [
  jsonRpcProvider({
    rpc: (chain) => {
      if (chain.id === bsc.id && bscRpcUrl) {
        return { http: bscRpcUrl };
      }
      if (chain.id === bscTestnet.id && bscTestnetRpcUrl) {
        return { http: bscTestnetRpcUrl };
      }
      if (chain.id === sepolia.id && sepoliaRpcUrl) {
        return { http: sepoliaRpcUrl };
      }
      // Fallback to chain's default public RPC or WalletConnect RPC
      // You can also add walletConnectProvider({ projectId }) here as a fallback if desired
      return null; // Or chain.rpcUrls.default.http[0] if you want to use the default public RPC from chain definition
    },
  }),
  walletConnectProvider({ projectId }), // Still useful for WalletConnect specific operations or as a fallback
  publicProvider(), // General fallback
];
// --- End RPC Configuration ---


const { chains, publicClient, webSocketPublicClient } = configureChains(
  activeChains,
  rpcProviders
);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({ // projectId is crucial here for WalletConnect protocol
      chains,
      options: { projectId, showQrModal: false, metadata },
    }),
    new EIP6963Connector({ chains }),
    new InjectedConnector({ chains, options: { shimDisconnect: true } }),
  ],
  publicClient,
  webSocketPublicClient, // Add this if you need WebSocket support
});

createWeb3Modal({
  wagmiConfig,
  projectId, // This projectId is for the Web3Modal UI and WalletConnect protocol
  chains,
  // Omit when env wallet IDs are missing — an empty/undefined list breaks the modal on mobile.
  ...(walletConnectWalletIds.length > 0 ? { includeWalletIds: walletConnectWalletIds } : {}),
});

export function Web3Modal({ children }) {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}