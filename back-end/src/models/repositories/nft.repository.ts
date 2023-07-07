import { Model } from "mongoose";
import { Nft, NftDocument } from "src/models/schemas/nft.schema";

export class NftRepository {
  constructor(private readonly model: Model<NftDocument>) {}

  public async save(nft: Nft): Promise<Nft> {
    const newNft = new this.model(nft);
    return this.model.create(newNft);
  }

  public async listNft(page: number, limit: number): Promise<Nft[]> {
    return this.model
      .find()
      .sort({ createdAt: "desc" })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  public async totalNft(): Promise<number> {
    return this.model.count();
  }

  public async getListNft(
    userId: string,
    nftTypes: string[],
    page: number,
    limit: number
  ): Promise<{ nfts: Nft[]; total: number }> {
    const conditions = { ownerId: userId };
    if (nftTypes && nftTypes.length > 0)
      conditions["nftType"] = { $in: nftTypes };
    const nfts = await this.model
      .find(conditions)
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await this.model.count(conditions);
    return { nfts, total };
  }

  public async getNftById(id: string): Promise<Nft> {
    return this.model.findOne({ _id: id });
  }

  public async getNftByIds(ids: string[]): Promise<Nft[]> {
    return this.model.find({ _id: { $in: ids } });
  }
}
