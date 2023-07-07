import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { CreateUpdateSchema } from "src/models/schemas/create-update.schema";

export type NftDocument = HydratedDocument<Nft>;

@Schema({ collection: "nfts" })
export class Nft extends CreateUpdateSchema {
  @Prop()
  nftType: string;

  @Prop()
  tokenId: number;

  @Prop()
  ownerId: string; // userId owner NFT

  @Prop()
  tier: string;

  @Prop()
  balance: number;

  @Prop()
  ipfs: string;

  @Prop()
  isStake: boolean;

  @Prop()
  endTime: number;

  @Prop()
  description: string;
}

export const NftSchema = SchemaFactory.createForClass(Nft);
