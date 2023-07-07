import { Model } from "mongoose";
import { Nft, NftDocument } from "src/models/schemas/nft.schema";
export declare class NftRepository {
    private readonly model;
    constructor(model: Model<NftDocument>);
    save(nft: Nft): Promise<Nft>;
    listNft(page: number, limit: number): Promise<Nft[]>;
    totalNft(): Promise<number>;
    getListNft(userId: string, nftTypes: string[], page: number, limit: number): Promise<{
        nfts: Nft[];
        total: number;
    }>;
    getNftById(id: string): Promise<Nft>;
    getNftByIds(ids: string[]): Promise<Nft[]>;
}
