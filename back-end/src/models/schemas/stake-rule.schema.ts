import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { CreateUpdateSchema } from "src/models/schemas/create-update.schema";

export type StakeRuleDocument = HydratedDocument<StakeRule>;

@Schema({ collection: "stake_rule" })
export class StakeRule extends CreateUpdateSchema {
  @Prop()
  stakeType: string;

  @Prop()
  duration: number;

  @Prop()
  rewardBalance: number;

  @Prop()
  penaltyBalance: number;

  @Prop()
  isActive: boolean;
}

export const StakeRuleSchema = SchemaFactory.createForClass(StakeRule);
