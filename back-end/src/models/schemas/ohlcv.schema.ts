import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { CreateUpdateSchema } from "src/models/schemas/create-update.schema";

export type OHLCVDocument = HydratedDocument<OHLCV>;

/**
 * @description minutes
 */
export enum OHLCVType {
  Minute = 1,
  FifteenMinutes = 15,
  Hour = 60,
  FourHours = 240,
  Day = 3600,
  Week = 25200,
}

@Schema({ collection: "ohlcvs" })
export class OHLCV extends CreateUpdateSchema {
  @Prop()
  pairId: string;

  @Prop()
  ohlcvType: OHLCVType;

  @Prop()
  timestamp: number;

  @Prop()
  open: string;

  @Prop()
  high: string;

  @Prop()
  low: string;

  @Prop()
  close: string;

  @Prop()
  volume: string;
}

export const OHLCVSchema = SchemaFactory.createForClass(OHLCV);
