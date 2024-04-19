require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

INFURA_API_KEY_ARBITRUM = "https://arbitrum-sepolia.infura.io/v3/a146daf63d93490995823f0910f50118"
INFURA_API_KEY_MUMBAI = "https://arbitrum-sepolia.infura.io/v3/a146daf63d93490995823f0910f50118"

PRIVATE_KEY = process.env.VITE_PRIVATE_KEY;

ETHERSCAN_API_KEY_ARBITRUM = "WKR6EQCREDHJKK7RZMHPDXMC19HND6RU9G"
ETHERSCAN_API_KEY_MUMBAI = "WKR6EQCREDHJKK7RZMHPDXMC19HND6RU9G"

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