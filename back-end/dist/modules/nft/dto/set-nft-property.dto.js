"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetNftPropertyDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SetNftPropertyDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Id of nft created",
        required: true,
        example: "645e0a1431f85340b5405d7e",
    }),
    tslib_1.__metadata("design:type", String)
], SetNftPropertyDto.prototype, "nftId", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: "Url of ipfs",
        required: false,
        example: "ipfs://0xxxx",
    }),
    tslib_1.__metadata("design:type", String)
], SetNftPropertyDto.prototype, "ipfs", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: "Tier",
        required: false,
        example: "Gold",
    }),
    tslib_1.__metadata("design:type", String)
], SetNftPropertyDto.prototype, "tier", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, swagger_1.ApiProperty)({
        description: "Balance",
        required: false,
        example: 200,
    }),
    tslib_1.__metadata("design:type", Number)
], SetNftPropertyDto.prototype, "balance", void 0);
exports.SetNftPropertyDto = SetNftPropertyDto;
//# sourceMappingURL=set-nft-property.dto.js.map