import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ListOrderBookDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Pair id",
    required: true,
    example: "64b78387748b86d134d8ff50",
  })
  pairId: string;
}
