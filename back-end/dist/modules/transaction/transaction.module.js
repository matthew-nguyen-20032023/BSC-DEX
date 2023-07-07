"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const transaction_schema_1 = require("../../models/schemas/transaction.schema");
const transaction_service_1 = require("./transaction.service");
const transaction_controller_1 = require("./transaction.controller");
let TransactionModule = class TransactionModule {
};
TransactionModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: transaction_schema_1.Transaction.name, schema: transaction_schema_1.TransactionSchema },
            ]),
        ],
        controllers: [transaction_controller_1.TransactionController],
        providers: [transaction_service_1.TransactionService],
    })
], TransactionModule);
exports.TransactionModule = TransactionModule;
//# sourceMappingURL=transaction.module.js.map