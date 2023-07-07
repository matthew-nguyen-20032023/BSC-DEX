"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.Public = exports.AuthMessageError = exports.AuthMessageSuccess = void 0;
const common_1 = require("@nestjs/common");
var AuthMessageSuccess;
(function (AuthMessageSuccess) {
    AuthMessageSuccess["LoginSuccess"] = "Login successfully.";
    AuthMessageSuccess["RegisterSuccess"] = "Register successfully.";
})(AuthMessageSuccess = exports.AuthMessageSuccess || (exports.AuthMessageSuccess = {}));
var AuthMessageError;
(function (AuthMessageError) {
    AuthMessageError["WrongEmailOrPassword"] = "Your Email or Password is invalid. Please try again or reset your password.";
    AuthMessageError["EmailTaken"] = "Email taken. Please choose another email.";
})(AuthMessageError = exports.AuthMessageError || (exports.AuthMessageError = {}));
const Public = () => (0, common_1.SetMetadata)(process.env.PUBLIC_KEY_JWT, true);
exports.Public = Public;
const Roles = (...roles) => (0, common_1.SetMetadata)(process.env.ROLE_KEY_JWT, roles);
exports.Roles = Roles;
//# sourceMappingURL=auth.const.js.map