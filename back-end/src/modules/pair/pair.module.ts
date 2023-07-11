import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Pair, PairSchema } from "src/models/schemas/pair.schema";
import { Token, TokenSchema } from "src/models/schemas/token.schema";
import { PairController } from "src/modules/pair/pair.controller";
import { PairService } from "src/modules/pair/pair.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pair.name, schema: PairSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
  ],
  controllers: [PairController],
  providers: [PairService],
})
export class PairModule {}
