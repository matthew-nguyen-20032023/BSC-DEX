import { Model } from "mongoose";
import { Transaction, TransactionDocument } from "src/models/schemas/transaction.schema";
export declare class TransactionRepository {
    private readonly model;
    constructor(model: Model<TransactionDocument>);
    save(transaction: Transaction): Promise<Transaction>;
    getListTransaction(page: number, limit: number): Promise<{
        transactions: Transaction[];
        total: number;
    }>;
}
