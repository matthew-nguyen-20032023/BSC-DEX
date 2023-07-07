import { Model } from "mongoose";
import {
  UserStakeInformation,
  UserStakeInformationDocument,
  UserStakeInformationStatus,
} from "src/models/schemas/user-stake-information.schema";

export class UserStakeInformationRepository {
  constructor(private readonly model: Model<UserStakeInformationDocument>) {}

  public async save(
    userStakeInformation: UserStakeInformation
  ): Promise<UserStakeInformation> {
    const newUserStakeInformation = new this.model(userStakeInformation);
    return this.model.create(newUserStakeInformation);
  }

  public async getCurrentStake(
    userId: string,
    nftId: string
  ): Promise<UserStakeInformation> {
    return this.model.findOne({
      userId,
      nftId,
      status: UserStakeInformationStatus.Staking,
    });
  }

  public async getUserStakingNftInformation(
    userId: string,
    page: number,
    limit: number
  ): Promise<UserStakeInformation[]> {
    return this.model
      .find({
        status: UserStakeInformationStatus.Staking,
      })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  public async getCompleteStakeNft(
    currentTimestamp: number
  ): Promise<UserStakeInformation[]> {
    return this.model
      .find({
        status: UserStakeInformationStatus.Staking,
        endTime: { $lte: currentTimestamp },
      })
      .limit(10);
  }
}
