import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { OrderStatus, OrderType } from "src/models/schemas/order.schema";
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

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    description: "Sort by price",
    required: false,
    example: "desc | asc",
  })
  sortPrice: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    description: "Sort by created time",
    required: false,
    example: "desc | asc",
  })
  sortCreated: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Base token address",
    required: true,
    example: "0x78F4419Fe57aA16e8D6e8ceffF4061A2641eE421",
  })
  baseTokenAddress: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Quote token address",
    required: true,
    example: "0x78F4419Fe57aA16e8D6e8ceffF4061A2641eE421",
  })
  quoteTokenAddress: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({
    description: "Order side type",
    required: false,
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

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: "Address of maker wallet",
    required: false,
    example: OrderStatus.FillAble,
  })
  orderStatus: OrderStatus;

  pairId: string;
}
