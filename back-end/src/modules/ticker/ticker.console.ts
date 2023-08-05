import { Command, Console } from "nestjs-console";
import { InjectModel } from "@nestjs/mongoose";
import { sleep } from "src/helper/common";
import { SocketEmitter } from "src/socket/socket-emitter";
import { Model } from "mongoose";
import { Inject } from "@nestjs/common";
const BigNumber = require("bignumber.js");
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

import { Trade, TradeDocument } from "src/models/schemas/trade.schema";
import { TradeRepository } from "src/models/repositories/trade.repository";
import { PairRepository } from "src/models/repositories/pair.repository";
import { Pair, PairDocument } from "src/models/schemas/pair.schema";
import { Ticker24H } from "src/modules/ticker/ticker.interface";
import { TickerRedisKey } from "src/modules/ticker/ticker.const";

@Console()
export class TickerConsole {
  private readonly tradeRepository: TradeRepository;
  private readonly pairRepository: PairRepository;

  constructor(
    @InjectModel(Trade.name)
    private readonly tradeModel: Model<TradeDocument>,
    @InjectModel(Pair.name)
    private readonly pairModel: Model<PairDocument>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {
    this.tradeRepository = new TradeRepository(this.tradeModel);
    this.pairRepository = new PairRepository(this.pairModel);
  }

  /**
   * @description Job to calculate ticker 24h depend on active pair name
   * @param pairName refer to column name of pairs collection
   */
  @Command({
    command: "calculate-ticker24h <pairName>",
  })
  async calculateTicker24h(pairName: string): Promise<void> {
    const pair = await this.pairRepository.getActivePairByName(pairName);

    if (!pair) {
      throw Error(`No pair name found for: ${pairName}`);
    }

    let toTimestamp = Date.now();
    let fromTimestamp = Date.now() - 86400000;
    let trades24h: Trade[] = [];
    let ticker24h: Ticker24H = {
      price: "0",
      change: "0",
      low: "0",
      high: "0",
      volume: "0",
    };

    while (1) {
      console.log(
        `${TickerConsole.name}: calculate ticker from ${fromTimestamp}-${toTimestamp}`
      );
      const currentTrades = await this.tradeRepository.getTradesFromToByPair(
        pair._id.toString(),
        fromTimestamp,
        toTimestamp
      );

      // If not find any trade within 24h, return default ticker and set range time to next
      if (currentTrades.length === 0) {
        SocketEmitter.getInstance().emitTicker24h(
          ticker24h,
          pair._id.toString()
        );
        await sleep(1000);
        fromTimestamp = toTimestamp;
        toTimestamp = Date.now();
        continue;
      }

      // Remove old trades that have the timestamp < fromTimestamp
      let startSliceTrade = 0;
      let endSliceTrade = 0;
      let currentIndex = -1;
      let isUpdated = false;
      let fromTimestamp24h = toTimestamp - 86400000;
      for (const trade of trades24h) {
        currentIndex++;
        if (trade.timestamp < fromTimestamp24h && !isUpdated) {
          startSliceTrade = currentIndex;
          isUpdated = true;
          continue;
        }
        if (trade.timestamp < fromTimestamp24h) {
          endSliceTrade = currentIndex;
        } else {
          break;
        }
      }
      trades24h.splice(startSliceTrade, endSliceTrade);
      for (const trade of currentTrades) {
        trades24h.push(trade);
      }

      // Data now is up-to-date and ready to calculate ticker 24h
      const currentPrice = currentTrades[currentTrades.length - 1].price;
      const price24hAgo = trades24h[0].price;
      ticker24h.change = new BigNumber(currentPrice)
        .minus(price24hAgo)
        .div(price24hAgo)
        .times(100)
        .toFixed(2);
      ticker24h.low = trades24h[0].price;
      ticker24h.high = trades24h[0].price;
      ticker24h.price = currentPrice;
      ticker24h.volume = "0";

      // calculate 24h low, high and volume
      for (const trade of trades24h) {
        if (new BigNumber(trade.price).gt(ticker24h.high))
          ticker24h.high = new BigNumber(trade.price).toFixed();
        if (new BigNumber(trade.price).lt(ticker24h.low))
          ticker24h.low = new BigNumber(trade.price).toFixed();
        ticker24h.volume = new BigNumber(ticker24h.volume)
          .plus(trade.volume)
          .toFixed();
      }

      ticker24h.price = new BigNumber(ticker24h.change).gt("0")
        ? ticker24h.price
        : `-${ticker24h.price}`;

      ticker24h.change = new BigNumber(ticker24h.change).gt("0")
        ? `+${ticker24h.change}`
        : `${ticker24h.change}`;

      await this.cacheManager.set(
        `${TickerRedisKey.Ticker24h}_${pair._id.toString()}`,
        JSON.stringify(ticker24h)
      );

      SocketEmitter.getInstance().emitTicker24h(ticker24h, pair._id.toString());
      await sleep(1000);
      fromTimestamp = toTimestamp;
      toTimestamp = Date.now();
    }
  }
}
