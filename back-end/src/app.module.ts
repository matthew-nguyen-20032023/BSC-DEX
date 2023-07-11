import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DATABASE_CONFIG as db } from "src/configs/database.config";
import { AuthModule } from "src/modules/authentication/auth.module";
import { JwtStrategy } from "src/modules/authentication/jwt.strategy";
import { JwtAuthGuard } from "src/modules/authentication/jwt-auth.guard";
import { APP_GUARD } from "@nestjs/core";
import { WalletModule } from "src/modules/wallet/wallet.module";
import { NftModule } from "src/modules/nft/nft.module";
import { TransactionModule } from "src/modules/transaction/transaction.module";
import { StakeModule } from "src/modules/stake/stake.module";
import { ConsoleModule } from "nestjs-console";
import { TokenModule } from "src/modules/token/token.module";

@Module({
  imports: [
    AuthModule,
    TokenModule,
    WalletModule,
    NftModule,
    TransactionModule,
    StakeModule,
    ConsoleModule,
    MongooseModule.forRoot(
      `mongodb://${db.userName}:${db.password}@${db.host}:${db.port}/${db.databaseName}?authSource=${db.databaseName}`
    ),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
