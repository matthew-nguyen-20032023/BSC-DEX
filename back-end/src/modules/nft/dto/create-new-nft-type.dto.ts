import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateNewNftTypeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Type of NFT",
    required: true,
    example: "Monster | Dragon | Hero",
  })
  nftType: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Name of NFT",
    required: true,
    example: "Monster Collection | Dragon Collection | Hero Collection",
  })
  nftName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Symbol of NFT",
    required: true,
    example: "MS | D | HR",
  })
  nftSymbol: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Tier of NFT",
    required: true,
    example: "Gold | Silver | Bronze | Diamond | Platinum",
  })
  tier: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({
    description: "Default balance created",
    required: true,
    example: 100,
  })
  defaultBalance: number;
}
