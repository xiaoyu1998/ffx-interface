import { Trans, t } from "@lingui/macro";
import { useCallback, useMemo, useState } from "react";

import Checkbox from "components/Checkbox/Checkbox";
import Footer from "components/Footer/Footer";
import Modal from "components/Modal/Modal";
import Tooltip from "components/Tooltip/Tooltip";

import GlpManager from "abis/GlpManager.json";
import ReaderV2 from "abis/ReaderV2.json";
import RewardReader from "abis/RewardReader.json";
import RewardRouter from "abis/RewardRouter.json";
import Token from "abis/Token.json";
import Vault from "abis/Vault.json";
import Vester from "abis/Vester.json";

import { ARBITRUM, getConstant } from "config/chains";
import { useGmxPrice, useTotalGmxStaked, useTotalGmxSupply } from "domain/legacy";
import { useRecommendStakeGmxAmount } from "domain/stake/useRecommendStakeGmxAmount";
import { useAccumulatedBnGMXAmount } from "domain/rewards/useAccumulatedBnGMXAmount";
import { useMaxBoostBasicPoints } from "domain/rewards/useMaxBoostBasisPoints";
import { ethers } from "ethers";
import {
  GLP_DECIMALS,
  PLACEHOLDER_ACCOUNT,
  USD_DECIMALS,
  getBalanceAndSupplyData,
  getDepositBalanceData,
  getPageTitle,
  getProcessedData,
  getStakingData,
  getVestingData,
} from "lib/legacy";
import { BASIS_POINTS_DIVISOR } from "config/factors";

import useSWR from "swr";

import { getContract } from "config/contracts";

import Button from "components/Button/Button";
import BuyInputSection from "components/BuyInputSection/BuyInputSection";
import SEO from "components/Common/SEO";
import ExternalLink from "components/ExternalLink/ExternalLink";
import GMXAprTooltip from "components/Stake/GMXAprTooltip";
import ChainsStatsTooltipRow from "components/StatsTooltip/ChainsStatsTooltipRow";
import StatsTooltipRow from "components/StatsTooltip/StatsTooltipRow";
import { GmList } from "components/Synthetics/GmList/GmList";
import TooltipWithPortal from "components/Tooltip/TooltipWithPortal";
import { AlertInfo } from "components/AlertInfo/AlertInfo";
import { getIcons } from "config/icons";
import { getServerUrl } from "config/backend";
import { getIsSyntheticsSupported } from "config/features";
import { getTotalGmInfo, useMarketTokensData, useMarketsInfoRequest } from "domain/synthetics/markets";
import { useMarketTokensAPR } from "domain/synthetics/markets/useMarketTokensAPR";
import { approveTokens } from "domain/tokens";
import { useChainId } from "lib/chains";
import { callContract, contractFetcher } from "lib/contracts";
import { helperToast } from "lib/helperToast";
import { useLocalStorageSerializeKey } from "lib/localStorage";
import {
  bigNumberify,
  expandDecimals,
  formatAmount,
  formatAmountFree,
  formatKeyAmount,
  limitDecimals,
  parseValue,
} from "lib/numbers";
import "./StakeV2.css";
import useWallet from "lib/wallets/useWallet";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import PageTitle from "components/PageTitle/PageTitle";
import useIsMetamaskMobile from "lib/wallets/useIsMetamaskMobile";
import { MAX_METAMASK_MOBILE_DECIMALS } from "config/ui";
import UserIncentiveDistributionList from "components/Synthetics/UserIncentiveDistributionList/UserIncentiveDistributionList";
import useIncentiveStats from "domain/synthetics/common/useIncentiveStats";

const { AddressZero } = ethers.constants;



export default function StakeV2({ setPendingTxns }) {
  const { active, signer, account } = useWallet();
  const { chainId } = useChainId();
  const { openConnectModal } = useConnectModal();

  const { marketsInfoData, tokensData } = useMarketsInfoRequest(chainId);
  const { marketTokensData } = useMarketTokensData(chainId, { isDeposit: false });
  const { marketsTokensAPRData, marketsTokensIncentiveAprData } = useMarketTokensAPR(chainId, {
    marketsInfoData,
    marketTokensData,
  });


  return (
    <div className="default-container page-layout">

      <PageTitle
        isTop
        title={t`Earn`}
        subtitle={
          <div>
            <Trans>
              Stake <ExternalLink href="https://docs.gmx.io/docs/tokenomics/gmx-token">FFX</ExternalLink> to earn rewards.
            </Trans>
          </div>
        }
      />

      {getIsSyntheticsSupported(chainId) && (
        <div className="StakeV2-section">
          <GmList
            marketsTokensAPRData={marketsTokensAPRData}
            marketsTokensIncentiveAprData={marketsTokensIncentiveAprData}
            marketTokensData={marketTokensData}
            marketsInfoData={marketsInfoData}
            tokensData={tokensData}
            shouldScrollToTop
          />
        </div>
      )}

      
      <Footer />
    </div>
  );
}
