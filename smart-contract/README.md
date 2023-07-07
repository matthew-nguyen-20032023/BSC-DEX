# Smart contract for DEX

## Required
Node version v18.13.0 <br />
Npm version 9.6.4 <br />

## Installation && Deploy
```bash
npm install
npx hardhat compile
cp ..env.example .env # And then replace the value in .env file
# For deploy ganache local
npx hardhat run ./scripts/deploy.js --network EthereumLocal
# For deploy bsc testnet
npx hardhat run ./scripts/deploy.js --network BSCTestnet
# For verify smart contract
npx hardhat verify --network BSCTestnet ContractAddress constructorParam1 constructorParam2
```
