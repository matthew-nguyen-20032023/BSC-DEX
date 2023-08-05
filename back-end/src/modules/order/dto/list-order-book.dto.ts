import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

export class ListOrderBookDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Pair id",
    required: true,
    example: "64b78387748b86d134d8ff50",
  })
  pairId: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({
    description: "Limit",
    required: true,
    example: 10,
  })
  limit: number;
}
