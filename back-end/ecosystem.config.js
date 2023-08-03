module.exports = {
  apps: [
    /**
     * @description Crawl event order match
     */
    {
      name: "BSC_DEX_JOB:craw-order-matched",
      script: "node ./dist/console.js crawl-order-matched",
      autorestart: true,
      cron_restart: "1 0 * * *",
    },
    /**
     * @description Handle event crawled above
     */
    {
      name: "BSC_DEX_JOB:handle-limit-order-filled-crawled",
      script: "node ./dist/console.js handle-limit-order-filled-crawled",
      autorestart: true,
      cron_restart: "1 0 * * *",
    },
    /**
     * @description Calculate ticker by pair name
     */
    {
      name: "BSC_DEX_BACKEND:calculate-ticker24h",
      script: 'node ./dist/console.js calculate-ticker24h "BTC / USD"',
      autorestart: true,
      cron_restart: "1 0 * * *",
    },
    /**
     * @description Auto bot trading to fake data
     */
    {
      name: "BSC_DEX_BACKEND:auto-bot-trading 1",
      script: "node ./dist/console.js auto-bot-trading 7 8 15 5000",
      autorestart: true,
      cron_restart: "1 0 * * *",
    },
  ],
};
