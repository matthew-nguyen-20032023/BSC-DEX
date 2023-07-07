"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
class TransactionRepository {
    constructor(model) {
        this.model = model;
    }
    async save(transaction) {
        const newTransaction = new this.model(transaction);
        return this.model.create(newTransaction);
    }
    async getListTransaction(page, limit) {
        const transactions = await this.model
            .find()
            .sort({ createdAt: "desc" })
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await this.model.count();
        return { transactions, total };
    }
}
exports.TransactionRepository = TransactionRepository;
//# sourceMappingURL=transaction.repository.js.map