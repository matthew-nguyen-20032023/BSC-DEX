import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Wallet, WalletSchema } from "src/models/schemas/wallet.schema";
import { Hedera } from "src/blockchains/hedera";
import { Nft, NftSchema } from "src/models/schemas/nft.schema";
import { StakeController } from "src/modules/stake/stake.controller";
import { StakeService } from "src/modules/stake/stake.service";
import {
  StakeRule,
  StakeRuleSchema,
} from "src/models/schemas/stake-rule.schema";
import {
  Transaction,
  TransactionSchema,
} from "src/models/schemas/transaction.schema";
import {
  UserStakeInformation,
  UserStakeInformationSchema,
} from "src/models/schemas/user-stake-information.schema";
import { StakeConsole } from "src/modules/stake/stake.console";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: Nft.name, schema: NftSchema },
      { name: StakeRule.name, schema: StakeRuleSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: UserStakeInformation.name, schema: UserStakeInformationSchema },
    ]),
  ],
  controllers: [StakeController],
  providers: [StakeService, Hedera, StakeConsole],
})
export class StakeModule {}
