"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakeNftDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class StakeNftDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: "Stake type that active",
        required: false,
        example: "Normal | Medium | Advance",
    }),
    tslib_1.__metadata("design:type", String)
], StakeNftDto.prototype, "stakeType", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Nft id",
        required: true,
        example: "645fcde0d8c6e89ab987b0d6",
    }),
    tslib_1.__metadata("design:type", String)
], StakeNftDto.prototype, "nftId", void 0);
exports.StakeNftDto = StakeNftDto;
//# sourceMappingURL=stake-nft.dto.js.map