"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftRepository = void 0;
class NftRepository {
    constructor(model) {
        this.model = model;
    }
    async save(nft) {
        const newNft = new this.model(nft);
        return this.model.create(newNft);
    }
    async listNft(page, limit) {
        return this.model
            .find()
            .sort({ createdAt: "desc" })
            .skip((page - 1) * limit)
            .limit(limit);
    }
    async totalNft() {
        return this.model.count();
    }
    async getListNft(userId, nftTypes, page, limit) {
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
    async getNftById(id) {
        return this.model.findOne({ _id: id });
    }
    async getNftByIds(ids) {
        return this.model.find({ _id: { $in: ids } });
    }
}
exports.NftRepository = NftRepository;
//# sourceMappingURL=nft.repository.js.map