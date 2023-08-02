const BigNumber = require("bignumber.js");
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TradeRepository } from "src/models/repositories/trade.repository";
import { Trade, TradeDocument } from "src/models/schemas/trade.schema";

@Injectable()
export class TickerService {
  private tradeRepository: TradeRepository;

  constructor(
    @InjectModel(Trade.name)
    private readonly tradeModel: Model<TradeDocument>
  ) {
    this.tradeRepository = new TradeRepository(this.tradeModel);
  }
}
