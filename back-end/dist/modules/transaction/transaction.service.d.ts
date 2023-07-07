import { Model } from "mongoose";
import { Transaction, TransactionDocument } from "src/models/schemas/transaction.schema";
export declare class TransactionService {
    private readonly transactionModel;
    private transactionRepository;
    constructor(transactionModel: Model<TransactionDocument>);
    getRecentTransaction(page: number, limit: number): Promise<{
        transactions: Transaction[];
        total: number;
    }>;
}
