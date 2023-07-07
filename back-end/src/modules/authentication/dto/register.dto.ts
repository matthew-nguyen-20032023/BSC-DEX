import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import {
  AuthMessageError,
  AuthMessageSuccess,
} from "src/modules/authentication/auth.const";
import { HttpStatus } from "@nestjs/common";
import { UserRole } from "src/models/schemas/user.schema";

export class RegisterDto {
  @IsString()
  @ApiProperty({
    description: "Email",
    required: true,
    example: "exampleEmail@gmail.com",
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: "Password",
    required: true,
    example: "examplePassword@123",
  })
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  @ApiProperty({
    description: "Role",
    required: true,
    example: `${UserRole.Client} | ${UserRole.Admin}`,
  })
  role: UserRole;
}

export class RegisterDtoSuccess {
  @ApiProperty({
    example: AuthMessageSuccess.RegisterSuccess,
  })
  message: AuthMessageSuccess.RegisterSuccess;

  @ApiProperty({
    example: {
      email: "exampleEmail@gmail1.com",
      role: "client",
      password: "$2b$10$ymTkVyorjn/AW0ohvtES/e.xTNzxQ44ppz.B5ec40nnHJhUu/.51C",
      _id: "645df28c4ab4550e40c3dc01",
      createdAt: "2023-05-12T08:02:20.230Z",
      updatedAt: "2023-05-12T08:02:20.230Z",
      __v: 0,
    },
  })
  data: {};

  @ApiProperty({
    example: HttpStatus.OK,
  })
  statusCode: number;
}
