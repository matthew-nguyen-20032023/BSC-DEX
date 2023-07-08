import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginWithWallet {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: "Message for login sign from metamask",
    required: true,
    example: "0xf04e7f4e6f56bfea5521281406a63d93eb12f7f0358428e290e6f795846ea057235e861f996b6ad5f6458333abfca4b492c6c8eb0496cb722fda4e8bc7bf5c8c1c",
  })
  signedMessage: string;
}
