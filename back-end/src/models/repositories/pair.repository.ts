import { Model } from "mongoose";
import { Pair, PairDocument, PairStatus } from "src/models/schemas/pair.schema";

export class PairRepository {
  constructor(private readonly model: Model<PairDocument>) {}

  public async save(pair: Pair): Promise<Pair> {
    const newPair = new this.model(pair);
    return this.model.create(newPair);
  }

  public async listPair(page: number, limit: number): Promise<Pair[]> {
    return this.model
      .find({ status: PairStatus.Active })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  public async countPair(): Promise<number> {
    return this.model.count({ status: PairStatus.Active });
  }

  public async getPairByBaseQuoteToken(
    baseToken: string,
    quoteToken: string
  ): Promise<Pair> {
    return this.model.findOne({
      baseTokenAddress: baseToken,
      quoteTokenAddress: quoteToken,
    });
  }

  public async getPairById(pairId: string): Promise<Pair> {
    return this.model.findOne({
      _id: pairId,
    });
  }

  /**
   * @description Just you for seeding and testing in local version
   */
  public async deleteAll(): Promise<void> {
    await this.model.deleteMany({});
  }
}
