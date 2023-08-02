#!/bin/sh

# Note (!IMPORTANT)
# You must install docker and docker-compose
# (Docker version 20.10.21, build 20.10.21-0ubuntu1~22.04.3) & (docker-compose version 1.29.2, build unknown)
# You must install nvm version 0.39.3 (you can follow this doc https://tecadmin.net/how-to-install-nvm-on-ubuntu-20-04/)
# You must install ganache of truffle and run a blockchain node
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
resultDeployed=$(npx hardhat run ./scripts/deploy.js --network EthereumLocal)

# Extract ZeroEx address
ZeroExOutput=$(echo "$resultDeployed" | grep "ZeroEx")
ZeroExAddress=$(echo "$ZeroExOutput" | awk '{print $1}')

# Extract BatchMatchOrder address
BatchFillNativeOrdersOutput=$(echo "$resultDeployed" | grep "BatchFillNativeOrdersFeature")
BatchFillNativeOrdersAddress=$(echo "$BatchFillNativeOrdersOutput" | awk '{print $1}')

# Extract base token for test
BitcoinOutput=$(echo "$resultDeployed" | grep "Bitcoin")
BitcoinAddress=$(echo "$BitcoinOutput" | awk '{print $1}')

# Extract quote token for test
DollarOutput=$(echo "$resultDeployed" | grep "Dollar")
DollarAddress=$(echo "$DollarOutput" | awk '{print $1}')

#=================================================BACKEND==============================================================#

# Jump into backend and set the compatible node version and install lib if needed
cd ../back-end
# Create and update env file for backend
cp .env.example .env
env_file_backend=".env"
sed -i "s/^ORDER_SMART_CONTRACT_ADDRESS=.*/ORDER_SMART_CONTRACT_ADDRESS=$ZeroExAddress/" "$env_file_backend"
sed -i "s/^BASE_TOKEN_FOR_TEST=.*/BASE_TOKEN_FOR_TEST=$BitcoinAddress/" "$env_file_backend"
sed -i "s/^QUOTE_TOKEN_FOR_TEST=.*/QUOTE_TOKEN_FOR_TEST=$DollarAddress/" "$env_file_backend"
sed -i "s/^VERIFY_SMART_CONTRACT_ADDRESS=.*/VERIFY_SMART_CONTRACT_ADDRESS=$ZeroExAddress/" "$env_file_backend"
sed -i "s/^BATCH_MATCH_ORDER_ADDRESS=.*/BATCH_MATCH_ORDER_ADDRESS=$BatchFillNativeOrdersAddress/" "$env_file_backend"

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
pm2 start "yarn console:dev migrate-batch-order" --name="BSC_DEX_BACKEND:migrate-batch-match-order-feature"
pm2 start 'yarn console:dev calculate-ticker24h "BTC / USD"' --name="BSC_DEX_BACKEND:calculate-ticker24h"
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
sed -i "s/^VUE_APP_ZERO_CONTRACT_ADDRESS=.*/VUE_APP_ZERO_CONTRACT_ADDRESS=$ZeroExAddress/" "$env_file_frontend"
sed -i "s/^VUE_APP_ORDER_ADDRESS=.*/VUE_APP_ORDER_ADDRESS=$ZeroExAddress/" "$env_file_frontend"

pm2 start "npm run serve" --name="BSC_DEX_FRONTEND"

#===========================================IMPORTANT INFORMATION======================================================#

# Those important information gonna print to screen
echo "============================================IMPORTANT INFORMATION================================================"
echo "ZeroEx smart contract: $ZeroExAddress"
echo "Base token for testing: $BitcoinAddress"
echo "Quote token for testing: $DollarAddress"
echo "Using pm2 ls to see all processes"
echo "Admin account: email: admin@gmail.com | password: admin@123"
echo "Blockchain node: http://127.0.0.1:7545"
echo "Backend server: http://localhost:3000/api/docs"
echo "Socket server: http://localhost:3001"
echo "Frontend server: http://localhost:8080"
