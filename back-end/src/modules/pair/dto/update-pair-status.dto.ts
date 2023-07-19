import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { PairStatus } from "src/models/schemas/pair.schema";

export class UpdatePairStatusDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Pair id",
    required: true,
    example: "",
  })
  pairId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Pair id",
    required: true,
    example: "",
  })
  status: PairStatus;
}
