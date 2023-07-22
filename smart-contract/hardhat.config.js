// require("@tenderly/hardhat-tenderly");
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {},
    BSCTestnet: {
      url: process.env.RPC_URL,
      chainId: Number(process.env.CHAIN_ID),
      gasPrice: Number(process.env.GAS_PRICE),
      accounts: [process.env.ACCOUNT_PRIVATE_KEY_1],
    },
    EthereumLocal: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      gasPrice: 20000000000,
      accounts: [
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
      ],
    },
  },
  etherscan: {
    apiKey: {
      bscTestnet: process.env.BSC_API_KEY,
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      { version: "0.4.11" },
      { version: "0.5.9" },
      { version: "0.8.9" },
    ],
    overrides: {
      "contracts/WETH9.sol": {
        version: "0.5.9",
      },
      "contracts/ZRXToken.sol": {
        version: "0.4.11",
      },
      "contracts/ERC20Token.sol": {
        version: "0.8.9",
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 40000,
  },
};
