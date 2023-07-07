import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { CreateUpdateSchema } from "src/models/schemas/create-update.schema";

export type NftTypeDocument = HydratedDocument<NftType>;

@Schema({ collection: "nft_type" })
export class NftType extends CreateUpdateSchema {
  @Prop()
  nftType: string;

  @Prop()
  name: string;

  @Prop()
  symbol: string;

  @Prop()
  evmAddress: string;

  @Prop()
  accountId: string;

  @Prop()
  tier: string;

  @Prop()
  defaultBalance: number;

  @Prop()
  isRegister: boolean; // Register for management NFT smart contract
}

export const NftTypeSchema = SchemaFactory.createForClass(NftType);
