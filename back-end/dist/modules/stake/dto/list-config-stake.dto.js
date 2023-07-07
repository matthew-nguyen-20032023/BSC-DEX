"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListConfigStakeDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ListConfigStakeDto {
}
tslib_1.__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Page",
        required: true,
        example: 1,
    }),
    (0, class_validator_1.Min)(1),
    tslib_1.__metadata("design:type", Number)
], ListConfigStakeDto.prototype, "page", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Limit",
        required: true,
        example: 10,
    }),
    (0, class_validator_1.Min)(1),
    tslib_1.__metadata("design:type", Number)
], ListConfigStakeDto.prototype, "limit", void 0);
exports.ListConfigStakeDto = ListConfigStakeDto;
//# sourceMappingURL=list-config-stake.dto.js.map