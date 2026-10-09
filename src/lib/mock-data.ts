export interface StrategyAllocation {
  name: string;
  percent: number;
  color: string;
}

export interface ChartPoint {
  date: string;
  apy: number;
  tvl: number;
  price?: number;
}

export interface Vault {
  id: string;
  name: string;
  asset: string;
  assetSymbol: string;
  assetIcon: string;
  protocol: string;
  protocolIcon: string;
  apy: number;
  tvl: number;
  userDeposit: number;
  userEarnings: number;
  tags: string[];
  description: string;
  allocation: StrategyAllocation[];
  chartData: ChartPoint[];
  performanceFee: string;
  cooldown: string;
  address: string;
  underlyingTvl: number;
  platformTvl: number;
  curator: string;
}

export interface SupplyMarket {
  symbol: string;
  name: string;
  icon: string;
  supplyApy: number;
  totalSupplied: number;
  walletBalance: number;
  userSupplied: number;
  collateralEnabled: boolean;
  ltv: number;
}

export interface BorrowMarket {
  symbol: string;
  name: string;
  icon: string;
  borrowApy: number;
  totalBorrowed: number;
  availableLiquidity: number;
  userBorrowed: number;
  borrowCap: number;
}

export interface TokenInfo {
  symbol: string;
  name: string;
  icon: string;
  price: number;
  decimals: number;
  balance: number;
}

// 7-day chart data generator
function generateHistoricalData(baseApy: number, baseTvl: number): ChartPoint[] {
  const points: ChartPoint[] = [];
  const days = ["Oct 3", "Oct 4", "Oct 5", "Oct 6", "Oct 7", "Oct 8", "Oct 9"];
  const apyFluctuations = [-0.2, 0.45, -0.15, -0.3, 0.25, -0.4, 0.1];
  const tvlMultipliers = [0.96, 0.97, 0.98, 0.99, 0.995, 1.0, 1.002];

  for (let i = 0; i < days.length; i++) {
    points.push({
      date: days[i],
      apy: Number((baseApy + apyFluctuations[i]).toFixed(2)),
      tvl: Math.round(baseTvl * tvlMultipliers[i]),
      price: 1.0,
    });
  }
  return points;
}

