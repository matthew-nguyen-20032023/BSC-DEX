"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletAssociateTokenRepository = void 0;
class WalletAssociateTokenRepository {
    constructor(model) {
        this.model = model;
    }
    async save(walletAssociateToken) {
        const newWalletAssociateToken = new this.model(walletAssociateToken);
        return this.model.create(newWalletAssociateToken);
    }
    async getUserAssociateToken(userId, tokenId) {
        return this.model.findOne({
            userId,
            tokenId,
        });
    }
}
exports.WalletAssociateTokenRepository = WalletAssociateTokenRepository;
//# sourceMappingURL=wallet-associate-token.repository.js.map