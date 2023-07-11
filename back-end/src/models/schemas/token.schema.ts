import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { CreateUpdateSchema } from "src/models/schemas/create-update.schema";

export type TokenDocument = HydratedDocument<Token>;

@Schema({ collection: "tokens" })
export class Token extends CreateUpdateSchema {
  @Prop()
  name: string;

  @Prop()
  symbol: string;

  @Prop()
  address: string;

  @Prop()
  decimals: number;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
