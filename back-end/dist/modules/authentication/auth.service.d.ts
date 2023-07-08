import { JwtService } from "@nestjs/jwt";
import { User, UserDocument, UserRole } from "src/models/schemas/user.schema";
import { Model } from "mongoose";
import { ILoginResponse } from "src/modules/authentication/auth.interface";
export declare class AuthService {
    private readonly userModel;
    private jwtService;
    private userRepository;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    register(email: string, password: string, userRole: UserRole): Promise<User>;
    validateUser(email: string, pass: string): Promise<any>;
    static checkPasswordMatch(password: string, hashPassword: string, errorMessage: string): Promise<void>;
    loginWithWallet(signedMessage: string): Promise<ILoginResponse>;
}
