import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";

export class ListRecentTransactionDto {
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({
    description: "Page",
    required: true,
    example: 1,
  })
  page: number;

  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({
    description: "Limit",
    required: true,
    example: 10,
  })
  limit: number;
}
