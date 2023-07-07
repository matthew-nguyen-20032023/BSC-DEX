"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const wallet_service_1 = require("./wallet.service");
const wallet_controller_1 = require("./wallet.controller");
const wallet_schema_1 = require("../../models/schemas/wallet.schema");
const hedera_1 = require("../../blockchains/hedera");
const nft_schema_1 = require("../../models/schemas/nft.schema");
let WalletModule = class WalletModule {
};
WalletModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: wallet_schema_1.Wallet.name, schema: wallet_schema_1.WalletSchema },
                { name: nft_schema_1.Nft.name, schema: nft_schema_1.NftSchema },
            ]),
        ],
        controllers: [wallet_controller_1.WalletController],
        providers: [wallet_service_1.WalletService, hedera_1.Hedera],
    })
], WalletModule);
exports.WalletModule = WalletModule;
//# sourceMappingURL=wallet.module.js.map