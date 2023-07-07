"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const wallet_schema_1 = require("../../models/schemas/wallet.schema");
const hedera_1 = require("../../blockchains/hedera");
const nft_controller_1 = require("./nft.controller");
const nft_service_1 = require("./nft.service");
const nft_type_schema_1 = require("../../models/schemas/nft-type.schema");
const nft_schema_1 = require("../../models/schemas/nft.schema");
const wallet_associate_token_schema_1 = require("../../models/schemas/wallet_associate_token.schema");
const user_schema_1 = require("../../models/schemas/user.schema");
const transaction_schema_1 = require("../../models/schemas/transaction.schema");
let NftModule = class NftModule {
};
NftModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: wallet_schema_1.Wallet.name, schema: wallet_schema_1.WalletSchema },
                { name: nft_type_schema_1.NftType.name, schema: nft_type_schema_1.NftTypeSchema },
                { name: nft_schema_1.Nft.name, schema: nft_schema_1.NftSchema },
                { name: wallet_associate_token_schema_1.WalletAssociateToken.name, schema: wallet_associate_token_schema_1.WalletAssociateTokenSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: transaction_schema_1.Transaction.name, schema: transaction_schema_1.TransactionSchema },
            ]),
        ],
        controllers: [nft_controller_1.NftController],
        providers: [nft_service_1.NftService, hedera_1.Hedera],
    })
], NftModule);
exports.NftModule = NftModule;
//# sourceMappingURL=nft.module.js.map