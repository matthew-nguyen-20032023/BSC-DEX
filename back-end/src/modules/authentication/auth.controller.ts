import { Body, Controller, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "src/modules/authentication/auth.service";
import {
  LoginDto,
  LoginResponseSuccess,
} from "src/modules/authentication/dto/login.dto";
import { IResponseToClient } from "src/configs/response-to-client.config";
import {
  AuthMessageSuccess,
  Public,
} from "src/modules/authentication/auth.const";
import {
  RegisterDto,
  RegisterDtoSuccess,
} from "src/modules/authentication/dto/register.dto";

@Controller("auth")
@ApiTags("Authentication")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "Api for user to register." })
  @ApiResponse({
    status: HttpStatus.OK,
    description: AuthMessageSuccess.RegisterSuccess,
    type: RegisterDtoSuccess,
  })
  @Public()
  async register(@Body() registerDto: RegisterDto): Promise<IResponseToClient> {
    const result = await this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.role
    );
    return {
      message: AuthMessageSuccess.RegisterSuccess,
      data: result,
      statusCode: HttpStatus.OK,
    };
  }

  @Post("login")
  @ApiOperation({
    summary: "Api for user to login.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: AuthMessageSuccess.LoginSuccess,
    type: LoginResponseSuccess,
  })
  @Public()
  async login(@Body() loginDto: LoginDto): Promise<IResponseToClient> {
    const result = await this.authService.login(
      loginDto.email,
      loginDto.password
    );
    return {
      message: AuthMessageSuccess.LoginSuccess,
      data: result,
      statusCode: HttpStatus.OK,
    };
  }
}
