"use strict";
var StakeConsole_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakeConsole = void 0;
const tslib_1 = require("tslib");
const nestjs_console_1 = require("nestjs-console");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const nft_schema_1 = require("../../models/schemas/nft.schema");
const nft_repository_1 = require("../../models/repositories/nft.repository");
const transaction_repository_1 = require("../../models/repositories/transaction.repository");
const transaction_schema_1 = require("../../models/schemas/transaction.schema");
const hedera_1 = require("../../blockchains/hedera");
const common_1 = require("../../helper/common");
const user_stake_information_repository_1 = require("../../models/repositories/user-stake-information.repository");
const user_stake_information_schema_1 = require("../../models/schemas/user-stake-information.schema");
const stake_rule_repository_1 = require("../../models/repositories/stake-rule.repository");
const stake_rule_schema_1 = require("../../models/schemas/stake-rule.schema");
let StakeConsole = StakeConsole_1 = class StakeConsole {
    constructor(hederaLib, nftModel, transactionModel, userStakeInformationModel, stakeRuleModel) {
        this.hederaLib = hederaLib;
        this.nftModel = nftModel;
        this.transactionModel = transactionModel;
        this.userStakeInformationModel = userStakeInformationModel;
        this.stakeRuleModel = stakeRuleModel;
        this.nftRepository = new nft_repository_1.NftRepository(this.nftModel);
        this.transactionRepository = new transaction_repository_1.TransactionRepository(this.transactionModel);
        this.userStakeInformationRepository = new user_stake_information_repository_1.UserStakeInformationRepository(this.userStakeInformationModel);
        this.stakeRuleRepository = new stake_rule_repository_1.StakeRuleRepository(this.stakeRuleModel);
    }
    async autoCompleteStake() {
        while (1) {
            const completeStakeNFT = await this.userStakeInformationRepository.getCompleteStakeNft(new Date().getTime());
            if (completeStakeNFT.length === 0) {
                console.log(`${StakeConsole_1.name}: No complete stake NFT found at: ${new Date()}`);
                await (0, common_1.sleep)(10000);
                continue;
            }
            console.log(`${StakeConsole_1.name}: Got ${completeStakeNFT.length} stake complete need to handle`);
            for (const stakeComplete of completeStakeNFT) {
                const nft = await this.nftRepository.getNftById(stakeComplete.nftId);
                const configRule = await this.stakeRuleRepository.getStakeByType(stakeComplete.stakeType);
                const transaction = await this.hederaLib.unStakeNft(nft.nftType, nft.tokenId);
                await this.transactionRepository.save(transaction);
                if (!transaction.status) {
                    console.log(`${StakeConsole_1.name}: Failed to handle NFT id ${nft._id.toString()}`);
                    stakeComplete.status = user_stake_information_schema_1.UserStakeInformationStatus.FailedToComplete;
                    await this.userStakeInformationRepository.save(stakeComplete);
                    continue;
                }
                nft.balance = nft.balance + configRule.rewardBalance;
                nft.isStake = false;
                stakeComplete.status = user_stake_information_schema_1.UserStakeInformationStatus.Completed;
                await this.nftRepository.save(nft);
                await this.userStakeInformationRepository.save(stakeComplete);
            }
            console.log(`======================Complete Handle=============================`);
            await (0, common_1.sleep)(10000);
        }
    }
};
tslib_1.__decorate([
    (0, nestjs_console_1.Command)({ command: "auto-complete-stake" }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], StakeConsole.prototype, "autoCompleteStake", null);
StakeConsole = StakeConsole_1 = tslib_1.__decorate([
    (0, nestjs_console_1.Console)(),
    tslib_1.__param(1, (0, mongoose_1.InjectModel)(nft_schema_1.Nft.name)),
    tslib_1.__param(2, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    tslib_1.__param(3, (0, mongoose_1.InjectModel)(user_stake_information_schema_1.UserStakeInformation.name)),
    tslib_1.__param(4, (0, mongoose_1.InjectModel)(stake_rule_schema_1.StakeRule.name)),
    tslib_1.__metadata("design:paramtypes", [hedera_1.Hedera,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], StakeConsole);
exports.StakeConsole = StakeConsole;
//# sourceMappingURL=stake.console.js.map