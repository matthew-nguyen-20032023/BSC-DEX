"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakeService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const wallet_schema_1 = require("../../models/schemas/wallet.schema");
const wallet_repository_1 = require("../../models/repositories/wallet.repository");
const hedera_1 = require("../../blockchains/hedera");
const nft_schema_1 = require("../../models/schemas/nft.schema");
const nft_repository_1 = require("../../models/repositories/nft.repository");
const stake_rule_schema_1 = require("../../models/schemas/stake-rule.schema");
const stake_rule_repository_1 = require("../../models/repositories/stake-rule.repository");
const transaction_repository_1 = require("../../models/repositories/transaction.repository");
const transaction_schema_1 = require("../../models/schemas/transaction.schema");
const user_stake_information_schema_1 = require("../../models/schemas/user-stake-information.schema");
const user_stake_information_repository_1 = require("../../models/repositories/user-stake-information.repository");
const stake_const_1 = require("./stake.const");
const wallet_service_1 = require("../wallet/wallet.service");
const transaction_const_1 = require("../transaction/transaction.const");
let StakeService = class StakeService {
    constructor(walletModel, stakeRuleModel, nftModel, transactionModel, userStakeInformationModel, hederaLib) {
        this.walletModel = walletModel;
        this.stakeRuleModel = stakeRuleModel;
        this.nftModel = nftModel;
        this.transactionModel = transactionModel;
        this.userStakeInformationModel = userStakeInformationModel;
        this.hederaLib = hederaLib;
        this.walletRepository = new wallet_repository_1.WalletRepository(this.walletModel);
        this.nftRepository = new nft_repository_1.NftRepository(this.nftModel);
        this.stakeRuleRepository = new stake_rule_repository_1.StakeRuleRepository(this.stakeRuleModel);
        this.transactionRepository = new transaction_repository_1.TransactionRepository(this.transactionModel);
        this.userStakeInformationRepository = new user_stake_information_repository_1.UserStakeInformationRepository(this.userStakeInformationModel);
    }
    async configStakeRule(configStakeDto) {
        const existStake = await this.stakeRuleRepository.getStakeByType(configStakeDto.stakeType);
        const transaction = await this.hederaLib.configStakeRule(configStakeDto.stakeType, configStakeDto.duration, configStakeDto.rewardBalance, configStakeDto.penaltyBalance);
        await this.transactionRepository.save(transaction);
        if (!transaction.status) {
            throw new common_1.HttpException({ message: transaction_const_1.TransactionErrorMessage.FailedToExecuteTransaction }, common_1.HttpStatus.BAD_REQUEST);
        }
        if (!existStake) {
            const newConfigStake = new stake_rule_schema_1.StakeRule();
            newConfigStake.stakeType = configStakeDto.stakeType;
            newConfigStake.duration = configStakeDto.duration;
            newConfigStake.rewardBalance = configStakeDto.rewardBalance;
            newConfigStake.penaltyBalance = configStakeDto.penaltyBalance;
            newConfigStake.isActive = true;
            return this.stakeRuleRepository.save(newConfigStake);
        }
        existStake.duration = configStakeDto.duration;
        existStake.rewardBalance = configStakeDto.rewardBalance;
        existStake.penaltyBalance = configStakeDto.penaltyBalance;
        existStake.isActive = true;
        return this.stakeRuleRepository.save(existStake);
    }
    async getActiveConfigRule(page, limit) {
        const configs = await this.stakeRuleRepository.getRecentActiveStakeRule(page, limit);
        const total = await this.stakeRuleRepository.countTotalActiveStakeRule();
        return { configs, total };
    }
    async stakeNft(userId, nftId, stakeType) {
        const nft = await this.nftRepository.getNftById(nftId);
        if (!nft || nft.ownerId !== userId) {
            throw new common_1.HttpException({ message: stake_const_1.StakeErrorMessage.InvalidNftForStake }, common_1.HttpStatus.BAD_REQUEST);
        }
        const existStaking = await this.userStakeInformationRepository.getCurrentStake(userId, nftId);
        if (existStaking) {
            throw new common_1.HttpException({ message: stake_const_1.StakeErrorMessage.CurrentNftStaking }, common_1.HttpStatus.BAD_REQUEST);
        }
        const configStakeRule = await this.stakeRuleRepository.getStakeByType(stakeType);
        if (!configStakeRule || !configStakeRule.isActive) {
            throw new common_1.HttpException({ message: stake_const_1.StakeErrorMessage.ConfigStakeRuleNotActive }, common_1.HttpStatus.BAD_REQUEST);
        }
        const userWallet = await this.walletRepository.getWalletByUserId(userId);
        await this.hederaLib.setOperator(userWallet.accountId, wallet_service_1.WalletService.decodeWalletPrivateKey(userWallet.privateKey));
        const transaction = await this.hederaLib.stakeNFT(stakeType, nft.nftType, nft.tokenId);
        await this.transactionRepository.save(transaction);
        await this.hederaLib.setOperator(process.env.HEDERA_ADMIN_WALLET, process.env.HEDERA_ADMIN_PRIVATE_KEY);
        if (!transaction.status) {
            throw new common_1.HttpException({ message: transaction_const_1.TransactionErrorMessage.FailedToExecuteTransaction }, common_1.HttpStatus.BAD_REQUEST);
        }
        const newStakeInformation = new user_stake_information_schema_1.UserStakeInformation();
        newStakeInformation.stakeType = stakeType;
        newStakeInformation.nftId = nftId;
        newStakeInformation.userId = userId;
        newStakeInformation.status = user_stake_information_schema_1.UserStakeInformationStatus.Staking;
        newStakeInformation.endTime =
            new Date().getTime() +
                Number(process.env.HEDERA_DAY_DURATION) * configStakeRule.duration * 1000;
        nft.isStake = true;
        nft.endTime = newStakeInformation.endTime;
        await this.nftRepository.save(nft);
        return this.userStakeInformationRepository.save(newStakeInformation);
    }
    async unStakeNFT(userId, nftId) {
        const nft = await this.nftRepository.getNftById(nftId);
        if (!nft || nft.ownerId !== userId || !nft.isStake) {
            throw new common_1.HttpException({ message: stake_const_1.StakeErrorMessage.InvalidNftForUnStake }, common_1.HttpStatus.BAD_REQUEST);
        }
        const userWallet = await this.walletRepository.getWalletByUserId(userId);
        await this.hederaLib.setOperator(userWallet.accountId, wallet_service_1.WalletService.decodeWalletPrivateKey(userWallet.privateKey));
        const unStakeTime = new Date().getTime();
        const transaction = await this.hederaLib.unStakeNft(nft.nftType, nft.tokenId);
        await this.transactionRepository.save(transaction);
        await this.hederaLib.setOperator(process.env.HEDERA_ADMIN_WALLET, process.env.HEDERA_ADMIN_PRIVATE_KEY);
        if (!transaction.status) {
            throw new common_1.HttpException({ message: transaction_const_1.TransactionErrorMessage.FailedToExecuteTransaction }, common_1.HttpStatus.BAD_REQUEST);
        }
        const userStakeNftInformation = await this.userStakeInformationRepository.getCurrentStake(userId, nftId);
        const stakeRuleConfig = await this.stakeRuleRepository.getStakeByType(userStakeNftInformation.stakeType);
        nft.isStake = false;
        if (userStakeNftInformation.endTime <= unStakeTime) {
            userStakeNftInformation.status = user_stake_information_schema_1.UserStakeInformationStatus.Completed;
            nft.balance = nft.balance + stakeRuleConfig.rewardBalance;
            await this.userStakeInformationRepository.save(userStakeNftInformation);
            return this.nftRepository.save(nft);
        }
        nft.balance = nft.balance - stakeRuleConfig.penaltyBalance;
        userStakeNftInformation.status = user_stake_information_schema_1.UserStakeInformationStatus.Penalty;
        await this.userStakeInformationRepository.save(userStakeNftInformation);
        return this.nftRepository.save(nft);
    }
    async getNftStakeInformation(userId, page, limit) {
        const userStakeInformation = await this.userStakeInformationRepository.getUserStakingNftInformation(userId, page, limit);
        if (userStakeInformation.length === 0)
            return [];
        const nftIds = userStakeInformation.map((e) => e.nftId);
        const stakeTypes = userStakeInformation.map((e) => e.stakeType);
        const nfts = await this.nftRepository.getNftByIds(nftIds);
        const stakeRules = await this.stakeRuleRepository.getStakeRuleByTypes(stakeTypes);
        const dataReturn = [];
        for (const stakeInformation of userStakeInformation) {
            dataReturn.push({
                nft: nfts.find((e) => e._id.toString() === stakeInformation.nftId),
                stakeRule: stakeRules.find((e) => e.stakeType === stakeInformation.stakeType),
                nftStakeInformation: stakeInformation,
            });
        }
        return dataReturn;
    }
};
StakeService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(wallet_schema_1.Wallet.name)),
    tslib_1.__param(1, (0, mongoose_1.InjectModel)(stake_rule_schema_1.StakeRule.name)),
    tslib_1.__param(2, (0, mongoose_1.InjectModel)(nft_schema_1.Nft.name)),
    tslib_1.__param(3, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    tslib_1.__param(4, (0, mongoose_1.InjectModel)(user_stake_information_schema_1.UserStakeInformation.name)),
    tslib_1.__metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        hedera_1.Hedera])
], StakeService);
exports.StakeService = StakeService;
//# sourceMappingURL=stake.service.js.map