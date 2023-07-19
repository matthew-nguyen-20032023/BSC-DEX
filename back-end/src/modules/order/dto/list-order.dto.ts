import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { OrderType } from "src/models/schemas/order.schema";
import { Type } from "class-transformer";

export class ListOrderDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({
    description: "Page",
    required: true,
    example: 1,
  })
  page: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({
    description: "Limit",
    required: true,
    example: 10,
  })
  limit: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Sort by price",
    required: true,
    example: "desc | asc",
  })
  sortPrice: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Verifying contract address (exchange contract)",
    required: true,
    example: "0x78F4419Fe57aA16e8D6e8ceffF4061A2641eE421",
  })
  baseTokenAddress: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Verifying contract address (exchange contract)",
    required: true,
    example: "0x78F4419Fe57aA16e8D6e8ceffF4061A2641eE421",
  })
  quoteTokenAddress: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Order side type",
    required: true,
    example: `${OrderType.SellOrder} | ${OrderType.BuyOrder}`,
  })
  type: OrderType;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "Address of maker wallet",
    required: false,
    example: "0x2b98a2c5A0155d9D6aAa0747E6bbE3D285EA7bb7",
  })
  maker: string;

  pairId: string;
}
