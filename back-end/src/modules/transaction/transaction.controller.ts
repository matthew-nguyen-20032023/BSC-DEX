import { Controller, Get, HttpStatus, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { IResponseToClient } from "src/configs/response-to-client.config";
import { TransactionService } from "src/modules/transaction/transaction.service";
import { TransactionSuccessMessage } from "src/modules/transaction/transaction.const";
import { ListRecentTransactionDto } from "src/modules/transaction/dto/list-recent-transaction.dto";
import { Public } from "src/modules/authentication/auth.const";

@Controller("transaction")
@ApiTags("Transaction")
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @ApiOperation({
    summary: "Api to recent transaction on application.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: TransactionSuccessMessage.GetTransactionSuccess,
  })
  @Public()
  public async getRecentTransaction(
    @Query() listRecentTransactionDto: ListRecentTransactionDto
  ): Promise<IResponseToClient> {
    const { transactions, total } =
      await this.transactionService.getRecentTransaction(
        listRecentTransactionDto.page,
        listRecentTransactionDto.limit
      );
    return {
      message: TransactionSuccessMessage.GetTransactionSuccess,
      data: transactions,
      statusCode: HttpStatus.OK,
      metadata: {
        total,
      },
    };
  }
}
