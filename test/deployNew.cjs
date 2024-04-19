const { ethers } = require("hardhat");

async function main() {
  // We get the contract to deploy
  const DataStorage = await ethers.getContractFactory("DataStorage");
  console.log("Deploying storeHash...");

  // Deploy the contract
  const storeHash = await DataStorage.deploy();

  await storeHash.deployed();
  console.log("storeHash deployed to:", storeHash.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
