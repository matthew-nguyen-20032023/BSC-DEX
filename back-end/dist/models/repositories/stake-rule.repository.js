"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakeRuleRepository = void 0;
class StakeRuleRepository {
    constructor(model) {
        this.model = model;
    }
    async save(stakeRule) {
        const newStakeRule = new this.model(stakeRule);
        return this.model.create(newStakeRule);
    }
    async getRecentActiveStakeRule(page, limit) {
        return this.model
            .find({
            isActive: true,
        })
            .skip((page - 1) * limit)
            .limit(limit);
    }
    async countTotalActiveStakeRule() {
        return this.model.count({ isActive: true });
    }
    async getStakeByType(stakeType) {
        return this.model.findOne({
            stakeType,
        });
    }
    async getStakeRuleByTypes(stakeTypes) {
        return this.model.find({
            stakeType: { $in: stakeTypes },
        });
    }
}
exports.StakeRuleRepository = StakeRuleRepository;
//# sourceMappingURL=stake-rule.repository.js.map