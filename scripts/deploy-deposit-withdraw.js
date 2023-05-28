const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  const depositWithdraw = await ethers.getContractFactory("DepositWithdraw");
  const DepositWithdraw = await depositWithdraw.deploy();
  console.log("DepositWithdraw address:", DepositWithdraw.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
