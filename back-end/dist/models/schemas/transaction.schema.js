"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionSchema = exports.TransactionType = exports.Transaction = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = require("@nestjs/mongoose");
const create_update_schema_1 = require("./create-update.schema");
let Transaction = class Transaction extends create_update_schema_1.CreateUpdateSchema {
};
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Transaction.prototype, "type", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Transaction.prototype, "transactionId", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", Boolean)
], Transaction.prototype, "status", void 0);
Transaction = tslib_1.__decorate([
    (0, mongoose_1.Schema)({ collection: "transactions" })
], Transaction);
exports.Transaction = Transaction;
var TransactionType;
(function (TransactionType) {
    TransactionType["NewNftTypeCreated"] = "New NFT collection created";
    TransactionType["NftTypeRegister"] = "NFT collection register";
    TransactionType["NftMinted"] = "Nft minted";
    TransactionType["TokenAssociate"] = "Token associate";
    TransactionType["ConfigStakeRule"] = "Stake rule updated";
    TransactionType["StakeNft"] = "User stake NFT";
    TransactionType["UnStakeNft"] = "Un stake NFT";
    TransactionType["SetNFTProperty"] = "Set NFT property";
    TransactionType["UpdateNFTMetadata"] = "Set metadata for NFT";
})(TransactionType = exports.TransactionType || (exports.TransactionType = {}));
exports.TransactionSchema = mongoose_1.SchemaFactory.createForClass(Transaction);
//# sourceMappingURL=transaction.schema.js.map