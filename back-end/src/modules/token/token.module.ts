import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TokenController } from "src/modules/token/token.controller";
import { TokenService } from "src/modules/token/token.service";
import { Token, TokenSchema } from "src/models/schemas/token.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  controllers: [TokenController],
  providers: [TokenService],
})
export class TokenModule {}
