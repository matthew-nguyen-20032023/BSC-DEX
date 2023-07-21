import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TradeController } from "src/modules/trade/trade.controller";
import { TradeService } from "src/modules/trade/trade.service";
import { Trade, TradeSchema } from "src/models/schemas/trade.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Trade.name, schema: TradeSchema }]),
  ],
  controllers: [TradeController],
  providers: [TradeService],
})
export class TradeModule {}
