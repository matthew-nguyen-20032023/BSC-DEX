import { Model } from "mongoose";
import { UserStakeInformation, UserStakeInformationDocument } from "src/models/schemas/user-stake-information.schema";
export declare class UserStakeInformationRepository {
    private readonly model;
    constructor(model: Model<UserStakeInformationDocument>);
    save(userStakeInformation: UserStakeInformation): Promise<UserStakeInformation>;
    getCurrentStake(userId: string, nftId: string): Promise<UserStakeInformation>;
    getUserStakingNftInformation(userId: string, page: number, limit: number): Promise<UserStakeInformation[]>;
    getCompleteStakeNft(currentTimestamp: number): Promise<UserStakeInformation[]>;
}
