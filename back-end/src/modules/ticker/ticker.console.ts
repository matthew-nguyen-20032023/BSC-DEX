import { Command, Console } from "nestjs-console";
import { InjectModel } from "@nestjs/mongoose";
import { sleep } from "src/helper/common";
import { SocketEmitter } from "src/socket/socket-emitter";
import { Model } from "mongoose";
import { Trade, TradeDocument } from "src/models/schemas/trade.schema";
import { TradeRepository } from "src/models/repositories/trade.repository";
import { PairRepository } from "src/models/repositories/pair.repository";
import { Pair, PairDocument } from "src/models/schemas/pair.schema";
import { Ticker24H } from "src/modules/ticker/ticker.interface";
const BigNumber = require("bignumber.js");

@Console()
export class TickerConsole {
  private readonly tradeRepository: TradeRepository;
  private readonly pairRepository: PairRepository;

  constructor(
    @InjectModel(Trade.name)
    private readonly tradeModel: Model<TradeDocument>,
    @InjectModel(Pair.name)
    private readonly pairModel: Model<PairDocument>
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

    let oldTicker: Ticker24H = {
      change: "0",
      low: "0",
      high: "0",
      volume: "0",
      pairId: pair._id.toString(),
    };

    while (1) {
      console.log(`${TickerConsole.name}: Calculate ticker at ${new Date()}`);
      const ticker24h: Ticker24H = {
        change: "0",
        low: "0",
        high: "0",
        volume: "0",
        pairId: pair._id.toString(),
      };
      const toTimestamp = Math.ceil(Date.now());
      const fromTimestamp = Math.ceil(Date.now() - 86400000);
      const trades24h = await this.tradeRepository.getTradesFromToByPair(
        pair._id.toString(),
        fromTimestamp,
        toTimestamp
      );

      if (trades24h.length === 0) {
        SocketEmitter.getInstance().emitTicker24h(ticker24h);
        await sleep(60000);
        continue;
      }

      // calculate 24h change
      const currentPrice = trades24h[trades24h.length - 1].price;
      const price24hAgo = trades24h[0].price;
      ticker24h.change = new BigNumber(currentPrice)
        .minus(price24hAgo)
        .div(price24hAgo)
        .times(100)
        .toFixed();

      // calculate 24h low, high and volume
      for (const trade of trades24h) {
        // high
        if (new BigNumber(trade.price).gt(ticker24h.high)) {
          ticker24h.high = new BigNumber(trade.price).toFixed();
        }

        // low
        if (new BigNumber(trade.price).lt(ticker24h.low)) {
          ticker24h.low = new BigNumber(trade.price).toFixed();
        }

        ticker24h.volume = new BigNumber(ticker24h.volume)
          .plus(trade.volume)
          .toFixed();
      }

      ticker24h.change = new BigNumber(ticker24h.change)
        .minus(oldTicker.change)
        .gt("0")
        ? ticker24h.change
        : `-${ticker24h.change}`;
      ticker24h.high = new BigNumber(ticker24h.high)
        .minus(oldTicker.high)
        .gt("0")
        ? ticker24h.high
        : `-${ticker24h.high}`;
      ticker24h.low = new BigNumber(ticker24h.low).minus(oldTicker.low).gt("0")
        ? ticker24h.low
        : `-${ticker24h.low}`;
      ticker24h.volume = new BigNumber(ticker24h.volume)
        .minus(oldTicker.volume)
        .gt("0")
        ? ticker24h.volume
        : `-${ticker24h.volume}`;
      oldTicker = ticker24h;

      SocketEmitter.getInstance().emitTicker24h(ticker24h);
      await sleep(60000);
    }
  }
}
