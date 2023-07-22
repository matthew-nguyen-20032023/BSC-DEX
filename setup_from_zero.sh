#!/bin/sh

# Note (!IMPORTANT)
# You must install docker and docker-compose
# (Docker version 20.10.21, build 20.10.21-0ubuntu1~22.04.3) & (docker-compose version 1.29.2, build unknown)
# You must install nvm version 0.39.3 (you can follow this doc https://tecadmin.net/how-to-install-nvm-on-ubuntu-20-04/)
# This script used for quickly setup, build and run full smart contract, backend and frontend for testing only on local
# For manual and update you own, you have to go detail through each smart-contract, back-end and front-end folder
# All dex processes will be run in background by pm2, learn about pm2 at https://pm2.keymetrics.io/docs/usage/quick-start/
# The whole processes this script gonna do is:
#      - Auto set compatible node and pm2 for whole project
#      - Auto install smart contract lib => start blockchain node local => deploy all smart contract needed
#      - Auto create env file at backend and auto assign smart contract deployed to backend env
#      - Auto install tool and lib for backend => run backend server => run backend background job
#      - Auto install tool and lib compatible with frontend => run frontend in background as well
# Now you ready to go

#=============================================COMMON SETUP===========================================================#

[ -s "$HOME/.nvm/nvm.sh" ] && \. "$HOME/.nvm/nvm.sh"  # This loads nvm
[ -s "$HOME/.nvm/bash_completion" ] && \. "$HOME/.nvm/bash_completion"
nvm install 18.13.0 # install node 18.13.0 if not installed yet
nvm use 18.13.0 # backend run node 18.13.0
npm install -g pm2
pm2 delete all
pm2 --version

#=============================================SMART CONTRACT===========================================================#

# Jump into smart contract folder, deploy to hardhat local node and get smart contract deployed
cd smart-contract
npm install
pm2 start "npx hardhat node" --name="HARDHAT_NODE"
resultDeployed=$(npx hardhat run ./scripts/deploy.js --network EthereumLocal)

# Extract addresses of exchange deployed smart contract
matchingExchangeContract=$(echo "$resultDeployed" | grep "==")
exchangeAddresses=$(echo "$matchingExchangeContract" | awk '{print $1}')
verifyContractAddress=$(echo "$exchangeAddresses" | head -n 1)
orderMatchingContractAddress=$(echo "$exchangeAddresses" | tail -n 1)

# Extract addresses of erc20 deployed smart contract for test
matchingERC20Contract=$(echo "$resultDeployed" | grep "===")
erc20Addresses=$(echo "$matchingERC20Contract" | awk '{print $1}')
baseTokenContractAddress=$(echo "$erc20Addresses" | head -n 1)
quoteTokenContractAddress=$(echo "$erc20Addresses" | tail -n 1)

#=================================================BACKEND==============================================================#

# Jump into backend and set the compatible node version and install lib if needed
cd ../back-end
# Create and update env file for backend
cp .env.example .env
env_file_backend=".env"
sed -i "s/^ORDER_SMART_CONTRACT_ADDRESS=.*/ORDER_SMART_CONTRACT_ADDRESS=$orderMatchingContractAddress/" "$env_file_backend"
sed -i "s/^BASE_TOKEN_FOR_TEST=.*/BASE_TOKEN_FOR_TEST=$baseTokenContractAddress/" "$env_file_backend"
sed -i "s/^QUOTE_TOKEN_FOR_TEST=.*/QUOTE_TOKEN_FOR_TEST=$quoteTokenContractAddress/" "$env_file_backend"

npm install -g yarn
yarn -v
yarn # update new lib

# Start mongo database and redis
docker-compose up -d
# Seeding data for test
yarn console:dev seed-data-for-test
# Start backend service
pm2 start "yarn start:dev" --name="BSC_DEX_BACKEND"
pm2 start "yarn console:dev crawl-order-matched" --name="BSC_DEX_JOB:craw-order-matched"
pm2 start "yarn console:dev handle-limit-order-filled-crawled" --name="BSC_DEX_JOB:handle-limit-order-filled-crawled"

#=================================================FRONTEND=============================================================#

# Start front end
cd ../front-end
nvm install 16.20.1
nvm use 16.20.1
npm install -g pm2
npm install

# Create and update env file
cp .env.example .env
env_file_frontend=".env"
sed -i "s/^VUE_APP_ZERO_CONTRACT_ADDRESS=.*/VUE_APP_ZERO_CONTRACT_ADDRESS=$verifyContractAddress/" "$env_file_frontend"
sed -i "s/^VUE_APP_ORDER_ADDRESS=.*/VUE_APP_ORDER_ADDRESS=$orderMatchingContractAddress/" "$env_file_frontend"

pm2 start "npm run serve" --name="BSC_DEX_FRONTEND"

#===========================================IMPORTANT INFORMATION======================================================#

# Those important information gonna print to screen
echo "============================================IMPORTANT INFORMATION================================================"
echo "Smart contract to verify order: $verifyContractAddress"
echo "Smart contract for matching order: $orderMatchingContractAddress"
echo "Base token for testing: $baseTokenContractAddress"
echo "Quote token for testing: $quoteTokenContractAddress"
echo "Using pm2 ls to see all processes"
echo "Admin account: email: admin@gmail.com | password: admin@123"
echo "Blockchain node: http://127.0.0.1:8545"
echo "Backend server: http://localhost:3000/api/docs"
echo "Socket server: http://localhost:3001"
echo "Frontend server: http://localhost:8080"
