import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

/**
 * @description The address of ERC20 token on BSC network
 */
export class MintTokenForTestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Wallet receive token",
    required: true,
    example: "0x19Ef6AB7a5e9753C214462df01F77aD324dA645D",
  })
  receiver: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Amount of token want to mint",
    required: true,
    example: "1000000000000000000000",
  })
  amount: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Address of token want to mint",
    required: true,
    example: "",
  })
  tokenAddress: string;
}
