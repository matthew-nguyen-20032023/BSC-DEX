import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { CreateUpdateSchema } from "src/models/schemas/create-update.schema";
import { OrderType } from "src/models/schemas/order.schema";

export type TradeDocument = HydratedDocument<Trade>;

@Schema({ collection: "trades" })
export class Trade extends CreateUpdateSchema {
  @Prop()
  orderType: OrderType;

  @Prop()
  pairId: string;

  @Prop()
  price: string;

  @Prop()
  volume: string;

  @Prop()
  timestamp: number;

  @Prop()
  transactionId: string;

  @Prop()
  maker: string;

  @Prop()
  taker: string;
}

export const TradeSchema = SchemaFactory.createForClass(Trade);