export const MOCK_VAULTS: Vault[] = [
  {
    id: "syntropia-usdc",
    name: "Syntropia USDC",
    asset: "USDC",
    assetSymbol: "USDC",
    assetIcon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    protocol: "Syntropia",
    protocolIcon: "🌐",
    apy: 16.35,
    tvl: 13121175.72,
    underlyingTvl: 11727425.19,
    platformTvl: 1392131.37,
    userDeposit: 1250.0,
    userEarnings: 42.18,
    tags: ["Market Making", "Delta Neutral", "Hyperliquid Hedged"],
    description:
      "Syntropia deploys USDC into a delta-neutral market-making strategy. Capital is used to quote trades across major assets like BTC, ETH, and SOL, while every trade is immediately hedged on Hyperliquid. Yield is generated from the spread captured between the trade and its hedge.",
    curator: "Syntropia Capital",
    performanceFee: "0.00%",
    cooldown: "Instant",
    address: "SynVault8888888888888888888888888888888888888",
    allocation: [
      { name: "Hyperliquid Delta-Neutral Hedging", percent: 65, color: "#2E5627" },
      { name: "Kamino Lend USDC Senior Tranche", percent: 25, color: "#4E7B44" },
      { name: "Nexus Instant Redemption Buffer", percent: 10, color: "#92968B" },
    ],
    chartData: generateHistoricalData(16.35, 13121175.72),
  },
  {
    id: "jup-usd",
    name: "JupUSD Optimizer",
    asset: "USDC",
    assetSymbol: "USDC",
    assetIcon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    protocol: "Jupiter",
    protocolIcon: "🪐",
    apy: 5.63,
    tvl: 49592559.81,
    underlyingTvl: 41200000.0,
    platformTvl: 8392559.81,
    userDeposit: 0.0,
    userEarnings: 0.0,
    tags: ["Perp Liquidity", "JLP Arbitrage", "Low Risk"],
    description:
      "Dynamic yield optimizer allocating into Jupiter perpetual liquidity pool (JLP) and automated collateral compounding strategies with automated risk protection.",
    curator: "Jupiter Ecosystem DAO",
    performanceFee: "0.25%",
    cooldown: "Instant",
    address: "JupVault1111111111111111111111111111111111111",
    allocation: [
      { name: "Jupiter Perpetual LP (JLP)", percent: 70, color: "#2E5627" },
      { name: "Meteora Dynamic DLMM Pools", percent: 20, color: "#4E7B44" },
      { name: "Liquidity Buffer", percent: 10, color: "#92968B" },
    ],
    chartData: generateHistoricalData(5.63, 49592559.81),
  },
  {
    id: "elemental-usdc",
    name: "Elemental USDC Optimizer",
    asset: "USDC",
    assetSymbol: "USDC",
    assetIcon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    protocol: "Kamino",
    protocolIcon: "⚡",
    apy: 8.3,
    tvl: 4663833.68,
    underlyingTvl: 3820000.0,
    platformTvl: 843833.68,
    userDeposit: 620.0,
    userEarnings: 18.42,
    tags: ["Concentrated LP", "Auto-Compounding", "Kamino CLMM"],
    description:
      "Automated concentrated liquidity management on Kamino Finance, compounding trading fees and auto-rebalancing across tight tick ranges for maximum capital efficiency.",
    curator: "Elemental Asset Management",
    performanceFee: "0.00%",
    cooldown: "Instant",
    address: "ElemVault222222222222222222222222222222222222",
    allocation: [
      { name: "Kamino Concentrated LP (SOL-USDC)", percent: 80, color: "#2E5627" },
      { name: "Save Finance Senior Lend", percent: 15, color: "#4E7B44" },
      { name: "Cash Reserve", percent: 5, color: "#92968B" },
    ],
    chartData: generateHistoricalData(8.3, 4663833.68),
  },
  {
    id: "elemental-usdg",
    name: "Elemental USDG Optimizer",
    asset: "USDG",
    assetSymbol: "USDG",
    assetIcon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    protocol: "Kamino",
    protocolIcon: "⚡",
    apy: 7.45,
    tvl: 1172515.82,
    underlyingTvl: 980000.0,
    platformTvl: 192515.82,
    userDeposit: 0.0,
    userEarnings: 0.0,
    tags: ["Paxos USDG", "Treasury Yield", "Institutional"],
    description:
      "USDG institutional yield aggregator utilizing regulated stablecoin yield tranches and collateralized borrow-lend yield loops on Solana.",
    curator: "Kamino Vaults Lab",
    performanceFee: "0.00%",
    cooldown: "2 days",
    address: "UsdgVault333333333333333333333333333333333333",
    allocation: [
      { name: "Paxos USDG Treasury Base", percent: 85, color: "#2E5627" },
      { name: "Drift Funding Rate Arbitrage", percent: 15, color: "#4E7B44" },
    ],
    chartData: generateHistoricalData(7.45, 1172515.82),
  },
  {
    id: "perena-usd",
    name: "USD* Omnistable",
    asset: "USDC",
    assetSymbol: "USDC",
    assetIcon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    protocol: "Perena",
    protocolIcon: "✳️",
    apy: 9.81,
    tvl: 11522517.04,
    underlyingTvl: 9400000.0,
    platformTvl: 2122517.04,
    userDeposit: 0.0,
    userEarnings: 0.0,
    tags: ["Omni-Stable", "FX Yield", "Automated Routing"],
    description:
      "Perena router automatically balancing liquidity between USDC, PYUSD, and USDS to capture premium base rates across multiple Solana DEX pools.",
    curator: "Perena Protocol",
    performanceFee: "0.20%",
    cooldown: "Instant",
    address: "PernVault444444444444444444444444444444444444",
    allocation: [
      { name: "Perena Stability Tranche", percent: 75, color: "#2E5627" },
      { name: "Raydium CLMM Stable Swap", percent: 25, color: "#4E7B44" },
    ],
    chartData: generateHistoricalData(9.81, 11522517.04),
  },
  {
    id: "sol-liquid-alpha",
    name: "Solana Liquid Alpha (SOL)",
    asset: "SOL",
    assetSymbol: "SOL",
    assetIcon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    protocol: "Sanctum",
    protocolIcon: "☀️",
    apy: 12.4,
    tvl: 28450120.5,
    underlyingTvl: 24100000.0,
    platformTvl: 4350120.5,
    userDeposit: 14.2,
    userEarnings: 0.88,
    tags: ["LST Maximizer", "MEV Capture", "Zero Slippage"],
    description:
      "Sanctum multi-validator yield aggregator dynamically moving stake across high-performing Solana liquid staking tokens (INF, JitoSOL, bSOL) with MEV boost.",
    curator: "Sanctum Research",
    performanceFee: "0.50%",
    cooldown: "Instant",
    address: "SolVault555555555555555555555555555555555555",
    allocation: [
      { name: "Sanctum Infinity Pool (INF)", percent: 60, color: "#2E5627" },
      { name: "Jito MEV Stake Reserve", percent: 30, color: "#4E7B44" },
      { name: "Solblaze Liquid Pool", percent: 10, color: "#92968B" },
    ],
    chartData: generateHistoricalData(12.4, 28450120.5),
  },
];

