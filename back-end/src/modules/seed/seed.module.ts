import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Pair, PairSchema } from "src/models/schemas/pair.schema";
import { Token, TokenSchema } from "src/models/schemas/token.schema";
import { User, UserSchema } from "src/models/schemas/user.schema";
import { Trade, TradeSchema } from "src/models/schemas/trade.schema";
import { Order, OrderSchema } from "src/models/schemas/order.schema";
import { EventSchema } from "src/models/schemas/event.schema";
import { SeedConsole } from "src/modules/seed/seed.console";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Pair.name, schema: PairSchema },
      { name: Token.name, schema: TokenSchema },
      { name: Trade.name, schema: TradeSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [],
  providers: [SeedConsole],
})
export class SeedModule {}
