export const ENV = {
  wallets: [
    process.env.NEXT_PUBLIC_METAMASK_WALLET_ID,
    process.env.NEXT_PUBLIC_TRUST_WALLET_ID,
    process.env.NEXT_PUBLIC_TOKEN_POCKET_WALLET,
    process.env.NEXT_PUBLIC_SAFE_PAL_WALLET,
  ],
  tokenAddress:
    process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS,
  mainAddress: process.env.NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS,
  kgcAddress: process.env.NEXT_PUBLIC_KGC_CONTRACT_ADDRESS,
  adminTokenAddress: process.env.NEXT_PUBLIC_ADMIN_ADDRESS,
  dashboardKGCAddress: process.env.NEXT_PUBLIC_DASHBOARD_KGC_ADDRESS,
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL,
  chainId: +process.env.NEXT_PUBLIC_CHAIN_ID,
  kycClientId: process.env.NEXT_PUBLIC_KYC_CLIENT_ID,
  frontendBaseUrl: process.env.NEXT_PUBLIC_FRONTEND_BASE_URL,
  bscScanUrl: process.env.NEXT_PUBLIC_BSCSCAN_URL,
  etherScanUrl: process.env.NEXT_PUBLIC_ETHER_SCAN_URL,
  panCakeSwapUrl: process.env.NEXT_PUBLIC_PAN_CAKE_SWAP,
  whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_NO
};
