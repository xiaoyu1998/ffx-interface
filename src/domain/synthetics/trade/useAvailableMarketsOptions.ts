import {
  useMarketsInfoData,
  useOrdersInfoData,
  usePositionsInfoData,
} from "context/SyntheticsStateContext/hooks/globalsHooks";
import {
  MarketInfo,
  getAvailableUsdLiquidityForPosition,
  getMinPriceImpactMarket,
  getMostLiquidMarketForPosition,
  isMarketIndexToken,
} from "domain/synthetics/markets";
import { TokenData } from "domain/synthetics/tokens";
import { BigNumber } from "ethers";
import { USD_DECIMALS } from "lib/legacy";
import { expandDecimals } from "lib/numbers";
import { getByKey } from "lib/objects";
import { useMemo } from "react";
import { PositionOrderInfo, isIncreaseOrderType } from "../orders";
import { getAcceptablePriceByPriceImpact, getMarkPrice } from "./utils";

export type AvailableMarketsOptions = {
  allMarkets?: MarketInfo[];
  availableMarkets?: MarketInfo[];
  marketWithPosition?: MarketInfo;
  collateralWithPosition?: TokenData;
  marketWithOrder?: MarketInfo;
  collateralWithOrder?: TokenData;
  maxLiquidityMarket?: MarketInfo;
  minPriceImpactMarket?: MarketInfo;
  minPriceImpactBps?: BigNumber;
  isNoSufficientLiquidityInAnyMarket?: boolean;
};

export function useAvailableMarketsOptions(p: {
  isIncrease: boolean;
  disable?: boolean;
  indexToken: TokenData | undefined;
  isLong: boolean;
  increaseSizeUsd: BigNumber | undefined;
  hasExistingPosition: boolean;
  hasExistingOrder: boolean;
}): AvailableMarketsOptions {
  const { disable, hasExistingPosition, hasExistingOrder, isIncrease, indexToken, increaseSizeUsd, isLong } = p;
  const marketsInfoData = useMarketsInfoData();
  const positionsInfo = usePositionsInfoData();
  const ordersInfo = useOrdersInfoData();

  return useMemo(() => {
    if (disable || !indexToken || isLong === undefined) {
      return {};
    }

    const allMarkets = Object.values(marketsInfoData || {}).filter(
      (market) => !market.isSpotOnly && !market.isDisabled
    );

    const availableMarkets = allMarkets.filter((market) => isMarketIndexToken(market, indexToken.address));

    const liquidMarkets = increaseSizeUsd
      ? availableMarkets.filter((marketInfo) => {
          const liquidity = getAvailableUsdLiquidityForPosition(marketInfo, isLong);

          return liquidity.gt(increaseSizeUsd);
        })
      : availableMarkets;

    const result: AvailableMarketsOptions = { allMarkets, availableMarkets };

    if (isIncrease && liquidMarkets.length === 0) {
      result.isNoSufficientLiquidityInAnyMarket = true;

      return result;
    }

    result.maxLiquidityMarket = getMostLiquidMarketForPosition(liquidMarkets, indexToken.address, undefined, isLong);

    if (!hasExistingPosition) {
      const positions = Object.values(positionsInfo || {});
      const availablePosition = positions.find(
        (pos) =>
          pos.isLong === isLong && availableMarkets.some((market) => market.marketTokenAddress === pos.marketAddress)
      );

      if (availablePosition) {
        result.marketWithPosition = getByKey(marketsInfoData, availablePosition.marketAddress);
        result.collateralWithPosition = availablePosition.collateralToken;
      }
    }

    if (!result.marketWithPosition && !hasExistingOrder) {
      const orders = Object.values(ordersInfo || {});
      const availableOrder = orders.find(
        (order) =>
          isIncreaseOrderType(order.orderType) &&
          order.isLong === isLong &&
          availableMarkets.some((market) => market.marketTokenAddress === order.marketAddress)
      ) as PositionOrderInfo;

      if (availableOrder) {
        result.marketWithOrder = getByKey(marketsInfoData, availableOrder.marketAddress);
        result.collateralWithOrder = availableOrder.targetCollateralToken;
      }
    }

    if (
      increaseSizeUsd &&
      !hasExistingPosition &&
      !hasExistingOrder &&
      !result.marketWithPosition &&
      !result.marketWithOrder
    ) {
      const { bestMarket, bestImpactDeltaUsd } = getMinPriceImpactMarket(
        liquidMarkets,
        indexToken.address,
        isLong,
        isIncrease,
        increaseSizeUsd.gt(0) ? increaseSizeUsd : expandDecimals(1000, USD_DECIMALS)
      );

      if (bestMarket && bestImpactDeltaUsd) {
        const { acceptablePriceDeltaBps } = getAcceptablePriceByPriceImpact({
          isIncrease: true,
          isLong,
          indexPrice: getMarkPrice({ prices: indexToken.prices, isLong, isIncrease: true }),
          priceImpactDeltaUsd: bestImpactDeltaUsd,
          sizeDeltaUsd: increaseSizeUsd,
        });

        result.minPriceImpactMarket = bestMarket;
        result.minPriceImpactBps = acceptablePriceDeltaBps;
      }
    }

    return result;
  }, [
    disable,
    indexToken,
    isLong,
    marketsInfoData,
    increaseSizeUsd,
    isIncrease,
    hasExistingPosition,
    hasExistingOrder,
    positionsInfo,
    ordersInfo,
  ]);
}
