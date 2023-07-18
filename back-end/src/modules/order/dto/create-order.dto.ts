import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { OrderType } from "src/models/schemas/order.schema";
import { Type } from "class-transformer";

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Order side type",
    required: true,
    example: `${OrderType.SellOrder} | ${OrderType.BuyOrder}`,
  })
  type: OrderType;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({
    description: "Chain id",
    required: true,
    example: 97,
  })
  chainId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Verifying contract address (exchange contract)",
    required: true,
    example: "0x78F4419Fe57aA16e8D6e8ceffF4061A2641eE421",
  })
  verifyingContract: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Address of maker wallet",
    required: true,
    example: "0x2b98a2c5A0155d9D6aAa0747E6bbE3D285EA7bb7",
  })
  maker: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Address of taker wallet",
    required: true,
    example: "0x0000000000000000000000000000000000000000",
  })
  taker: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Maker token address",
    required: true,
    example: "0xf0fbdc550bbA5689b5c51e7B7AF339E2c731ee5f",
  })
  makerToken: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Taker token address",
    required: true,
    example: "0x0518D7a894d7E08DDDaCCD2550C33eBa399ad2b6",
  })
  takerToken: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Maker amount",
    required: true,
    example: "200000000000000000000",
  })
  makerAmount: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Taker amount",
    required: true,
    example: "400000000000000000000",
  })
  takerAmount: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Taker token fee amount",
    required: true,
    example: "0",
  })
  takerTokenFeeAmount: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Sender",
    required: true,
    example: "0x0000000000000000000000000000000000000000",
  })
  sender: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Fee recipient",
    required: true,
    example: "0x0000000000000000000000000000000000000000",
  })
  feeRecipient: string;

  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: "Base token address",
    required: true,
    example: 1689698095,
  })
  expiry: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Pool",
    required: true,
    example:
      "0x0000000000000000000000000000000000000000000000000000000000000000",
  })
  pool: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Salt",
    required: true,
    example: Date.now().toString(),
  })
  salt: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Signature",
    required: true,
    example: "",
  })
  signature: string;
}
