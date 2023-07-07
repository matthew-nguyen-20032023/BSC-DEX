import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Min } from "class-validator";
import { Type } from "class-transformer";

export class ListConfigStakeDto {
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({
    description: "Page",
    required: true,
    example: 1,
  })
  @Min(1)
  page: number;

  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({
    description: "Limit",
    required: true,
    example: 10,
  })
  @Min(1)
  limit: number;
}
