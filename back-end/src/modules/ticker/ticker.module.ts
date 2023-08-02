import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Trade, TradeSchema } from "src/models/schemas/trade.schema";
import { TickerController } from "src/modules/ticker/ticker.controller";
import { TickerService } from "src/modules/ticker/ticker.service";
import { TickerConsole } from "src/modules/ticker/ticker.console";
import { Pair, PairSchema } from "src/models/schemas/pair.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Trade.name, schema: TradeSchema },
      { name: Pair.name, schema: PairSchema },
    ]),
  ],
  controllers: [TickerController],
  providers: [TickerService, TickerConsole],
})
export class TickerModule {}
