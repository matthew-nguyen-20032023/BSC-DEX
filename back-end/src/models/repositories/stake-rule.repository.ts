import { Model } from "mongoose";
import {
  StakeRule,
  StakeRuleDocument,
} from "src/models/schemas/stake-rule.schema";

export class StakeRuleRepository {
  constructor(private readonly model: Model<StakeRuleDocument>) {}

  public async save(stakeRule: StakeRule): Promise<StakeRule> {
    const newStakeRule = new this.model(stakeRule);
    return this.model.create(newStakeRule);
  }

  public async getRecentActiveStakeRule(
    page: number,
    limit: number
  ): Promise<StakeRule[]> {
    return this.model
      .find({
        isActive: true,
      })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  public async countTotalActiveStakeRule(): Promise<number> {
    return this.model.count({ isActive: true });
  }

  public async getStakeByType(stakeType: string): Promise<StakeRule> {
    return this.model.findOne({
      stakeType,
    });
  }

  public async getStakeRuleByTypes(stakeTypes: string[]): Promise<StakeRule[]> {
    return this.model.find({
      stakeType: { $in: stakeTypes },
    });
  }
}
