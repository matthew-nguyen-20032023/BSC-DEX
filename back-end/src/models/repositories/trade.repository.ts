import { Model } from "mongoose";
import { Trade, TradeDocument } from "src/models/schemas/trade.schema";

export class TradeRepository {
  constructor(private readonly model: Model<TradeDocument>) {}

  public async save(trade: Trade): Promise<Trade> {
    const newTrade = new this.model(trade);
    return this.model.create(newTrade);
  }
}