import { IResponseToClient } from "src/configs/response-to-client.config";
import { TransactionService } from "src/modules/transaction/transaction.service";
import { ListRecentTransactionDto } from "src/modules/transaction/dto/list-recent-transaction.dto";
export declare class TransactionController {
    private readonly transactionService;
    constructor(transactionService: TransactionService);
    getRecentTransaction(listRecentTransactionDto: ListRecentTransactionDto): Promise<IResponseToClient>;
}
