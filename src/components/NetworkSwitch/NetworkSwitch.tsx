import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useMetaMask } from "~/hooks/useMetaMask";
import { formatChainAsNum } from "~/utils";

export default function NetworkSwitch() {
  const { wallet } = useMetaMask();
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  useEffect(() => {
    setSelectedNetwork(formatChainAsNum(wallet.chainId));
  }, [wallet]);

  const switchToNetwork = async (networkId: number) => {
    if (window.ethereum) {
      try {
        // Request approval to switch the network
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${networkId.toString(16)}` }],
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("MetaMask extension not detected");
    }
  };

  const handleNetworkChange = (event: { target: { value: string } }) => {
    const selectedNetworkId = parseInt(event.target.value, 10);
    setSelectedNetwork(selectedNetworkId);
    switchToNetwork(selectedNetworkId);
  };

  return (
    <div>
      <select value={selectedNetwork} onChange={handleNetworkChange}>
        <option value={2710}>Morph</option>
        <option value={202402021700}>Avail Sepolia</option>
        <option value={421614}>Arbitrum Sepolia</option>
        <option value={10200}>Gnosis Chiado</option>
      </select>
    </div>
  );
}
