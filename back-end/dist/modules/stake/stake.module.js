"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakeModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const wallet_schema_1 = require("../../models/schemas/wallet.schema");
const hedera_1 = require("../../blockchains/hedera");
const nft_schema_1 = require("../../models/schemas/nft.schema");
const stake_controller_1 = require("./stake.controller");
const stake_service_1 = require("./stake.service");
const stake_rule_schema_1 = require("../../models/schemas/stake-rule.schema");
const transaction_schema_1 = require("../../models/schemas/transaction.schema");
const user_stake_information_schema_1 = require("../../models/schemas/user-stake-information.schema");
const stake_console_1 = require("./stake.console");
let StakeModule = class StakeModule {
};
StakeModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: wallet_schema_1.Wallet.name, schema: wallet_schema_1.WalletSchema },
                { name: nft_schema_1.Nft.name, schema: nft_schema_1.NftSchema },
                { name: stake_rule_schema_1.StakeRule.name, schema: stake_rule_schema_1.StakeRuleSchema },
                { name: transaction_schema_1.Transaction.name, schema: transaction_schema_1.TransactionSchema },
                { name: user_stake_information_schema_1.UserStakeInformation.name, schema: user_stake_information_schema_1.UserStakeInformationSchema },
            ]),
        ],
        controllers: [stake_controller_1.StakeController],
        providers: [stake_service_1.StakeService, hedera_1.Hedera, stake_console_1.StakeConsole],
    })
], StakeModule);
exports.StakeModule = StakeModule;
//# sourceMappingURL=stake.module.js.map