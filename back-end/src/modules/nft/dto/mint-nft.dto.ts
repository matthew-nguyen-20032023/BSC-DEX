import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class MintNftDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Receiver email",
    required: true,
    example: "admin1@gmail.com",
  })
  receiverEmail: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Id of nft type created",
    required: true,
    example: "645e0a1431f85340b5405d7e",
  })
  nftTypeId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Url of ipfs",
    required: true,
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

  @IsOptional()
  @ApiProperty({
    description: "Description for NFT",
    required: false,
    example: "Description",
  })
  description: string;
}
