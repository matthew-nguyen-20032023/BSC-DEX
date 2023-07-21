import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

/**
 * @description The address of ERC20 token on BSC network
 */
export class CurrentOriginTradeDto {
  @IsString()
  @ApiProperty({
    description: "Pair id",
    required: true,
    example: "64b94a7ae40bacfe871a38a4",
  })
  pairId: string;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "Limit",
    required: true,
    example: 20,
  })
  limit: number;
}
