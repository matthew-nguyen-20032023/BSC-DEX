import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UnStakeNftDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Nft id",
    required: true,
    example: "645fcde0d8c6e89ab987b0d6",
  })
  nftId: string;
}
