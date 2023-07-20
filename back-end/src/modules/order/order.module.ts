import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OrderController } from "src/modules/order/order.controller";
import { OrderService } from "src/modules/order/order.service";
import { Order, OrderSchema } from "src/models/schemas/order.schema";
import { Pair, PairSchema } from "src/models/schemas/pair.schema";
import { OrderConsole } from "src/modules/order/order.console";
import { Event, EventSchema } from "src/models/schemas/event.schema";
import { Trade, TradeSchema } from "src/models/schemas/trade.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Pair.name, schema: PairSchema },
      { name: Event.name, schema: EventSchema },
      { name: Trade.name, schema: TradeSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderConsole],
})
export class OrderModule {}
