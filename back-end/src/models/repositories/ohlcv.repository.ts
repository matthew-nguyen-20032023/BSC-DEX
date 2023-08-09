import { Model } from "mongoose";
import {
  OHLCV,
  OHLCVDocument,
  OHLCVType,
} from "src/models/schemas/ohlcv.schema";

export class OHLCVRepository {
  constructor(private readonly model: Model<OHLCVDocument>) {}

  public async save(ohlcv: OHLCV): Promise<OHLCV> {
    const newOHLCV = new this.model(ohlcv);
    return this.model.create(newOHLCV);
  }

  public async getLatestOHLCVByType(
    pairId: string,
    ohlcvType: OHLCVType
  ): Promise<OHLCV> {
    return this.model
      .findOne({
        pairId,
        ohlcvType,
      })
      .sort({ timestamp: "desc" });
  }

  public async getOHLCVFromToByPair(
    pairId: string,
    fromTimestamp: number,
    toTimestamp: number
  ): Promise<OHLCV[]> {
    return this.model.find({
      pairId,
      timestamp: { $gte: fromTimestamp, $lte: toTimestamp },
    });
  }

  /**
   * @description Just you for seeding and testing in local version
   */
  public async deleteAll(): Promise<void> {
    await this.model.deleteMany({});
  }
}
