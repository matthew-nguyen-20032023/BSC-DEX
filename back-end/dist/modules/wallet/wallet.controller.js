"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const wallet_service_1 = require("./wallet.service");
const swagger_1 = require("@nestjs/swagger");
const wallet_const_1 = require("./wallet.const");
const nft_const_1 = require("../nft/nft.const");
const list_nft_dto_1 = require("./dto/list-nft.dto");
let WalletController = class WalletController {
    constructor(walletService) {
        this.walletService = walletService;
    }
    async getWallet(request) {
        const { wallet, balance } = await this.walletService.getUserWallet(request.user.id);
        return {
            message: wallet_const_1.WalletSuccessMessage.GetWalletSuccess,
            data: { wallet: wallet, balance: JSON.parse(balance) },
            statusCode: common_1.HttpStatus.OK,
        };
    }
    async exportWalletPrivateKey(request) {
        const privateKey = await this.walletService.exportWalletPrivateKey(request.user.id);
        return {
            message: wallet_const_1.WalletSuccessMessage.ExportWalletPrivateKeySuccess,
            data: privateKey,
            statusCode: common_1.HttpStatus.OK,
        };
    }
    async getMyNft(request, listNftDto) {
        const result = await this.walletService.listNft(request.user.id, listNftDto.nftTypes, listNftDto.page, listNftDto.limit);
        return {
            message: nft_const_1.NFTSuccessMessage.GetMyNFTSuccess,
            data: result.nfts,
            statusCode: common_1.HttpStatus.OK,
            metadata: {
                total: result.total,
            },
        };
    }
    async mintHBAR(request) {
        await this.walletService.mintHBAR(request.user.id);
        return {
            message: "ok",
            data: true,
            statusCode: common_1.HttpStatus.OK,
        };
    }
};
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: "Api to get wallet.",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: wallet_const_1.WalletSuccessMessage.GetWalletSuccess,
    }),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WalletController.prototype, "getWallet", null);
tslib_1.__decorate([
    (0, common_1.Get)("export-private-key"),
    (0, swagger_1.ApiOperation)({
        summary: "Export wallet private key.",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: wallet_const_1.WalletSuccessMessage.ExportWalletPrivateKeySuccess,
    }),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WalletController.prototype, "exportWalletPrivateKey", null);
tslib_1.__decorate([
    (0, common_1.Get)("my-nft"),
    (0, swagger_1.ApiOperation)({
        summary: "Api to get list NFT belong to account.",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: nft_const_1.NFTSuccessMessage.GetMyNFTSuccess,
    }),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, list_nft_dto_1.ListNftDto]),
    tslib_1.__metadata("design:returntype", Promise)
], WalletController.prototype, "getMyNft", null);
tslib_1.__decorate([
    (0, common_1.Get)("mint-HBAR"),
    (0, swagger_1.ApiOperation)({
        summary: "Api to mint HBAR.",
    }),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WalletController.prototype, "mintHBAR", null);
WalletController = tslib_1.__decorate([
    (0, common_1.Controller)("wallet"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)("Wallet"),
    tslib_1.__metadata("design:paramtypes", [wallet_service_1.WalletService])
], WalletController);
exports.WalletController = WalletController;
//# sourceMappingURL=wallet.controller.js.map