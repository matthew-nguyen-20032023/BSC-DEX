import { Model } from "mongoose";
import { StakeRule, StakeRuleDocument } from "src/models/schemas/stake-rule.schema";
export declare class StakeRuleRepository {
    private readonly model;
    constructor(model: Model<StakeRuleDocument>);
    save(stakeRule: StakeRule): Promise<StakeRule>;
    getRecentActiveStakeRule(page: number, limit: number): Promise<StakeRule[]>;
    countTotalActiveStakeRule(): Promise<number>;
    getStakeByType(stakeType: string): Promise<StakeRule>;
    getStakeRuleByTypes(stakeTypes: string[]): Promise<StakeRule[]>;
}
