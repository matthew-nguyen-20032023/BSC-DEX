import { Command, Console } from "nestjs-console";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { UserRepository } from "src/models/repositories/user.repository";
import { User, UserDocument, UserRole } from "src/models/schemas/user.schema";
import * as bcrypt from "bcrypt";
import { Trade, TradeDocument } from "src/models/schemas/trade.schema";
import { Token, TokenDocument } from "src/models/schemas/token.schema";
import { Pair, PairDocument, PairStatus } from "src/models/schemas/pair.schema";
import { Order, OrderDocument } from "src/models/schemas/order.schema";
import { EventDocument } from "src/models/schemas/event.schema";
import { TradeRepository } from "src/models/repositories/trade.repository";
import { TokenRepository } from "src/models/repositories/token.repository";
import { PairRepository } from "src/models/repositories/pair.repository";
import { OrderRepository } from "src/models/repositories/order.repository";
import { EventRepository } from "src/models/repositories/event.repository";
import { Binance } from "src/blockchains/binance";

@Console()
export class SeedConsole {
  private userRepository: UserRepository;
  private tradeRepository: TradeRepository;
  private tokenRepository: TokenRepository;
  private pairRepository: PairRepository;
  private orderRepository: OrderRepository;
  private eventRepository: EventRepository;

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Trade.name)
    private readonly tradeModel: Model<TradeDocument>,
    @InjectModel(Token.name)
    private readonly tokenModel: Model<TokenDocument>,
    @InjectModel(Pair.name)
    private readonly pairModel: Model<PairDocument>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>
  ) {
    this.userRepository = new UserRepository(this.userModel);
    this.tradeRepository = new TradeRepository(this.tradeModel);
    this.tokenRepository = new TokenRepository(this.tokenModel);
    this.pairRepository = new PairRepository(this.pairModel);
    this.orderRepository = new OrderRepository(this.orderModel);
    this.eventRepository = new EventRepository(this.eventModel);
  }

  private async deleteAllDataOnDatabase(): Promise<void> {
    await this.userRepository.deleteAll();
    await this.tradeRepository.deleteAll();
    await this.tokenRepository.deleteAll();
    await this.pairRepository.deleteAll();
    await this.orderRepository.deleteAll();
    await this.eventRepository.deleteAll();
  }

  private async seedAdminUser(): Promise<void> {
    const newUser = new User();
    newUser.email = process.env.ADMIN_EMAIL;
    newUser.password = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      Number(process.env.SALT_OR_ROUNDS)
    );
    newUser.role = UserRole.Admin;
    await this.userRepository.save(newUser);
  }

  private async seedTokens(): Promise<void> {
    const baseTokenInformation = await Binance.getInstance().getERC20TokenInfo(
      process.env.BASE_TOKEN_FOR_TEST
    );
    const newBaseToken = new Token();
    newBaseToken.name = baseTokenInformation.name;
    newBaseToken.symbol = baseTokenInformation.symbol;
    newBaseToken.decimals = baseTokenInformation.decimals;
    newBaseToken.address = process.env.BASE_TOKEN_FOR_TEST.toLowerCase();
    await this.tokenRepository.save(newBaseToken);

    const quoteTokenInformation = await Binance.getInstance().getERC20TokenInfo(
      process.env.QUOTE_TOKEN_FOR_TEST
    );
    const newQuoteToken = new Token();
    newQuoteToken.name = quoteTokenInformation.name;
    newQuoteToken.symbol = quoteTokenInformation.symbol;
    newQuoteToken.decimals = quoteTokenInformation.decimals;
    newQuoteToken.address = process.env.QUOTE_TOKEN_FOR_TEST.toLowerCase();
    await this.tokenRepository.save(newQuoteToken);
  }

  private async seedPair(): Promise<void> {
    const baseToken = await this.tokenRepository.getTokenByAddress(
      process.env.BASE_TOKEN_FOR_TEST.toLowerCase()
    );
    const quoteToken = await this.tokenRepository.getTokenByAddress(
      process.env.QUOTE_TOKEN_FOR_TEST.toLowerCase()
    );
    const newPair = new Pair();
    newPair.name = `${baseToken.symbol} / ${quoteToken.symbol}`;
    newPair.baseTokenAddress = baseToken.address;
    newPair.quoteTokenAddress = quoteToken.address;
    newPair.status = PairStatus.Active;
    await this.pairRepository.save(newPair);
  }

  @Command({ command: "seed-data-for-test" })
  async seedDataForTest(): Promise<void> {
    await this.deleteAllDataOnDatabase();
    await this.seedAdminUser();
    await this.seedTokens();
    await this.seedPair();
    console.log("Seeding data done. Exist process seeding");
    process.exit();
  }
}
