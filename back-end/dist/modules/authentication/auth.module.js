"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const user_schema_1 = require("../../models/schemas/user.schema");
const jwt_1 = require("@nestjs/jwt");
let AuthModule = class AuthModule {
};
AuthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXP },
            }),
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map