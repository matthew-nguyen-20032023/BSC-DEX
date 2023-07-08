"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginWithWallet = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class LoginWithWallet {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Message for login sign from metamask",
        required: true,
        example: "0xf04e7f4e6f56bfea5521281406a63d93eb12f7f0358428e290e6f795846ea057235e861f996b6ad5f6458333abfca4b492c6c8eb0496cb722fda4e8bc7bf5c8c1c",
    }),
    tslib_1.__metadata("design:type", String)
], LoginWithWallet.prototype, "signedMessage", void 0);
exports.LoginWithWallet = LoginWithWallet;
//# sourceMappingURL=login.dto.js.map