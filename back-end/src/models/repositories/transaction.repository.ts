import { Model } from "mongoose";
import {
  Transaction,
  TransactionDocument,
} from "src/models/schemas/transaction.schema";

export class TransactionRepository {
  constructor(private readonly model: Model<TransactionDocument>) {}

  public async save(transaction: Transaction): Promise<Transaction> {
    const newTransaction = new this.model(transaction);
    return this.model.create(newTransaction);
  }

  public async getListTransaction(
    page: number,
    limit: number
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const transactions = await this.model
      .find()
      .sort({ createdAt: "desc" })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await this.model.count();
    return { transactions, total };
  }
}
