import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { CreateUpdateSchema } from "src/models/schemas/create-update.schema";

export type OrderDocument = HydratedDocument<Order>;
export enum OrderType {
  BuyOrder = "buy",
  SellOrder = "sell",
}
export enum OrderStatus {
  FillAble = "fill-able",
  PartialFill = "partial-fill",
  Completed = "completed",
  Failed = "failed",
}
@Schema({ collection: "orders" })
export class Order extends CreateUpdateSchema {
  @Prop()
  pairId: string;

  @Prop()
  type: OrderType;

  @Prop()
  status: OrderStatus;

  @Prop()
  remainingAmount: string;

  @Prop()
  chainId: number;

  @Prop()
  verifyingContract: string;

  @Prop()
  maker: string;

  @Prop()
  taker: string;

  @Prop()
  makerToken: string;

  @Prop()
  takerToken: string;

  @Prop()
  makerAmount: string;

  @Prop()
  takerAmount: string;

  @Prop()
  takerTokenFeeAmount: string;

  @Prop()
  sender: string;

  @Prop()
  feeRecipient: string;

  @Prop()
  expiry: number;

  @Prop()
  pool: string;

  @Prop()
  salt: string;

  @Prop()
  signature: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
