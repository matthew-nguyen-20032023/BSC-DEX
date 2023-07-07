import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { CreateUpdateSchema } from "src/models/schemas/create-update.schema";

export type UserStakeInformationDocument =
  HydratedDocument<UserStakeInformation>;

@Schema({ collection: "user_stake_information" })
export class UserStakeInformation extends CreateUpdateSchema {
  @Prop()
  userId: string;

  @Prop()
  stakeType: string;

  @Prop()
  nftId: string; // Refer to _id of nfts collections

  @Prop()
  endTime: number;

  @Prop()
  status: UserStakeInformationStatus;
}

export enum UserStakeInformationStatus {
  Staking = "staking",
  Completed = "completed",
  Penalty = "penalty",
  FailedToComplete = "failed_to_complete",
}

export const UserStakeInformationSchema =
  SchemaFactory.createForClass(UserStakeInformation);
