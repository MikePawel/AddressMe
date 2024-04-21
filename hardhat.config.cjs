require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

INFURA_API_KEY_ARBITRUM = process.env.VITE_INFURA_API_KEY_ARBITRUM;
INFURA_API_KEY_MUMBAI = process.env.VITE_INFURA_API_KEY_MUMBAI;

PRIVATE_KEY = process.env.VITE_PRIVATE_KEY;

ETHERSCAN_API_KEY_ARBITRUM = process.env.ETHERSCAN_API_KEY_ARBITRUM;
ETHERSCAN_API_KEY_MUMBAI = process.env.ETHERSCAN_API_KEY_MUMBAI;

module.exports = {
  solidity: "0.8.6",
  networks: {
    mumbai: {
      url: `${INFURA_API_KEY_MUMBAI}`,
      accounts: [PRIVATE_KEY],
    },
    arbitrum: {
      url: `${INFURA_API_KEY_ARBITRUM}`,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY_MUMBAI,
  },
};
