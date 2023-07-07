"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletAssociateTokenSchema = exports.WalletAssociateToken = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = require("@nestjs/mongoose");
const create_update_schema_1 = require("./create-update.schema");
let WalletAssociateToken = class WalletAssociateToken extends create_update_schema_1.CreateUpdateSchema {
};
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], WalletAssociateToken.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], WalletAssociateToken.prototype, "tokenId", void 0);
WalletAssociateToken = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ collection: "wallet_associate_nft" })
], WalletAssociateToken);
exports.WalletAssociateToken = WalletAssociateToken;
exports.WalletAssociateTokenSchema = mongoose_1.SchemaFactory.createForClass(WalletAssociateToken);
//# sourceMappingURL=wallet_associate_token.schema.js.map