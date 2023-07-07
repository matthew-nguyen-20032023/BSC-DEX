import { Model } from "mongoose";
import { ConfigStakeDto } from "src/modules/stake/dto/config-stake.dto";
import { WalletDocument } from "src/models/schemas/wallet.schema";
import { Hedera } from "src/blockchains/hedera";
import { Nft, NftDocument } from "src/models/schemas/nft.schema";
import { StakeRule, StakeRuleDocument } from "src/models/schemas/stake-rule.schema";
import { TransactionDocument } from "src/models/schemas/transaction.schema";
import { UserStakeInformation, UserStakeInformationDocument } from "src/models/schemas/user-stake-information.schema";
export declare class StakeService {
    private readonly walletModel;
    private readonly stakeRuleModel;
    private readonly nftModel;
    private readonly transactionModel;
    private readonly userStakeInformationModel;
    private readonly hederaLib;
    private walletRepository;
    private nftRepository;
    private stakeRuleRepository;
    private transactionRepository;
    private userStakeInformationRepository;
    constructor(walletModel: Model<WalletDocument>, stakeRuleModel: Model<StakeRuleDocument>, nftModel: Model<NftDocument>, transactionModel: Model<TransactionDocument>, userStakeInformationModel: Model<UserStakeInformationDocument>, hederaLib: Hedera);
    configStakeRule(configStakeDto: ConfigStakeDto): Promise<StakeRule>;
    getActiveConfigRule(page: number, limit: number): Promise<{
        configs: StakeRule[];
        total: number;
    }>;
    stakeNft(userId: string, nftId: string, stakeType: string): Promise<UserStakeInformation>;
    unStakeNFT(userId: string, nftId: string): Promise<Nft>;
    getNftStakeInformation(userId: string, page: number, limit: number): Promise<{
        nft: Nft;
        stakeRule: StakeRule;
        nftStakeInformation: UserStakeInformation;
    }[]>;
}
