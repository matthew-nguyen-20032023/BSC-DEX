import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class RegisterNftDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Id of nft type created",
    required: true,
    example: "645e0a1431f85340b5405d7e",
  })
  nftTypeId: string;
}
