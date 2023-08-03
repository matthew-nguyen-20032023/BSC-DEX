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

  public async getLastTradesByWallet(
    wallet: string,
    pairId: string,
    page: number,
    limit: number
  ): Promise<Trade[]> {
    return this.model
      .find({
        $or: [
          { maker: wallet, pairId: pairId },
          { taker: wallet, pairId: pairId },
        ],
      })
      .sort({ createdAt: "desc" })
      .skip((page - 1) * limit)
      .limit(limit);
  }
  public async countGetLastTradesByWallet(
    wallet: string,
    pairId: string
  ): Promise<number> {
    return this.model.count({
      $or: [
        { maker: wallet, pairId: pairId },
        { taker: wallet, pairId: pairId },
      ],
    });
  }

  /**
   * @description Just you for seeding and testing in local version
   */
  public async deleteAll(): Promise<void> {
    await this.model.deleteMany({});
  }
}
