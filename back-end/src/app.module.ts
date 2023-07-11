import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConsoleModule } from "nestjs-console";
import { APP_GUARD } from "@nestjs/core";

import { DATABASE_CONFIG as db } from "src/configs/database.config";
import { AuthModule } from "src/modules/authentication/auth.module";
import { JwtStrategy } from "src/modules/authentication/jwt.strategy";
import { JwtAuthGuard } from "src/modules/authentication/jwt-auth.guard";
import { TransactionModule } from "src/modules/transaction/transaction.module";
import { TokenModule } from "src/modules/token/token.module";
import { PairModule } from "src/modules/pair/pair.module";

@Module({
  imports: [
    AuthModule,
    TokenModule,
    PairModule,
    TransactionModule,
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
