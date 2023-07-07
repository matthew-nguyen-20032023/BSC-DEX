require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
    },
    BSCTestnet: {
      url: process.env.RPC_URL,
      chainId: Number(process.env.CHAIN_ID),
      gasPrice: Number(process.env.GAS_PRICE),
      accounts: [process.env.ACCOUNT_PRIVATE_KEY_1]
    },
    EthereumLocal: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      gasPrice: 20000000000,
      accounts: ["0x274aa78ffefcea2a84f444bcff6d360cbdd0610ffe29f444364b49e9d79bf125"]
    }
  },
  etherscan: {
    apiKey: {
      bscTestnet: "687XG2BJBIDQ9PR8PHVFM7VXDAV8YWA7NC"
    }
  },
  solidity: {
    compilers: [
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
      { version: "0.4.11" },
      { version: "0.5.9" }
    ],
    overrides: {
      "contracts/WETH9.sol": {
        version: "0.5.9",
      },
      "contracts/ZRXToken.sol": {
        version: "0.4.11",
      }
    }
  },
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
