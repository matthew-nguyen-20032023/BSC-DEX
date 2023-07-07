import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  Transaction,
  TransactionDocument,
} from "src/models/schemas/transaction.schema";
import { TransactionRepository } from "src/models/repositories/transaction.repository";

@Injectable()
export class TransactionService {
  private transactionRepository: TransactionRepository;

  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>
  ) {
    this.transactionRepository = new TransactionRepository(
      this.transactionModel
    );
  }

  public async getRecentTransaction(
    page: number,
    limit: number
  ): Promise<{ transactions: Transaction[]; total: number }> {
    return this.transactionRepository.getListTransaction(page, limit);
  }
}
