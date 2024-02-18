import React from "react";
import { t } from "@lingui/macro";
import Footer from "components/Footer/Footer";
import "./Buy.css";
import TokenCard from "components/TokenCard/TokenCard";
import SEO from "components/Common/SEO";
import { getPageTitle } from "lib/legacy";
import PageTitle from "components/PageTitle/PageTitle";

export default function BuyFFX() {
  return (
    <SEO title={getPageTitle(t`Buy FFX`)}>
      <div className="BuyFFX page-layout">
        <div className="BuyFFX-container default-container">
          <PageTitle showNetworkIcon={false} isTop title={t`Buy Protocol Tokens`} />
          <TokenCard />
        </div>
        <Footer />
      </div>
    </SEO>
  );
}
