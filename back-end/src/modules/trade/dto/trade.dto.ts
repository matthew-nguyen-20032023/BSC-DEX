import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";
import { OHLCVTypeInterval } from "src/modules/trade/trade.const";

/**
 * @description The address of ERC20 token on BSC network
 */
export class TradeDto {
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
    description: "Start time in timestamp format",
    required: true,
    example: 1689867821000,
  })
  fromTimestamp: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "Start time in timestamp format",
    required: true,
    example: 1689967821000,
  })
  toTimestamp: number;

  @IsString()
  @ApiProperty({
    description: `ohlcv type interval such as ${Object.keys(
      OHLCVTypeInterval
    ).toString()}`,
    required: true,
    example: OHLCVTypeInterval.m15,
  })
  ohlcvTypeInterval: OHLCVTypeInterval;
}
