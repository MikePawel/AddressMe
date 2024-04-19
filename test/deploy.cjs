const { ethers } = require("hardhat");

async function main() {
    // We get the contract to deploy
    const HashStore = await ethers.getContractFactory("HashStore");
    console.log("Deploying HashStore...");

    // Deploy the contract
    const hashStore = await HashStore.deploy();

    await hashStore.deployed();
    console.log("HashStore deployed to:", hashStore.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
