"use strict";
var WalletService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const tslib_1 = require("tslib");
const CryptoJS = require("crypto-js");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const wallet_schema_1 = require("../../models/schemas/wallet.schema");
const wallet_repository_1 = require("../../models/repositories/wallet.repository");
const hedera_1 = require("../../blockchains/hedera");
const nft_schema_1 = require("../../models/schemas/nft.schema");
const nft_repository_1 = require("../../models/repositories/nft.repository");
let WalletService = WalletService_1 = class WalletService {
    constructor(walletModel, nftModel, hederaLib) {
        this.walletModel = walletModel;
        this.nftModel = nftModel;
        this.hederaLib = hederaLib;
        this.walletRepository = new wallet_repository_1.WalletRepository(this.walletModel);
        this.nftRepository = new nft_repository_1.NftRepository(this.nftModel);
    }
    static decodeWalletPrivateKey(encryptWalletPrivateKey) {
        return CryptoJS.AES.decrypt(encryptWalletPrivateKey, process.env.HEDERA_SECRET_KEY_ENCRYPT).toString(CryptoJS.enc.Utf8);
    }
    async getUserWallet(userId) {
        let userWallet = await this.walletRepository.getWalletByUserId(userId);
        if (!userWallet) {
            const newWallet = await this.hederaLib.createNewAccount(userId);
            userWallet = await this.walletRepository.save(newWallet);
        }
        const balance = await this.hederaLib.checkAccountBalance(userWallet.accountId);
        return { wallet: userWallet, balance: balance };
    }
    async exportWalletPrivateKey(userId) {
        const { wallet } = await this.getUserWallet(userId);
        return {
            privateKey: WalletService_1.decodeWalletPrivateKey(wallet.privateKey),
        };
    }
    async listNft(userId, nftTypes, page, limit) {
        return await this.nftRepository.getListNft(userId, nftTypes, page, limit);
    }
    async mintHBAR(userId) {
        const wallet = await this.walletRepository.getWalletByUserId(userId);
        await this.hederaLib.mintHBAR(wallet.accountId);
    }
};
WalletService = WalletService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(wallet_schema_1.Wallet.name)),
    tslib_1.__param(1, (0, mongoose_1.InjectModel)(nft_schema_1.Nft.name)),
    tslib_1.__metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        hedera_1.Hedera])
], WalletService);
exports.WalletService = WalletService;
//# sourceMappingURL=wallet.service.js.map