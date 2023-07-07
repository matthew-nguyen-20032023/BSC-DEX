"use strict";
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const tslib_1 = require("tslib");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const common_1 = require("@nestjs/common");
const user_repository_1 = require("../../models/repositories/user.repository");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../../models/schemas/user.schema");
const mongoose_2 = require("mongoose");
const auth_const_1 = require("./auth.const");
let AuthService = AuthService_1 = class AuthService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
        this.userRepository = new user_repository_1.UserRepository(this.userModel);
    }
    async register(email, password, userRole) {
        const existUser = await this.userRepository.getUserByEmail(email);
        if (existUser) {
            throw new common_1.HttpException({ message: auth_const_1.AuthMessageError.EmailTaken }, common_1.HttpStatus.BAD_REQUEST);
        }
        const newUser = new user_schema_1.User();
        newUser.email = email;
        newUser.password = await bcrypt.hash(password, Number(process.env.SALT_OR_ROUNDS));
        newUser.role = userRole;
        return this.userRepository.save(newUser);
    }
    async validateUser(email, pass) {
        const user = await this.userRepository.getUserByEmail(email);
        if (user && user.password === pass) {
            const { password } = user, result = tslib_1.__rest(user, ["password"]);
            return result;
        }
        return null;
    }
    static async checkPasswordMatch(password, hashPassword, errorMessage) {
        const isMatchPassword = await bcrypt.compare(password, hashPassword);
        if (!isMatchPassword) {
            throw new common_1.HttpException({ message: errorMessage }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async login(email, password) {
        const user = await this.userRepository.getUserByEmail(email);
        await AuthService_1.checkPasswordMatch(password, user.password, auth_const_1.AuthMessageError.WrongEmailOrPassword);
        const accessToken = this.jwtService.sign({
            id: user._id,
            email: user.email,
            role: user.role,
        });
        return {
            accessToken,
            role: user.role,
            userId: user._id,
        };
    }
};
AuthService = AuthService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    tslib_1.__metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map