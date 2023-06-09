const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  const LaunchpadDeployer = await ethers.getContractFactory(
    "LaunchpadDeployer"
  );
  const launchpadDeployer = await LaunchpadDeployer.deploy();
  console.log("LaunchpadDeployer address:", launchpadDeployer.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
