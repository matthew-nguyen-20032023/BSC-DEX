import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OrderController } from "src/modules/order/order.controller";
import { OrderService } from "src/modules/order/order.service";
import { Order, OrderSchema } from "src/models/schemas/order.schema";
import { Pair, PairSchema } from "src/models/schemas/pair.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Pair.name, schema: PairSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
