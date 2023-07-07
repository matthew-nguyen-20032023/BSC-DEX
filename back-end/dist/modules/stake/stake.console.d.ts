import { Model } from "mongoose";
import { NftDocument } from "src/models/schemas/nft.schema";
import { TransactionDocument } from "src/models/schemas/transaction.schema";
import { Hedera } from "src/blockchains/hedera";
import { UserStakeInformationDocument } from "src/models/schemas/user-stake-information.schema";
import { StakeRuleDocument } from "src/models/schemas/stake-rule.schema";
export declare class StakeConsole {
    private readonly hederaLib;
    private readonly nftModel;
    private readonly transactionModel;
    private readonly userStakeInformationModel;
    private readonly stakeRuleModel;
    private readonly nftRepository;
    private readonly transactionRepository;
    private readonly userStakeInformationRepository;
    private readonly stakeRuleRepository;
    constructor(hederaLib: Hedera, nftModel: Model<NftDocument>, transactionModel: Model<TransactionDocument>, userStakeInformationModel: Model<UserStakeInformationDocument>, stakeRuleModel: Model<StakeRuleDocument>);
    autoCompleteStake(): Promise<void>;
}
