"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftTypeRepository = void 0;
class NftTypeRepository {
    constructor(model) {
        this.model = model;
    }
    async save(nftType) {
        const newNftType = new this.model(nftType);
        return this.model.create(newNftType);
    }
    async getListNftType(page, limit) {
        return this.model
            .find()
            .sort({ createdAt: "desc" })
            .skip((page - 1) * limit)
            .limit(limit);
    }
    async getNftTypeByType(nftType) {
        return this.model.findOne({ nftType });
    }
    async countTotalNftType() {
        return this.model.count();
    }
    async getNftTypeById(id) {
        return this.model.findOne({
            _id: id,
        });
    }
}
exports.NftTypeRepository = NftTypeRepository;
//# sourceMappingURL=nft-type.repository.js.map