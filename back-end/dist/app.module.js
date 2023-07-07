"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const database_config_1 = require("./configs/database.config");
const auth_module_1 = require("./modules/authentication/auth.module");
const jwt_strategy_1 = require("./modules/authentication/jwt.strategy");
const jwt_auth_guard_1 = require("./modules/authentication/jwt-auth.guard");
const core_1 = require("@nestjs/core");
const wallet_module_1 = require("./modules/wallet/wallet.module");
const nft_module_1 = require("./modules/nft/nft.module");
const transaction_module_1 = require("./modules/transaction/transaction.module");
const stake_module_1 = require("./modules/stake/stake.module");
const nestjs_console_1 = require("nestjs-console");
let AppModule = class AppModule {
};
AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            wallet_module_1.WalletModule,
            nft_module_1.NftModule,
            transaction_module_1.TransactionModule,
            stake_module_1.StakeModule,
            nestjs_console_1.ConsoleModule,
            mongoose_1.MongooseModule.forRoot(`mongodb://${database_config_1.DATABASE_CONFIG.userName}:${database_config_1.DATABASE_CONFIG.password}@${database_config_1.DATABASE_CONFIG.host}:${database_config_1.DATABASE_CONFIG.port}/${database_config_1.DATABASE_CONFIG.databaseName}?authSource=${database_config_1.DATABASE_CONFIG.databaseName}`),
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            jwt_strategy_1.JwtStrategy,
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map