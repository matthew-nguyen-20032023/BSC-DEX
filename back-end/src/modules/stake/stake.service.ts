import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ConfigStakeDto } from "src/modules/stake/dto/config-stake.dto";
import { Wallet, WalletDocument } from "src/models/schemas/wallet.schema";
import { WalletRepository } from "src/models/repositories/wallet.repository";
import { Hedera } from "src/blockchains/hedera";
import { Nft, NftDocument } from "src/models/schemas/nft.schema";
import { NftRepository } from "src/models/repositories/nft.repository";
import {
  StakeRule,
  StakeRuleDocument,
} from "src/models/schemas/stake-rule.schema";
import { StakeRuleRepository } from "src/models/repositories/stake-rule.repository";
import { TransactionRepository } from "src/models/repositories/transaction.repository";
import {
  Transaction,
  TransactionDocument,
} from "src/models/schemas/transaction.schema";
import {
  UserStakeInformation,
  UserStakeInformationDocument,
  UserStakeInformationStatus,
} from "src/models/schemas/user-stake-information.schema";
import { UserStakeInformationRepository } from "src/models/repositories/user-stake-information.repository";
import { StakeErrorMessage } from "src/modules/stake/stake.const";
import { WalletService } from "src/modules/wallet/wallet.service";
import { TransactionErrorMessage } from "src/modules/transaction/transaction.const";

@Injectable()
export class StakeService {
  private walletRepository: WalletRepository;
  private nftRepository: NftRepository;
  private stakeRuleRepository: StakeRuleRepository;
  private transactionRepository: TransactionRepository;
  private userStakeInformationRepository: UserStakeInformationRepository;

  constructor(
    @InjectModel(Wallet.name)
    private readonly walletModel: Model<WalletDocument>,
    @InjectModel(StakeRule.name)
    private readonly stakeRuleModel: Model<StakeRuleDocument>,
    @InjectModel(Nft.name)
    private readonly nftModel: Model<NftDocument>,
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
    @InjectModel(UserStakeInformation.name)
    private readonly userStakeInformationModel: Model<UserStakeInformationDocument>,
    private readonly hederaLib: Hedera
  ) {
    this.walletRepository = new WalletRepository(this.walletModel);
    this.nftRepository = new NftRepository(this.nftModel);
    this.stakeRuleRepository = new StakeRuleRepository(this.stakeRuleModel);
    this.transactionRepository = new TransactionRepository(
      this.transactionModel
    );
    this.userStakeInformationRepository = new UserStakeInformationRepository(
      this.userStakeInformationModel
    );
  }

