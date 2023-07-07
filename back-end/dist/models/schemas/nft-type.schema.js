"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftTypeSchema = exports.NftType = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = require("@nestjs/mongoose");
const create_update_schema_1 = require("./create-update.schema");
let NftType = class NftType extends create_update_schema_1.CreateUpdateSchema {
};
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], NftType.prototype, "nftType", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], NftType.prototype, "name", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], NftType.prototype, "symbol", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], NftType.prototype, "evmAddress", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], NftType.prototype, "accountId", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], NftType.prototype, "tier", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", Number)
], NftType.prototype, "defaultBalance", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", Boolean)
], NftType.prototype, "isRegister", void 0);
NftType = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ collection: "nft_type" })
], NftType);
exports.NftType = NftType;
exports.NftTypeSchema = mongoose_1.SchemaFactory.createForClass(NftType);
//# sourceMappingURL=nft-type.schema.js.map