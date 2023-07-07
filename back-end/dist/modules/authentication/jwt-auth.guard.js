"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const core_1 = require("@nestjs/core");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)("jwt") {
    constructor(reflector) {
        super();
        this.reflector = reflector;
    }
    canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(process.env.PUBLIC_KEY_JWT, [context.getHandler(), context.getClass()]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }
    handleRequest(err, user, info) {
        if (err || !user) {
            throw new common_1.HttpException({ message: "Your session is expired. Please sign in" }, common_1.HttpStatus.UNAUTHORIZED);
        }
        return user;
    }
};
JwtAuthGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.Reflector])
], JwtAuthGuard);
exports.JwtAuthGuard = JwtAuthGuard;
//# sourceMappingURL=jwt-auth.guard.js.map