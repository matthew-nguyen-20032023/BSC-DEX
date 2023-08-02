import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GetTickerDto {
  @IsString()
  @ApiProperty({
    description: "Pair id",
    required: true,
    example: "64b94a7ae40bacfe871a38a4",
  })
  pairId: string;
}
