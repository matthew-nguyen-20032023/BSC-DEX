import { AuthService } from "src/modules/authentication/auth.service";
import { LoginDto } from "src/modules/authentication/dto/login.dto";
import { IResponseToClient } from "src/configs/response-to-client.config";
import { RegisterDto } from "src/modules/authentication/dto/register.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<IResponseToClient>;
    login(loginDto: LoginDto): Promise<IResponseToClient>;
}
