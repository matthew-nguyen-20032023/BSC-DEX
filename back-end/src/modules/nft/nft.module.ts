import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Wallet, WalletSchema } from "src/models/schemas/wallet.schema";
import { Hedera } from "src/blockchains/hedera";
import { NftController } from "src/modules/nft/nft.controller";
import { NftService } from "src/modules/nft/nft.service";
import { NftType, NftTypeSchema } from "src/models/schemas/nft-type.schema";
import { Nft, NftSchema } from "src/models/schemas/nft.schema";
import {
  WalletAssociateToken,
  WalletAssociateTokenSchema,
} from "src/models/schemas/wallet_associate_token.schema";
import { User, UserSchema } from "src/models/schemas/user.schema";
import {
  Transaction,
  TransactionSchema,
} from "src/models/schemas/transaction.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: NftType.name, schema: NftTypeSchema },
      { name: Nft.name, schema: NftSchema },
      { name: WalletAssociateToken.name, schema: WalletAssociateTokenSchema },
      { name: User.name, schema: UserSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [NftController],
  providers: [NftService, Hedera],
})
export class NftModule {}
