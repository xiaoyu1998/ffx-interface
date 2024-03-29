import Davatar from "@davatar/react";
import { Menu } from "@headlessui/react";
import { t, Trans } from "@lingui/macro";
import ExternalLink from "components/ExternalLink/ExternalLink";
import { ETH_MAINNET } from "config/chains";
import { useSubaccountModalOpen } from "context/SubaccountContext/SubaccountContext";
import copy from "img/ic_copy_20.svg";
import externalLink from "img/ic_new_link_20.svg";
import disconnect from "img/ic_sign_out_20.svg";
import oneClickTradingIcon from "img/one_click_trading_20.svg";
import { helperToast } from "lib/helperToast";
import { useENS } from "lib/legacy";
import { useJsonRpcProvider } from "lib/rpc";
import { shortenAddressOrEns } from "lib/wallets";
import { useCallback } from "react";
import { FaChevronDown } from "react-icons/fa";
import { createBreakpoint, useCopyToClipboard } from "react-use";
import "./AddressDropdown.scss";

type Props = {
  account: string;
  accountUrl: string;
  disconnectAccountAndCloseSettings: () => void;
};

function AddressDropdown({ account, accountUrl, disconnectAccountAndCloseSettings }: Props) {
  const useBreakpoint = createBreakpoint({ L: 600, M: 550, S: 400 });
  const breakpoint = useBreakpoint();
  const [, copyToClipboard] = useCopyToClipboard();
  // const { ensName } = useENS(account);
  const { provider: ethereumProvider } = useJsonRpcProvider(ETH_MAINNET);
  const displayAddressLength = breakpoint === "S" ? 9 : 13;
  const [, setOneClickModalOpen] = useSubaccountModalOpen();
  const handleSubaccountClick = useCallback(() => {
    setOneClickModalOpen(true);
  }, [setOneClickModalOpen]);

  return (
    <Menu>
      <Menu.Button as="div">
        <button className="App-cta small transparent address-btn">
          <div className="user-avatar">
            {ethereumProvider && <Davatar size={20} address={account} provider={ethereumProvider} />}
          </div>
          <span className="user-address">{shortenAddressOrEns(account, displayAddressLength)}</span>
          <FaChevronDown />
        </button>
      </Menu.Button>
      <div>
        <Menu.Items as="div" className="menu-items">
          <Menu.Item>
            <div
              className="menu-item"
              onClick={() => {
                copyToClipboard(account);
                helperToast.success(t`Address copied to your clipboard`);
              }}
            >
              <img width={20} src={copy} alt="Copy user address" />
              <p>
                <Trans>Copy Address</Trans>
              </p>
            </div>
          </Menu.Item>
          <Menu.Item>
            <ExternalLink href={accountUrl} className="menu-item">
              <img width={20} src={externalLink} alt="Open address in explorer" />
              <p>
                <Trans>View in Explorer</Trans>
              </p>
            </ExternalLink>
          </Menu.Item>
          <Menu.Item>
            <div className="menu-item" onClick={handleSubaccountClick}>
              <img width={20} src={oneClickTradingIcon} alt="Open One-click Trading settings" />
              <p>
                <Trans>One-Click Trading</Trans>
              </p>
            </div>
          </Menu.Item>
          <Menu.Item>
            <div className="menu-item" onClick={disconnectAccountAndCloseSettings}>
              <img width={20} src={disconnect} alt="Disconnect the wallet" />
              <p>
                <Trans>Disconnect</Trans>
              </p>
            </div>
          </Menu.Item>
        </Menu.Items>
      </div>
    </Menu>
  );
}

export default AddressDropdown;
