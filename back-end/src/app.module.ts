import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConsoleModule } from "nestjs-console";
import { APP_GUARD } from "@nestjs/core";

import { DATABASE_CONFIG as db } from "src/configs/database.config";
import { AuthModule } from "src/modules/authentication/auth.module";
import { JwtStrategy } from "src/modules/authentication/jwt.strategy";
import { JwtAuthGuard } from "src/modules/authentication/jwt-auth.guard";
import { TokenModule } from "src/modules/token/token.module";
import { PairModule } from "src/modules/pair/pair.module";
import { OrderModule } from "src/modules/order/order.module";
import { TradeModule } from "src/modules/trade/trade.module";
import { SeedModule } from "src/modules/seed/seed.module";

@Module({
  imports: [
    AuthModule,
    TokenModule,
    PairModule,
    ConsoleModule,
    OrderModule,
    TradeModule,
    SeedModule,
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
