"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociateTokenDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AssociateTokenDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Id of nft type created",
        required: true,
        example: "645e0a1431f85340b5405d7e",
    }),
    tslib_1.__metadata("design:type", String)
], AssociateTokenDto.prototype, "nftTypeId", void 0);
exports.AssociateTokenDto = AssociateTokenDto;
//# sourceMappingURL=associate-token.dto.js.map