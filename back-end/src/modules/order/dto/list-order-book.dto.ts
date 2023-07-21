import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";
import { OrderType } from "src/models/schemas/order.schema";

export class ListOrderBookDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Pair id",
    required: true,
    example: "64b78387748b86d134d8ff50",
  })
  pairId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Order type",
    required: true,
    example: OrderType.BuyOrder,
  })
  type: OrderType;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "Limit",
    required: true,
    example: 15,
  })
  limit: number;
}
