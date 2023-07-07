"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStakeInformationRepository = void 0;
const user_stake_information_schema_1 = require("../schemas/user-stake-information.schema");
class UserStakeInformationRepository {
    constructor(model) {
        this.model = model;
    }
    async save(userStakeInformation) {
        const newUserStakeInformation = new this.model(userStakeInformation);
        return this.model.create(newUserStakeInformation);
    }
    async getCurrentStake(userId, nftId) {
        return this.model.findOne({
            userId,
            nftId,
            status: user_stake_information_schema_1.UserStakeInformationStatus.Staking,
        });
    }
    async getUserStakingNftInformation(userId, page, limit) {
        return this.model
            .find({
            status: user_stake_information_schema_1.UserStakeInformationStatus.Staking,
        })
            .skip((page - 1) * limit)
            .limit(limit);
    }
    async getCompleteStakeNft(currentTimestamp) {
        return this.model
            .find({
            status: user_stake_information_schema_1.UserStakeInformationStatus.Staking,
            endTime: { $lte: currentTimestamp },
        })
            .limit(10);
    }
}
exports.UserStakeInformationRepository = UserStakeInformationRepository;
//# sourceMappingURL=user-stake-information.repository.js.map