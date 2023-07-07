"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletSchema = exports.Wallet = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = require("@nestjs/mongoose");
const create_update_schema_1 = require("./create-update.schema");
let Wallet = class Wallet extends create_update_schema_1.CreateUpdateSchema {
};
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Wallet.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Wallet.prototype, "evmAddress", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Wallet.prototype, "accountId", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Wallet.prototype, "privateKey", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Wallet.prototype, "publicKey", void 0);
Wallet = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ collection: "wallets" })
], Wallet);
exports.Wallet = Wallet;
exports.WalletSchema = mongoose_1.SchemaFactory.createForClass(Wallet);
//# sourceMappingURL=wallet.schema.js.map