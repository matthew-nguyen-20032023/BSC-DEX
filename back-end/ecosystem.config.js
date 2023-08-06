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
     * @description Crawl event order cancelled
     */
    {
      name: "BSC_DEX_JOB:crawl-order-cancelled",
      script: "node ./dist/console.js crawl-order-cancelled",
      autorestart: true,
      cron_restart: "1 0 * * *",
    },
    /**
     * @description Handle event cancelled crawled above
     */
    {
      name: "BSC_DEX_JOB:handle-order-cancelled-crawled",
      script: "node ./dist/console.js handle-order-cancelled-crawled",
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
     * @description Build order book and emit to client by pair name
     */
    {
      name: "BSC_DEX_BACKEND:build-order-book",
      script: 'node ./dist/console.js build-order-book "BTC / USD"',
      autorestart: true,
      cron_restart: "1 0 * * *",
    },
    /**
     * @description Auto bot trading to fake data
     */
    {
      name: "BSC_DEX_BACKEND:auto-bot-trading 1",
      script: "node ./dist/console.js auto-bot-trading 7 8 15 3000",
      autorestart: true,
      cron_restart: "1 0 * * *",
    },
  ],
};
