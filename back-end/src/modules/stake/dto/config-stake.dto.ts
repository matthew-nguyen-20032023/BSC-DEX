import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

export class ConfigStakeDto {
  @IsOptional()
  @ApiProperty({
    description: "Stake type",
    required: false,
    example: "Normal | Medium | Advance",
  })
  stakeType: string;

  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({
    description: "Day allow user un-stake and get reward",
    required: true,
    example: 60,
  })
  @Min(1)
  duration: number;

  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({
    description: "Reward balance for user complete stake",
    required: true,
    example: 10,
  })
  @Min(1)
  rewardBalance: number;

  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({
    description: "Penalty balance for user un-stake early",
    required: true,
    example: 5,
  })
  @Min(1)
  penaltyBalance: number;
}
