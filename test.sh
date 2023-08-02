#!/bin/sh

[ -s "$HOME/.nvm/nvm.sh" ] && \. "$HOME/.nvm/nvm.sh"  # This loads nvm
[ -s "$HOME/.nvm/bash_completion" ] && \. "$HOME/.nvm/bash_completion"
nvm use 18.13.0 # backend run node 18.13.0
cd back-end
#pm2 delete all
pm2 start "yarn console:dev auto-bot-trading 5 6 20 11000" --name="TEST: Trading bot 1"
#pm2 start "yarn console:dev auto-bot-trading 7 8 15 5000" --name="Trading bot 2"
pm2 start "yarn console:dev auto-bot-trading 9 10 10 3000" --name="TEST: Trading bot 3"
pm2 start 'yarn console:dev calculate-ticker24h "BTC / USD"' --name="BSC_DEX_BACKEND:calculate-ticker24h"
