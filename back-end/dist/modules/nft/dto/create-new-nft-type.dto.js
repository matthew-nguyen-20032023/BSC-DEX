"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateNewNftTypeDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateNewNftTypeDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Type of NFT",
        required: true,
        example: "Monster | Dragon | Hero",
    }),
    tslib_1.__metadata("design:type", String)
], CreateNewNftTypeDto.prototype, "nftType", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Name of NFT",
        required: true,
        example: "Monster Collection | Dragon Collection | Hero Collection",
    }),
    tslib_1.__metadata("design:type", String)
], CreateNewNftTypeDto.prototype, "nftName", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Symbol of NFT",
        required: true,
        example: "MS | D | HR",
    }),
    tslib_1.__metadata("design:type", String)
], CreateNewNftTypeDto.prototype, "nftSymbol", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Tier of NFT",
        required: true,
        example: "Gold | Silver | Bronze | Diamond | Platinum",
    }),
    tslib_1.__metadata("design:type", String)
], CreateNewNftTypeDto.prototype, "tier", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Default balance created",
        required: true,
        example: 100,
    }),
    tslib_1.__metadata("design:type", Number)
], CreateNewNftTypeDto.prototype, "defaultBalance", void 0);
exports.CreateNewNftTypeDto = CreateNewNftTypeDto;
//# sourceMappingURL=create-new-nft-type.dto.js.map