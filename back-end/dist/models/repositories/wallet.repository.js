"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletRepository = void 0;
class WalletRepository {
    constructor(model) {
        this.model = model;
    }
    async save(wallet) {
        const newWallet = new this.model(wallet);
        return this.model.create(newWallet);
    }
    async getWalletByUserId(userId) {
        return this.model.findOne({
            userId,
        });
    }
}
exports.WalletRepository = WalletRepository;
//# sourceMappingURL=wallet.repository.js.map