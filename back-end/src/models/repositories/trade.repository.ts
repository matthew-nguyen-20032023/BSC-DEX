import { Model } from "mongoose";
import { Trade, TradeDocument } from "src/models/schemas/trade.schema";

export class TradeRepository {
  constructor(private readonly model: Model<TradeDocument>) {}

  public async save(trade: Trade): Promise<Trade> {
    const newTrade = new this.model(trade);
    return this.model.create(newTrade);
  }

  public async getTradesFromToByPair(
    pairId: string,
    fromTimestamp: number,
    toTimestamp: number
  ): Promise<Trade[]> {
    return this.model.find({
      pairId,
      timestamp: { $gte: fromTimestamp, $lte: toTimestamp },
    });
  }

  public async getLatestTradeHappenedByPair(
    pairId: string,
    limit: number
  ): Promise<Trade[]> {
    return this.model
      .find({
        pairId,
      })
      .sort({ timestamp: "desc" })
      .limit(limit);
  }
}
