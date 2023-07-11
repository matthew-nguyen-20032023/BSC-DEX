import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { CreateUpdateSchema } from "src/models/schemas/create-update.schema";

export type PairDocument = HydratedDocument<Pair>;

@Schema({ collection: "pairs" })
export class Pair extends CreateUpdateSchema {
  @Prop()
  name: string;

  @Prop()
  baseTokenAddress: string;

  @Prop()
  quoteTokenAddress: string;
}

export const PairSchema = SchemaFactory.createForClass(Pair);
