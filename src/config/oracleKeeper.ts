import { sample, random } from "lodash";
import { ARBITRUM, ARBITRUM_GOERLI, AVALANCHE, AVALANCHE_FUJI } from "./chains";

const ORACLE_KEEPER_URLS = {
  [ARBITRUM]: ["https://arbitrum-api.gmxinfra.io"],
};

export function getOracleKeeperUrl(chainId: number, index: number) {
  const urls = ORACLE_KEEPER_URLS[chainId];

  if (!urls.length) {
    throw new Error(`No oracle keeper urls for chain ${chainId}`);
  }

  return urls[index] || urls[0];
}

export function getOracleKeeperNextIndex(chainId: number, currentIndex: number) {
  const urls = ORACLE_KEEPER_URLS[chainId];

  if (!urls.length) {
    throw new Error(`No oracle keeper urls for chain ${chainId}`);
  }

  return urls[currentIndex + 1] ? currentIndex + 1 : 0;
}

export function getOracleKeeperRandomIndex(chainId: number, bannedIndexes?: number[]): number {
  return 0;
  // const urls = ORACLE_KEEPER_URLS[chainId];

  // console.log(urls);

  // if (bannedIndexes?.length) {
  //   const filteredUrls = urls.filter((url, i) => !bannedIndexes.includes(i));

  //   if (filteredUrls.length) {
  //     const url = sample(filteredUrls);
  //     return urls.indexOf(url);
  //   }
  // }

  // return random(0, urls.length - 1);
}
