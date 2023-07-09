import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "src/modules/authentication/auth.service";
import { LoginWithWallet } from "src/modules/authentication/dto/login.dto";
import { IResponseToClient } from "src/configs/response-to-client.config";
import {
  AuthMessageSuccess,
  Public,
} from "src/modules/authentication/auth.const";

@Controller("auth")
@ApiTags("Authentication")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
}
