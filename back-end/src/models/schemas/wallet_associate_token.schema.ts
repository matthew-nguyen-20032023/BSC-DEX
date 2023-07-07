import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { CreateUpdateSchema } from "src/models/schemas/create-update.schema";

export type WalletAssociateTokenDocument =
  HydratedDocument<WalletAssociateToken>;

@Schema({ collection: "wallet_associate_nft" })
export class WalletAssociateToken extends CreateUpdateSchema {
  @Prop()
  userId: string;

  @Prop()
  tokenId: string;
}

export const WalletAssociateTokenSchema =
  SchemaFactory.createForClass(WalletAssociateToken);
