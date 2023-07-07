import { UserRole } from "src/models/schemas/user.schema";
export declare enum AuthMessageSuccess {
    LoginSuccess = "Login successfully.",
    RegisterSuccess = "Register successfully."
}
export declare enum AuthMessageError {
    WrongEmailOrPassword = "Your Email or Password is invalid. Please try again or reset your password.",
    EmailTaken = "Email taken. Please choose another email."
}
export declare const Public: () => import("@nestjs/common").CustomDecorator<string>;
export declare const Roles: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