export const MOCK_TOKENS: TokenInfo[] = [
  {
    symbol: "USDC",
    name: "USD Coin",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    price: 1.0,
    decimals: 6,
    balance: 2450.5,
  },
  {
    symbol: "SOL",
    name: "Solana",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    price: 184.25,
    decimals: 9,
    balance: 8.42,
  },
  {
    symbol: "USDG",
    name: "Global Dollar",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    price: 1.0,
    decimals: 6,
    balance: 500.0,
  },
  {
    symbol: "PYUSD",
    name: "PayPal USD",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/2b1kV6ydDS3TCgTgWreWjvBqizy699DZG7b3STJYksnV/logo.png",
    price: 1.0,
    decimals: 6,
    balance: 100.0,
  },
  {
    symbol: "JUP",
    name: "Jupiter",
    icon: "https://static.jup.ag/jup/icon.png",
    price: 1.22,
    decimals: 6,
    balance: 1250.0,
  },
];

export const MOCK_SUPPLY_MARKETS: SupplyMarket[] = [
  {
    symbol: "USDC",
    name: "USD Coin",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    supplyApy: 7.42,
    totalSupplied: 24500000,
    walletBalance: 2450.5,
    userSupplied: 1200.0,
    collateralEnabled: true,
    ltv: 85,
  },
  {
    symbol: "SOL",
    name: "Solana",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    supplyApy: 6.85,
    totalSupplied: 58200000,
    walletBalance: 8.42,
    userSupplied: 4.5,
    collateralEnabled: true,
    ltv: 80,
  },
  {
    symbol: "USDG",
    name: "Global Dollar",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    supplyApy: 8.1,
    totalSupplied: 8900000,
    walletBalance: 500.0,
    userSupplied: 0.0,
    collateralEnabled: true,
    ltv: 80,
  },
  {
    symbol: "PYUSD",
    name: "PayPal USD",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/2b1kV6ydDS3TCgTgWreWjvBqizy699DZG7b3STJYksnV/logo.png",
    supplyApy: 7.95,
    totalSupplied: 12400000,
    walletBalance: 100.0,
    userSupplied: 0.0,
    collateralEnabled: true,
    ltv: 78,
  },
];

export const MOCK_BORROW_MARKETS: BorrowMarket[] = [
  {
    symbol: "USDC",
    name: "USD Coin",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    borrowApy: 9.35,
    totalBorrowed: 18200000,
    availableLiquidity: 6300000,
    userBorrowed: 450.0,
    borrowCap: 22000000,
  },
  {
    symbol: "SOL",
    name: "Solana",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    borrowApy: 8.8,
    totalBorrowed: 34100000,
    availableLiquidity: 24100000,
    userBorrowed: 0.0,
    borrowCap: 50000000,
  },
  {
    symbol: "USDG",
    name: "Global Dollar",
    icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    borrowApy: 9.9,
    totalBorrowed: 6100000,
    availableLiquidity: 2800000,
    userBorrowed: 0.0,
    borrowCap: 8000000,
  },
];
