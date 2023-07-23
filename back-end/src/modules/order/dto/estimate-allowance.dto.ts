import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class EstimateAllowanceDto {
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
    description: "Address wallet to create order",
    required: true,
    example: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
  })
  maker: string;
}
