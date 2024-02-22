import { BigNumber, ethers } from "ethers";
import { sample } from "lodash";
import { NetworkMetadata } from "lib/wallets";
import { isDevelopment } from "./env";

const { parseEther } = ethers.utils;

export const ENV_ARBITRUM_RPC_URLS = process.env.REACT_APP_ARBITRUM_RPC_URLS;
export const ENV_AVALANCHE_RPC_URLS = process.env.REACT_APP_AVALANCHE_RPC_URLS;

export const BSС_MAINNET = 56;
export const BSС_TESTNET = 97;
export const ETH_MAINNET = 1;
export const ARBITRUM = 42161;
export const ARBITRUM_GOERLI = 421613;
export const AVALANCHE = 43114;
export const AVALANCHE_FUJI = 43113;
export const DEFAULT_ALLOWED_SLIPPAGE_BPS = 30;
export const FEES_HIGH_BPS = 50;
export const BLAST_LOCALNET = 100;

// TODO take it from web3
export const DEFAULT_CHAIN_ID = BLAST_LOCALNET;
export const CHAIN_ID = DEFAULT_CHAIN_ID;

export const SUPPORTED_CHAIN_IDS = [ARBITRUM, BLAST_LOCALNET];

// if (isDevelopment()) {
//   SUPPORTED_CHAIN_IDS.push(BLAST_LOCALNET);
// }

export const IS_NETWORK_DISABLED = {
  [ARBITRUM]: false,
  // [AVALANCHE]: false,
  // [BSС_MAINNET]: false,
  [BLAST_LOCALNET]: false,
};

export const CHAIN_NAMES_MAP = {
  [ARBITRUM]: "Arbitrum",
  [BLAST_LOCALNET]: "Blast localnet",
};

export const GAS_PRICE_ADJUSTMENT_MAP = {
  [ARBITRUM]: "0",
  [BLAST_LOCALNET]: "0",
};

export const MAX_GAS_PRICE_MAP = {
  [BLAST_LOCALNET]: "200000000000", // 200 gwei
};

export const HIGH_EXECUTION_FEES_MAP = {
  [ARBITRUM]: 3, // 3 USD
  [BLAST_LOCALNET]: 3, // 3 USD
};

export const EXECUTION_FEE_MULTIPLIER_MAP = {
  // if gas prices on Arbitrum are high, the main transaction costs would come from the L2 gas usage
  // for executing positions this is around 65,000 gas
  // if gas prices on Ethereum are high, than the gas usage might be higher, this calculation doesn't deal with that
  // case yet
  [ARBITRUM]: 65000,

  [BLAST_LOCALNET]: 65000,
};

export const NETWORK_EXECUTION_TO_CREATE_FEE_FACTOR = {
  [ARBITRUM]: BigNumber.from(10).pow(29).mul(5),
  [BLAST_LOCALNET]: BigNumber.from(10).pow(29).mul(5),
} as const;

export const EXECUTION_FEE_CONFIG_V2: {
  [chainId: number]: {
    shouldUseMaxPriorityFeePerGas: boolean;
    defaultBufferBps?: number;
  };
} = {
  [ARBITRUM]: {
    shouldUseMaxPriorityFeePerGas: false,
    defaultBufferBps: 1000, // 10%
  },
  [BLAST_LOCALNET]: {
    shouldUseMaxPriorityFeePerGas: false,
    defaultBufferBps: 1000, // 10%
  },
};

const constants = {

  [ARBITRUM]: {
    nativeTokenSymbol: "ETH",
    wrappedTokenSymbol: "WETH",
    defaultCollateralSymbol: "USDC.e",
    defaultFlagOrdersEnabled: false,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.0003"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0003"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.000300001"),
  },
  [BLAST_LOCALNET]: {
    nativeTokenSymbol: "BLAST",
    wrappedTokenSymbol: "WETH",
    defaultCollateralSymbol: "USDC",
    defaultFlagOrdersEnabled: false,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther("0.0003"),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.0003"),
    // contract requires that execution fee be strictly greater than instead of gte
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther("0.000300001"),
  },

};

const ALCHEMY_WHITELISTED_DOMAINS = ["gmx.io", "app.gmx.io"];

