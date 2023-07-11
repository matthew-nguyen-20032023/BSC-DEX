import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class DetailTokenDto {
  @IsString()
  @ApiProperty({
    description: "Token address",
    required: true,
    example: "0x9aac92B2341cF359A46CDfD2BEccc76Aa1554915",
  })
  tokenAddress: string;
}
