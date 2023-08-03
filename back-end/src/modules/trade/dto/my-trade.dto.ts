import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

/**
 * @description The address of ERC20 token on BSC network
 */
export class MyTradeDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({
    description: "Page",
    required: true,
    example: 1,
  })
  page: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({
    description: "Limit",
    required: true,
    example: 10,
  })
  limit: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "User wallet",
    required: true,
    example: "0x0056ea9a9c2a68d1679787a10b36acc71750093e",
  })
  wallet: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Pair id",
    required: true,
    example: "64ca637a5dc04241fff1d209",
  })
  pairId: string;
}
