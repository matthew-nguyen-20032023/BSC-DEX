import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { CreateUpdateSchema } from "src/models/schemas/create-update.schema";

export type EventDocument = HydratedDocument<Event>;

export enum EventStatus {
  Crawled = "crawled", // Event just crawled and save on database
  Complete = "complete", // Event was handled successfully
  Failed = "failed", // Failed to handle event
}

@Schema({ collection: "events" })
export class Event extends CreateUpdateSchema {
  @Prop()
  blockNumber: number;

  @Prop()
  transactionHash: string;

  @Prop()
  name: string;

  @Prop()
  orderHash: string;

  @Prop()
  maker: string;

  @Prop()
  taker: string;

  @Prop()
  feeRecipient: string;

  @Prop()
  makerToken: string;

  @Prop()
  takerToken: string;

  @Prop()
  takerTokenFilledAmount: string;

  @Prop()
  makerTokenFilledAmount: string;

  @Prop()
  takerTokenFeeFilledAmount: string;

  @Prop()
  protocolFeePaid: string;

  @Prop()
  pool: string;

  @Prop()
  status: EventStatus;

  @Prop()
  note: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
