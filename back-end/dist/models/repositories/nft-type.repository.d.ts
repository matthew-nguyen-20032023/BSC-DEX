import { Model } from "mongoose";
import { NftType, NftTypeDocument } from "src/models/schemas/nft-type.schema";
export declare class NftTypeRepository {
    private readonly model;
    constructor(model: Model<NftTypeDocument>);
    save(nftType: NftType): Promise<NftType>;
    getListNftType(page: number, limit: number): Promise<NftType[]>;
    getNftTypeByType(nftType: string): Promise<NftType>;
    countTotalNftType(): Promise<number>;
    getNftTypeById(id: string): Promise<NftType>;
}
