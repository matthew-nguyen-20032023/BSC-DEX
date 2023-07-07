import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class SetNftPropertyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Id of nft created",
    required: true,
    example: "645e0a1431f85340b5405d7e",
  })
  nftId: string;

  @IsOptional()
  @ApiProperty({
    description: "Url of ipfs",
    required: false,
    example: "ipfs://0xxxx",
  })
  ipfs: string;

  @IsOptional()
  @ApiProperty({
    description: "Tier",
    required: false,
    example: "Gold",
  })
  tier: string;

  @IsOptional()
  @Type(() => Number)
  @ApiProperty({
    description: "Balance",
    required: false,
    example: 200,
  })
  balance: number;
}
