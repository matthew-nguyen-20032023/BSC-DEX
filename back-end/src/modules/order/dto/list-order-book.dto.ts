import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

export class ListOrderBookDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Pair id",
    required: false,
    example: "64b78387748b86d134d8ff50",
  })
  pairId: string;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "Limit",
    required: true,
    example: 15,
  })
  limit: number;
}
