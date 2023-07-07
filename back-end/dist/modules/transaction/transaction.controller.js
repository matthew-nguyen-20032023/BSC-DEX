"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const transaction_service_1 = require("./transaction.service");
const transaction_const_1 = require("./transaction.const");
const list_recent_transaction_dto_1 = require("./dto/list-recent-transaction.dto");
const auth_const_1 = require("../authentication/auth.const");
let TransactionController = class TransactionController {
    constructor(transactionService) {
        this.transactionService = transactionService;
    }
    async getRecentTransaction(listRecentTransactionDto) {
        const { transactions, total } = await this.transactionService.getRecentTransaction(listRecentTransactionDto.page, listRecentTransactionDto.limit);
        return {
            message: transaction_const_1.TransactionSuccessMessage.GetTransactionSuccess,
            data: transactions,
            statusCode: common_1.HttpStatus.OK,
            metadata: {
                total,
            },
        };
    }
};
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: "Api to recent transaction on application.",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: transaction_const_1.TransactionSuccessMessage.GetTransactionSuccess,
    }),
    (0, auth_const_1.Public)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [list_recent_transaction_dto_1.ListRecentTransactionDto]),
    tslib_1.__metadata("design:returntype", Promise)
], TransactionController.prototype, "getRecentTransaction", null);
TransactionController = tslib_1.__decorate([
    (0, common_1.Controller)("transaction"),
    (0, swagger_1.ApiTags)("Transaction"),
    tslib_1.__metadata("design:paramtypes", [transaction_service_1.TransactionService])
], TransactionController);
exports.TransactionController = TransactionController;
//# sourceMappingURL=transaction.controller.js.map