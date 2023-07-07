import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class StakeNftDto {
  @IsOptional()
  @ApiProperty({
    description: "Stake type that active",
    required: false,
    example: "Normal | Medium | Advance",
  })
  stakeType: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Nft id",
    required: true,
    example: "645fcde0d8c6e89ab987b0d6",
  })
  nftId: string;
}
