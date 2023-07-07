import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { CreateUpdateSchema } from "src/models/schemas/create-update.schema";

export type WalletDocument = HydratedDocument<Wallet>;

@Schema({ collection: "wallets" })
export class Wallet extends CreateUpdateSchema {
  @Prop()
  userId: string;

  @Prop()
  evmAddress: string;

  @Prop()
  accountId: string;

  @Prop()
  privateKey: string;

  @Prop()
  publicKey: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
