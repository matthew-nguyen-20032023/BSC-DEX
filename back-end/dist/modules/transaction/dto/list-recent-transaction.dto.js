"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListRecentTransactionDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ListRecentTransactionDto {
}
tslib_1.__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Page",
        required: true,
        example: 1,
    }),
    tslib_1.__metadata("design:type", Number)
], ListRecentTransactionDto.prototype, "page", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Limit",
        required: true,
        example: 10,
    }),
    tslib_1.__metadata("design:type", Number)
], ListRecentTransactionDto.prototype, "limit", void 0);
exports.ListRecentTransactionDto = ListRecentTransactionDto;
//# sourceMappingURL=list-recent-transaction.dto.js.map