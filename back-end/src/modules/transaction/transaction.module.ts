import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  Transaction,
  TransactionSchema,
} from "src/models/schemas/transaction.schema";
import { TransactionService } from "src/modules/transaction/transaction.service";
import { TransactionController } from "src/modules/transaction/transaction.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
