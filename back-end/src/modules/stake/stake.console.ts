import { Command, Console } from "nestjs-console";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Nft, NftDocument } from "src/models/schemas/nft.schema";
import { NftRepository } from "src/models/repositories/nft.repository";
import { TransactionRepository } from "src/models/repositories/transaction.repository";
import {
  Transaction,
  TransactionDocument,
} from "src/models/schemas/transaction.schema";
import { Hedera } from "src/blockchains/hedera";
import { sleep } from "src/helper/common";
import { UserStakeInformationRepository } from "src/models/repositories/user-stake-information.repository";
import {
  UserStakeInformation,
  UserStakeInformationDocument,
  UserStakeInformationStatus,
} from "src/models/schemas/user-stake-information.schema";
import { StakeRuleRepository } from "src/models/repositories/stake-rule.repository";
import {
  StakeRule,
  StakeRuleDocument,
} from "src/models/schemas/stake-rule.schema";

@Console()
export class StakeConsole {
  private readonly nftRepository: NftRepository;
  private readonly transactionRepository: TransactionRepository;
  private readonly userStakeInformationRepository: UserStakeInformationRepository;
  private readonly stakeRuleRepository: StakeRuleRepository;
  constructor(
    private readonly hederaLib: Hedera,
    @InjectModel(Nft.name)
    private readonly nftModel: Model<NftDocument>,
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
    @InjectModel(UserStakeInformation.name)
    private readonly userStakeInformationModel: Model<UserStakeInformationDocument>,
    @InjectModel(StakeRule.name)
    private readonly stakeRuleModel: Model<StakeRuleDocument>
  ) {
    this.nftRepository = new NftRepository(this.nftModel);
    this.transactionRepository = new TransactionRepository(
      this.transactionModel
    );
    this.userStakeInformationRepository = new UserStakeInformationRepository(
      this.userStakeInformationModel
    );
    this.stakeRuleRepository = new StakeRuleRepository(this.stakeRuleModel);
  }

  @Command({ command: "auto-complete-stake" })
  async autoCompleteStake(): Promise<void> {
    while (1) {
      const completeStakeNFT =
        await this.userStakeInformationRepository.getCompleteStakeNft(
          new Date().getTime()
        );

      if (completeStakeNFT.length === 0) {
        console.log(
          `${StakeConsole.name}: No complete stake NFT found at: ${new Date()}`
        );
        await sleep(10000);
        continue;
      }
      console.log(
        `${StakeConsole.name}: Got ${completeStakeNFT.length} stake complete need to handle`
      );

      for (const stakeComplete of completeStakeNFT) {
        const nft = await this.nftRepository.getNftById(stakeComplete.nftId);
        const configRule = await this.stakeRuleRepository.getStakeByType(
          stakeComplete.stakeType
        );
        const transaction = await this.hederaLib.unStakeNft(
          nft.nftType,
          nft.tokenId
        );
        await this.transactionRepository.save(transaction);

        if (!transaction.status) {
          console.log(
            `${
              StakeConsole.name
            }: Failed to handle NFT id ${nft._id.toString()}`
          );
          stakeComplete.status = UserStakeInformationStatus.FailedToComplete;
          await this.userStakeInformationRepository.save(stakeComplete);
          continue;
        }

        nft.balance = nft.balance + configRule.rewardBalance;
        nft.isStake = false;
        stakeComplete.status = UserStakeInformationStatus.Completed;
        await this.nftRepository.save(nft);
        await this.userStakeInformationRepository.save(stakeComplete);
      }
      console.log(
        `======================Complete Handle=============================`
      );
      await sleep(10000);
    }
  }
}