export const RPC_PROVIDERS = {
  [ARBITRUM]: ["https://arb1.arbitrum.io/rpc"],
  [BLAST_LOCALNET]: ["http://192.168.2.106:8545"],
};

export const FALLBACK_PROVIDERS = {
  [ARBITRUM]: ENV_ARBITRUM_RPC_URLS ? JSON.parse(ENV_ARBITRUM_RPC_URLS) : [getAlchemyHttpUrl()],
  [BLAST_LOCALNET]: ["http://192.168.2.106:8545"],
};

export const NETWORK_METADATA: { [chainId: number]: NetworkMetadata } = {
  [ARBITRUM]: {
    chainId: "0x" + ARBITRUM.toString(16),
    chainName: "Arbitrum",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: RPC_PROVIDERS[ARBITRUM],
    blockExplorerUrls: [getExplorerUrl(ARBITRUM)],
  },
  [BLAST_LOCALNET]: {
    chainId: "0x" + BLAST_LOCALNET.toString(16),
    chainName: "blast",
    nativeCurrency: {
      name: "BLAST",
      symbol: "BLAST",
      decimals: 18,
    },
    rpcUrls: RPC_PROVIDERS[BLAST_LOCALNET],
    blockExplorerUrls: [getExplorerUrl(BLAST_LOCALNET)],
  },
};

export const getConstant = (chainId: number, key: string) => {
  if (!constants[chainId]) {
    throw new Error(`Unsupported chainId ${chainId}`);
  }

  if (!(key in constants[chainId])) {
    throw new Error(`Key ${key} does not exist for chainId ${chainId}`);
  }

  return constants[chainId][key];
};

export function getChainName(chainId: number) {
  return CHAIN_NAMES_MAP[chainId];
}

export function getRpcUrl(chainId: number): string | undefined {
  return sample(RPC_PROVIDERS[chainId]);
}

export function getFallbackRpcUrl(chainId: number): string | undefined {
  return sample(FALLBACK_PROVIDERS[chainId]);
}

export function getAlchemyHttpUrl() {
  if (ALCHEMY_WHITELISTED_DOMAINS.includes(window.location.host)) {
    return "https://arb-mainnet.g.alchemy.com/v2/RcaXYTizJs51m-w9SnRyDrxSZhE5H9Mf";
  }
  return "https://arb-mainnet.g.alchemy.com/v2/hxBqIr-vfpJ105JPYLei_ibbJLe66k46";
}

export function getAlchemyWsUrl() {
  if (ALCHEMY_WHITELISTED_DOMAINS.includes(window.location.host)) {
    return "wss://arb-mainnet.g.alchemy.com/v2/RcaXYTizJs51m-w9SnRyDrxSZhE5H9Mf";
  }
  return "wss://arb-mainnet.g.alchemy.com/v2/hxBqIr-vfpJ105JPYLei_ibbJLe66k46";
}

export function getExplorerUrl(chainId) {
  if (chainId === 3) {
    return "https://ropsten.etherscan.io/";
  } else if (chainId === 42) {
    return "https://kovan.etherscan.io/";
  } else if (chainId === BSС_MAINNET) {
    return "https://bscscan.com/";
  } else if (chainId === BSС_TESTNET) {
    return "https://testnet.bscscan.com/";
  } else if (chainId === ARBITRUM_GOERLI) {
    return "https://goerli.arbiscan.io/";
  } else if (chainId === ARBITRUM) {
    return "https://arbiscan.io/";
  } else if (chainId === AVALANCHE) {
    return "https://snowtrace.io/";
  } else if (chainId === AVALANCHE_FUJI) {
    return "https://testnet.snowtrace.io/";
  } else if (chainId === BLAST_LOCALNET) {
    return "https://testnet.snowtrace.io/";
  }
  return "https://etherscan.io/";
}

export function getHighExecutionFee(chainId) {
  return HIGH_EXECUTION_FEES_MAP[chainId] || 3;
}

export function getExecutionFeeMultiplier(chainId) {
  return EXECUTION_FEE_MULTIPLIER_MAP[chainId] || 1;
}

export function isSupportedChain(chainId) {
  return SUPPORTED_CHAIN_IDS.includes(chainId);
}
