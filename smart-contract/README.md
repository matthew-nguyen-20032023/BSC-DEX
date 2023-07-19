# Smart contract for DEX

## Required
Node version v18.13.0 <br />
Npm version 9.6.4 <br />

## Installation && Deploy
```bash
npm install

npx hardhat compile

cp ..env.example .env # And then replace the value in .env file follow exactly note before move to next step

# If you using ganache for develop
npx hardhat run ./scripts/deploy.js --network EthereumLocal

# If you using BSC for develop
npx hardhat run ./scripts/deploy.js --network BSCTestnet

# For verify smart contract (only use for BSC network)
npx hardhat verify --network NetworkName ContractAddress ConstructorParam1 ConstructorParam2
```
## Result Installation && Deploy
![alt text](https://github.com/matthew-nguyen-20032023/[reponame]/blob/[branch]/image.jpg?raw=true)
