import mapValues from "lodash/mapValues";
import { ARBITRUM, BLAST_LOCALNET } from "./chains";
import { isDevelopment } from "config/env";

export const ENABLED_MARKETS = {
  [ARBITRUM]: [
    "0x47c031236e19d024b42f8AE6780E44A573170703", // BTC/USD [BTC-USDC]
    "0x70d95587d40A2caf56bd97485aB3Eec10Bee6336", // ETH/USD [WETH-USDC]
    "0x6853EA96FF216fAb11D2d930CE3C508556A4bdc4", // DOGE/USD [WETH-USDC]
    "0x09400D9DB990D5ed3f35D7be61DfAEB900Af03C9", // SOL/USD [SOL-USDC]
    "0xD9535bB5f58A1a75032416F2dFe7880C30575a41", // LTC/USD [WETH-USDC]
    "0xc7Abb2C5f3BF3CEB389dF0Eecd6120D451170B50", // UNI/USD [UNI-USDC]
    "0x7f1fa204bb700853D36994DA19F830b6Ad18455C", // LINK/USD [LINK-USDC]
    "0xC25cEf6061Cf5dE5eb761b50E4743c1F5D7E5407", // ARB/USD [ARB-USDC]
    "0x0CCB4fAa6f1F1B30911619f1184082aB4E25813c", // XRP/USD [WETH-USDC]
    "0x2d340912Aa47e33c90Efb078e69E70EFe2B34b9B", // BNB/USD [BNB-USDC]
    "0x9C2433dFD71096C435Be9465220BB2B189375eA7", // SWAP-ONLY [USDC-USDC.e]
    "0xB686BcB112660343E6d15BDb65297e110C8311c4", // SWAP-ONLY [USDC-USDT]
    "0xe2fEDb9e6139a182B98e7C2688ccFa3e9A53c665", // SWAP-ONLY [USDC-DAI]
  ],
  [BLAST_LOCALNET]: [
    "0xB2C04ADdcA3100E5fE6d7B321EF742D65A43ccC4", // BTC/USD [BTC-USDC]
    "0xCeA4181816413adf9977D8D85D3Ee0723B3B4013", // ETH/USD [ETH-USDC]
    "0x74f7D50d5e07a091F03a31Fe16FF976A19d3e5e2", // DOGE/USD [WAVAX-USDC]
    "0x4C078397D9Dc953134110EA81987785A0066B063", // DOGE/USD [WAVAX-USDC]
  ],
};

export const ENABLED_MARKETS_INDEX = mapValues<Record<number, string[]>>(ENABLED_MARKETS, (markets) =>
  markets.reduce((acc, market) => ({ ...acc, [market]: true }), {})
);

export function isMarketEnabled(chainId: number, marketAddress: string) {
  if (isDevelopment()) return true;

  return ENABLED_MARKETS_INDEX[chainId]?.[marketAddress] ?? false;
}
