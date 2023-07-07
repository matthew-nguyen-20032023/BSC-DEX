import { AuthMessageSuccess } from "src/modules/authentication/auth.const";
import { UserRole } from "src/models/schemas/user.schema";
export declare class RegisterDto {
    email: string;
    password: string;
    role: UserRole;
}
export declare class RegisterDtoSuccess {
    message: AuthMessageSuccess.RegisterSuccess;
    data: {};
    statusCode: number;
}
