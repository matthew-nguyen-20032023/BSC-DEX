"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginResponseSuccess = exports.LoginDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const auth_const_1 = require("../auth.const");
const common_1 = require("@nestjs/common");
class LoginDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Email",
        required: true,
        example: "exampleEmail@gmail.com",
    }),
    tslib_1.__metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Password",
        required: true,
        example: "examplePassword@123",
    }),
    tslib_1.__metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
exports.LoginDto = LoginDto;
class LoginResponseSuccess {
}
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        example: auth_const_1.AuthMessageSuccess.LoginSuccess,
    }),
    tslib_1.__metadata("design:type", String)
], LoginResponseSuccess.prototype, "message", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVFbWFpbEBnbWFpbC5jb20iLCJ0eXBlT2ZVc2VyIjoiQWRtaW4iLCJpYXQiOjE2NzM0MjA3MTAsImV4cCI6MTY3MzUwNTMxMH0.YeRNSCvGX40hrQYT_nN0vyBBXPfwgIasE_8PMUCxwBM",
        },
    }),
    tslib_1.__metadata("design:type", Object)
], LoginResponseSuccess.prototype, "data", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        example: common_1.HttpStatus.OK,
    }),
    tslib_1.__metadata("design:type", Number)
], LoginResponseSuccess.prototype, "statusCode", void 0);
exports.LoginResponseSuccess = LoginResponseSuccess;
//# sourceMappingURL=login.dto.js.map