require("@nomicfoundation/hardhat-toolbox");
require("hardhat-contract-sizer");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    testnet: {
      url: "https://data-seed-prebsc-1-s3.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [
        "b36f243dd7815e2e9df477153c134b194ae075f6754fa52a28d50e5824687e47",
        "ed83f489defe382d61ab2104201d936de926d8e8094a3361fc0064b343b544ea",
        "f616d5c57c6c29748492cee33ed81cc3fe447e6033ac40e19ceabcdd96d8a66a"
      ],
    },
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1,
      },
      viaIR: true,
    },
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
};
