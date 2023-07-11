import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePairDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Base token address",
    required: true,
    example: "",
  })
  baseTokenAddress: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Base token address",
    required: true,
    example: "",
  })
  quoteTokenAddress: string;
}
