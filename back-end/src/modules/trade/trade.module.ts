import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TradeController } from "src/modules/trade/trade.controller";
import { TradeService } from "src/modules/trade/trade.service";
import { Trade, TradeSchema } from "src/models/schemas/trade.schema";
import { OHLCV, OHLCVSchema } from "src/models/schemas/ohlcv.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Trade.name, schema: TradeSchema },
      { name: OHLCV.name, schema: OHLCVSchema },
    ]),
  ],
  controllers: [TradeController],
  providers: [TradeService],
})
export class TradeModule {}
