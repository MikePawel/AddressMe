import { useMetaMask } from "~/hooks/useMetaMask";
import { formatAddress } from "~/utils";
import styles from "./Navigation.module.css";
import NetworkSwitch from "../NetworkSwitch/NetworkSwitch";

export const Navigation = () => {
  const { wallet, hasProvider, isConnecting, connectMetaMask } = useMetaMask();

  return (
    <div className={styles.navigation}>
      <div className={styles.flexContainer}>
        <div className={styles.leftNav}>AddressMe</div>
        <div className={styles.rightNav}>
          {!hasProvider && (
            <a href="https://metamask.io" target="_blank">
              Install MetaMask
            </a>
          )}
          {window.ethereum?.isMetaMask && wallet.accounts.length < 1 && (
            <button disabled={isConnecting} onClick={connectMetaMask}>
              Connect MetaMask
            </button>
          )}
          <div style={{ display: "flex" }}>
            <NetworkSwitch />
            <div style={{ paddingLeft: "10px" }}></div>
            {hasProvider && wallet.accounts.length > 0 && (
              <a
                className="text_link tooltip-bottom"
                href={`https://etherscan.io/address/${wallet.accounts[0]}`} // Error corrected
                target="_blank"
                data-tooltip="Open in Block Explorer"
              >
                {formatAddress(wallet.accounts[0])}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
