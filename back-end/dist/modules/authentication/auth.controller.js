"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const auth_const_1 = require("./auth.const");
const register_dto_1 = require("./dto/register.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(registerDto) {
        const result = await this.authService.register(registerDto.email, registerDto.password, registerDto.role);
        return {
            message: auth_const_1.AuthMessageSuccess.RegisterSuccess,
            data: result,
            statusCode: common_1.HttpStatus.OK,
        };
    }
    async login(loginDto) {
        const result = await this.authService.login(loginDto.email, loginDto.password);
        return {
            message: auth_const_1.AuthMessageSuccess.LoginSuccess,
            data: result,
            statusCode: common_1.HttpStatus.OK,
        };
    }
};
tslib_1.__decorate([
    (0, common_1.Post)("register"),
    (0, swagger_1.ApiOperation)({ summary: "Api for user to register." }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: auth_const_1.AuthMessageSuccess.RegisterSuccess,
        type: register_dto_1.RegisterDtoSuccess,
    }),
    (0, auth_const_1.Public)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
tslib_1.__decorate([
    (0, common_1.Post)("login"),
    (0, swagger_1.ApiOperation)({
        summary: "Api for user to login.",
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: auth_const_1.AuthMessageSuccess.LoginSuccess,
        type: login_dto_1.LoginResponseSuccess,
    }),
    (0, auth_const_1.Public)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [login_dto_1.LoginDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
AuthController = tslib_1.__decorate([
    (0, common_1.Controller)("auth"),
    (0, swagger_1.ApiTags)("Authentication"),
    tslib_1.__metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map