  public async configStakeRule(
    configStakeDto: ConfigStakeDto
  ): Promise<StakeRule> {
    const existStake = await this.stakeRuleRepository.getStakeByType(
      configStakeDto.stakeType
    );
    const transaction = await this.hederaLib.configStakeRule(
      configStakeDto.stakeType,
      configStakeDto.duration,
      configStakeDto.rewardBalance,
      configStakeDto.penaltyBalance
    );
    await this.transactionRepository.save(transaction);
    if (!transaction.status) {
      throw new HttpException(
        { message: TransactionErrorMessage.FailedToExecuteTransaction },
        HttpStatus.BAD_REQUEST
      );
    }

    if (!existStake) {
      const newConfigStake = new StakeRule();
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

  public async getActiveConfigRule(
    page: number,
    limit: number
  ): Promise<{ configs: StakeRule[]; total: number }> {
    const configs = await this.stakeRuleRepository.getRecentActiveStakeRule(
      page,
      limit
    );
    const total = await this.stakeRuleRepository.countTotalActiveStakeRule();
    return { configs, total };
  }

  public async stakeNft(
    userId: string,
    nftId: string,
    stakeType: string
  ): Promise<UserStakeInformation> {
    const nft = await this.nftRepository.getNftById(nftId);
    if (!nft || nft.ownerId !== userId) {
      throw new HttpException(
        { message: StakeErrorMessage.InvalidNftForStake },
        HttpStatus.BAD_REQUEST
      );
    }

    const existStaking =
      await this.userStakeInformationRepository.getCurrentStake(userId, nftId);
    if (existStaking) {
      throw new HttpException(
        { message: StakeErrorMessage.CurrentNftStaking },
        HttpStatus.BAD_REQUEST
      );
    }

    const configStakeRule = await this.stakeRuleRepository.getStakeByType(
      stakeType
    );
    if (!configStakeRule || !configStakeRule.isActive) {
      throw new HttpException(
        { message: StakeErrorMessage.ConfigStakeRuleNotActive },
        HttpStatus.BAD_REQUEST
      );
    }

    // Change wallet to interact with hedera
    const userWallet = await this.walletRepository.getWalletByUserId(userId);
    await this.hederaLib.setOperator(
      userWallet.accountId,
      WalletService.decodeWalletPrivateKey(userWallet.privateKey)
    );

    const transaction = await this.hederaLib.stakeNFT(
      stakeType,
      nft.nftType,
      nft.tokenId
    );
    await this.transactionRepository.save(transaction);

    await this.hederaLib.setOperator(
      process.env.HEDERA_ADMIN_WALLET,
      process.env.HEDERA_ADMIN_PRIVATE_KEY
    );

    if (!transaction.status) {
      throw new HttpException(
        { message: TransactionErrorMessage.FailedToExecuteTransaction },
        HttpStatus.BAD_REQUEST
      );
    }

    const newStakeInformation = new UserStakeInformation();
    newStakeInformation.stakeType = stakeType;
    newStakeInformation.nftId = nftId;
    newStakeInformation.userId = userId;
    newStakeInformation.status = UserStakeInformationStatus.Staking;
    newStakeInformation.endTime =
      new Date().getTime() +
      Number(process.env.HEDERA_DAY_DURATION) * configStakeRule.duration * 1000;
    nft.isStake = true;
    nft.endTime = newStakeInformation.endTime;
    await this.nftRepository.save(nft);
    return this.userStakeInformationRepository.save(newStakeInformation);
  }

  public async unStakeNFT(userId: string, nftId: string): Promise<Nft> {
    const nft = await this.nftRepository.getNftById(nftId);
    if (!nft || nft.ownerId !== userId || !nft.isStake) {
      throw new HttpException(
        { message: StakeErrorMessage.InvalidNftForUnStake },
        HttpStatus.BAD_REQUEST
      );
    }
    const userWallet = await this.walletRepository.getWalletByUserId(userId);
    await this.hederaLib.setOperator(
      userWallet.accountId,
      WalletService.decodeWalletPrivateKey(userWallet.privateKey)
    );

    const unStakeTime = new Date().getTime();
    const transaction = await this.hederaLib.unStakeNft(
      nft.nftType,
      nft.tokenId
    );
    await this.transactionRepository.save(transaction);
    await this.hederaLib.setOperator(
      process.env.HEDERA_ADMIN_WALLET,
      process.env.HEDERA_ADMIN_PRIVATE_KEY
    );
    if (!transaction.status) {
      throw new HttpException(
        { message: TransactionErrorMessage.FailedToExecuteTransaction },
        HttpStatus.BAD_REQUEST
      );
    }

    const userStakeNftInformation =
      await this.userStakeInformationRepository.getCurrentStake(userId, nftId);
    const stakeRuleConfig = await this.stakeRuleRepository.getStakeByType(
      userStakeNftInformation.stakeType
    );

    nft.isStake = false;
    if (userStakeNftInformation.endTime <= unStakeTime) {
      userStakeNftInformation.status = UserStakeInformationStatus.Completed;
      nft.balance = nft.balance + stakeRuleConfig.rewardBalance;
      await this.userStakeInformationRepository.save(userStakeNftInformation);
      return this.nftRepository.save(nft);
    }

    nft.balance = nft.balance - stakeRuleConfig.penaltyBalance;
    userStakeNftInformation.status = UserStakeInformationStatus.Penalty;
    await this.userStakeInformationRepository.save(userStakeNftInformation);
    return this.nftRepository.save(nft);
  }

  public async getNftStakeInformation(
    userId: string,
    page: number,
    limit: number
  ): Promise<
    {
      nft: Nft;
      stakeRule: StakeRule;
      nftStakeInformation: UserStakeInformation;
    }[]
  > {
    const userStakeInformation =
      await this.userStakeInformationRepository.getUserStakingNftInformation(
        userId,
        page,
        limit
      );

    if (userStakeInformation.length === 0) return [];

    const nftIds = userStakeInformation.map((e) => e.nftId);
    const stakeTypes = userStakeInformation.map((e) => e.stakeType);

    const nfts = await this.nftRepository.getNftByIds(nftIds);
    const stakeRules = await this.stakeRuleRepository.getStakeRuleByTypes(
      stakeTypes
    );

    const dataReturn = [];

    for (const stakeInformation of userStakeInformation) {
      dataReturn.push({
        nft: nfts.find((e) => e._id.toString() === stakeInformation.nftId),
        stakeRule: stakeRules.find(
          (e) => e.stakeType === stakeInformation.stakeType
        ),
        nftStakeInformation: stakeInformation,
      });
    }
    return dataReturn;
  }
}
