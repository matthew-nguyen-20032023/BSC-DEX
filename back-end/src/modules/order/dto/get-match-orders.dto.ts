import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { OrderType } from "src/models/schemas/order.schema";

export class GetMatchOrdersDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Address of maker token",
    required: true,
    example: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  })
  makerToken: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Address of taker token",
    required: true,
    example: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
  })
  takerToken: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Price expectation",
    required: true,
    example: "1000",
  })
  price: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Amount",
    required: true,
    example: "1000",
  })
  amount: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Order type",
    required: true,
    example: OrderType.BuyOrder,
  })
  orderType: OrderType;
}
