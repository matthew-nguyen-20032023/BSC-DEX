require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
    },
    BSC: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: ["a76b86ec80171b9f242d9dde72347cab8d9f9b69be688e901b81d3e1a92a2577"]
    }
  },
  etherscan: {
    apiKey: {
      bscTestnet: "687XG2BJBIDQ9PR8PHVFM7VXDAV8YWA7NC"
    }
  },
  solidity: "0.6.12",
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }
};
