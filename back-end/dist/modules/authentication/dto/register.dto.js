"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDtoSuccess = exports.RegisterDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const auth_const_1 = require("../auth.const");
const common_1 = require("@nestjs/common");
const user_schema_1 = require("../../../models/schemas/user.schema");
class RegisterDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: "Email",
        required: true,
        example: "exampleEmail@gmail.com",
    }),
    tslib_1.__metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: "Password",
        required: true,
        example: "examplePassword@123",
    }),
    tslib_1.__metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsEnum)(user_schema_1.UserRole),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: "Role",
        required: true,
        example: `${user_schema_1.UserRole.Client} | ${user_schema_1.UserRole.Admin}`,
    }),
    tslib_1.__metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
exports.RegisterDto = RegisterDto;
class RegisterDtoSuccess {
}
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        example: auth_const_1.AuthMessageSuccess.RegisterSuccess,
    }),
    tslib_1.__metadata("design:type", String)
], RegisterDtoSuccess.prototype, "message", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            email: "exampleEmail@gmail1.com",
            role: "client",
            password: "$2b$10$ymTkVyorjn/AW0ohvtES/e.xTNzxQ44ppz.B5ec40nnHJhUu/.51C",
            _id: "645df28c4ab4550e40c3dc01",
            createdAt: "2023-05-12T08:02:20.230Z",
            updatedAt: "2023-05-12T08:02:20.230Z",
            __v: 0,
        },
    }),
    tslib_1.__metadata("design:type", Object)
], RegisterDtoSuccess.prototype, "data", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        example: common_1.HttpStatus.OK,
    }),
    tslib_1.__metadata("design:type", Number)
], RegisterDtoSuccess.prototype, "statusCode", void 0);
exports.RegisterDtoSuccess = RegisterDtoSuccess;
//# sourceMappingURL=register.dto.js.map