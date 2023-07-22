#!/bin/sh

# Load nvm (nvm must be installed)
[ -s "$HOME/.nvm/nvm.sh" ] && \. "$HOME/.nvm/nvm.sh"  # This loads nvm
[ -s "$HOME/.nvm/bash_completion" ] && \. "$HOME/.nvm/bash_completion"
nvm install 18.13.0 # install node 18.13.0 if not installed yet
nvm use 18.13.0 # backend run node 18.13.0
npm install -g yarn
npm install -g pm2

yarn -v
pm2 --version

# Jump into backend and set the compatible node version and install lib if needed
cd back-end
yarn # update new lib

# Require pm2 installed
pm2 delete all
pm2 start "yarn start:dev" --name="BSC_DEX_BACKEND"
pm2 start "yarn console:dev crawl-order-matched" --name="BSC_DEX_JOB:craw-order-matched"
pm2 start "yarn console:dev handle-limit-order-filled-crawled" --name="BSC_DEX_JOB:handle-limit-order-filled-crawled"
pm2 ls
