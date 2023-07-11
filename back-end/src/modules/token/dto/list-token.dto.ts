import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class ListTokenDto {
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "Page",
    required: true,
    example: 1,
  })
  page: number;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "Limit",
    required: true,
    example: 10,
  })
  limit: number;
}
