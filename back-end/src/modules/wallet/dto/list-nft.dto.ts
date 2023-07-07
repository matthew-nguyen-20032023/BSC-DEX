import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class ListNftDto {
  @IsOptional()
  @ApiProperty({
    description: "Nft type",
    required: false,
    example: ["Dragon", "Hero"],
  })
  nftTypes: string[];

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
