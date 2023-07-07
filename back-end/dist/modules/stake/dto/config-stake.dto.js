"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigStakeDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ConfigStakeDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: "Stake type",
        required: false,
        example: "Normal | Medium | Advance",
    }),
    tslib_1.__metadata("design:type", String)
], ConfigStakeDto.prototype, "stakeType", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Day allow user un-stake and get reward",
        required: true,
        example: 60,
    }),
    (0, class_validator_1.Min)(1),
    tslib_1.__metadata("design:type", Number)
], ConfigStakeDto.prototype, "duration", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Reward balance for user complete stake",
        required: true,
        example: 10,
    }),
    (0, class_validator_1.Min)(1),
    tslib_1.__metadata("design:type", Number)
], ConfigStakeDto.prototype, "rewardBalance", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Penalty balance for user un-stake early",
        required: true,
        example: 5,
    }),
    (0, class_validator_1.Min)(1),
    tslib_1.__metadata("design:type", Number)
], ConfigStakeDto.prototype, "penaltyBalance", void 0);
exports.ConfigStakeDto = ConfigStakeDto;
//# sourceMappingURL=config-stake.dto.js.map