"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftSchema = exports.Nft = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = require("@nestjs/mongoose");
const create_update_schema_1 = require("./create-update.schema");
let Nft = class Nft extends create_update_schema_1.CreateUpdateSchema {
};
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Nft.prototype, "nftType", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", Number)
], Nft.prototype, "tokenId", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Nft.prototype, "ownerId", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Nft.prototype, "tier", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", Number)
], Nft.prototype, "balance", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Nft.prototype, "ipfs", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", Boolean)
], Nft.prototype, "isStake", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", Number)
], Nft.prototype, "endTime", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Nft.prototype, "description", void 0);
Nft = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ collection: "nfts" })
], Nft);
exports.Nft = Nft;
exports.NftSchema = mongoose_1.SchemaFactory.createForClass(Nft);
//# sourceMappingURL=nft.schema.js.map