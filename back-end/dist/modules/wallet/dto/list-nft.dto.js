"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListNftDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ListNftDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: "Nft type",
        required: false,
        example: ["Dragon", "Hero"],
    }),
    tslib_1.__metadata("design:type", Array)
], ListNftDto.prototype, "nftTypes", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Page",
        required: true,
        example: 1,
    }),
    tslib_1.__metadata("design:type", Number)
], ListNftDto.prototype, "page", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Limit",
        required: true,
        example: 10,
    }),
    tslib_1.__metadata("design:type", Number)
], ListNftDto.prototype, "limit", void 0);
exports.ListNftDto = ListNftDto;
//# sourceMappingURL=list-nft.dto.js.map