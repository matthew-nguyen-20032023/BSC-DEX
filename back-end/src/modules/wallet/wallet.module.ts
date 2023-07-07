import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WalletService } from "src/modules/wallet/wallet.service";
import { WalletController } from "src/modules/wallet/wallet.controller";
import { Wallet, WalletSchema } from "src/models/schemas/wallet.schema";
import { Hedera } from "src/blockchains/hedera";
import { Nft, NftSchema } from "src/models/schemas/nft.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema },
      { name: Nft.name, schema: NftSchema },
    ]),
  ],
  controllers: [WalletController],
  providers: [WalletService, Hedera],
})
export class WalletModule {}
