import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Cache } from "cache-manager";

import { Ticker24H } from "src/modules/ticker/ticker.interface";
import { TradeRepository } from "src/models/repositories/trade.repository";
import { Trade, TradeDocument } from "src/models/schemas/trade.schema";
import { TickerRedisKey } from "./ticker.const";

@Injectable()
export class TickerService {
  private tradeRepository: TradeRepository;

  constructor(
    @InjectModel(Trade.name)
    private readonly tradeModel: Model<TradeDocument>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {
    this.tradeRepository = new TradeRepository(this.tradeModel);
  }

  public async getTicker24H(pairId: string): Promise<Ticker24H> {
    const ticker = await this.cacheManager.get(
      `${TickerRedisKey.Ticker24h}_${pairId}`
    );
    if (!ticker)
      return {
        change: "0",
        low: "0",
        high: "0",
        volume: "0",
        price: "0",
      };
    return JSON.parse(<string>ticker);
  }
}
