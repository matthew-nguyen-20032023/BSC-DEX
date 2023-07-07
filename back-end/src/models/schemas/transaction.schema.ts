import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { CreateUpdateSchema } from "src/models/schemas/create-update.schema";

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ collection: "transactions" })
export class Transaction extends CreateUpdateSchema {
  @Prop()
  type: TransactionType;

  @Prop()
  transactionId: string;

  @Prop()
  status: boolean;
}

export enum TransactionType {
  NewNftTypeCreated = "New NFT collection created",
  NftTypeRegister = "NFT collection register",
  NftMinted = "Nft minted",
  TokenAssociate = "Token associate",
  ConfigStakeRule = "Stake rule updated",
  StakeNft = "User stake NFT",
  UnStakeNft = "Un stake NFT",
  SetNFTProperty = "Set NFT property",
  UpdateNFTMetadata = "Set metadata for NFT",
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
