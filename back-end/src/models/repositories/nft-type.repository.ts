import { Model } from "mongoose";
import { NftType, NftTypeDocument } from "src/models/schemas/nft-type.schema";

export class NftTypeRepository {
  constructor(private readonly model: Model<NftTypeDocument>) {}

  public async save(nftType: NftType): Promise<NftType> {
    const newNftType = new this.model(nftType);
    return this.model.create(newNftType);
  }

  public async getListNftType(page: number, limit: number): Promise<NftType[]> {
    return this.model
      .find()
      .sort({ createdAt: "desc" })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  public async getNftTypeByType(nftType: string): Promise<NftType> {
    return this.model.findOne({ nftType });
  }

  public async countTotalNftType(): Promise<number> {
    return this.model.count();
  }

  public async getNftTypeById(id: string): Promise<NftType> {
    return this.model.findOne({
      _id: id,
    });
  }
}
