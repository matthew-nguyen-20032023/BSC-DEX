"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const transaction_schema_1 = require("../../models/schemas/transaction.schema");
const transaction_repository_1 = require("../../models/repositories/transaction.repository");
let TransactionService = class TransactionService {
    constructor(transactionModel) {
        this.transactionModel = transactionModel;
        this.transactionRepository = new transaction_repository_1.TransactionRepository(this.transactionModel);
    }
    async getRecentTransaction(page, limit) {
        return this.transactionRepository.getListTransaction(page, limit);
    }
};
TransactionService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    tslib_1.__metadata("design:paramtypes", [mongoose_2.Model])
], TransactionService);
exports.TransactionService = TransactionService;
//# sourceMappingURL=transaction.service.js.map