const BigNumber = require("bignumber.js");
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TradeRepository } from "src/models/repositories/trade.repository";
import { Trade, TradeDocument } from "src/models/schemas/trade.schema";
import { IOHLCV } from "src/modules/trade/trade.interface";
import { TradeDto } from "src/modules/trade/dto/trade.dto";
import {
  OHLCVTypeInterval,
  TradeMessageError,
} from "src/modules/trade/trade.const";

@Injectable()
export class TradeService {
  private tradeRepository: TradeRepository;

  constructor(
    @InjectModel(Trade.name)
    private readonly tradeModel: Model<TradeDocument>
  ) {
    this.tradeRepository = new TradeRepository(this.tradeModel);
  }

  /**
   * @description: convert interval 1m, 5m, 1h, 1d,.... to milliseconds
   * @param ohlcvTypeInterval
   * @private
   */
  private static convertToMilliseconds(
    ohlcvTypeInterval: OHLCVTypeInterval
  ): Promise<number> {
    const dataConvert = [];
    dataConvert["1m"] = 60000;
    dataConvert["3m"] = 180000;
    dataConvert["5m"] = 300000;
    dataConvert["15m"] = 900000;
    dataConvert["30m"] = 1800000;
    dataConvert["1h"] = 3600000;
    dataConvert["2h"] = 7200000;
    dataConvert["4h"] = 14400000;
    dataConvert["8h"] = 28800000;
    dataConvert["15h"] = 54000000;
    dataConvert["1d"] = 86400000;
    dataConvert["3d"] = 259200000;
    dataConvert["1w"] = 604800000;
    return dataConvert[ohlcvTypeInterval]
      ? dataConvert[ohlcvTypeInterval]
      : null;
  }

  public async getTrades(tradeDto: TradeDto): Promise<IOHLCV[]> {
    const trades = await this.tradeRepository.getTradesFromToByPair(
      tradeDto.pairId,
      tradeDto.fromTimestamp,
      tradeDto.toTimestamp
    );
    if (trades.length === 0) return [];

    const ohlcvInterval = await TradeService.convertToMilliseconds(
      tradeDto.ohlcvTypeInterval
    );
    if (!ohlcvInterval) {
      throw new HttpException(
        { message: TradeMessageError.InvalidIntervalType },
        HttpStatus.BAD_REQUEST
      );
    }

    const ohlcv: IOHLCV[] = [];
    let currentIntervalStart = trades[0].timestamp + ohlcvInterval;
    let openPrice = trades[0].price;
    let highPrice = trades[0].price;
    let lowPrice = trades[0].price;
    let closePrice = trades[0].price;
    let volume = "0";

    for (const trade of trades) {
      if (trade.timestamp <= currentIntervalStart) {
        highPrice = new BigNumber(highPrice).lt(trade.price)
          ? trade.price
          : highPrice;
        lowPrice = new BigNumber(lowPrice).gt(trade.price)
          ? trade.price
          : lowPrice;
        closePrice = trade.price;
        volume = new BigNumber(volume).plus(trade.volume).toFixed();
      } else {
        ohlcv.push({
          timestamp: currentIntervalStart,
          open: openPrice,
          high: highPrice,
          low: lowPrice,
          close: closePrice,
          volume: new BigNumber(volume)
            .div(new BigNumber(10).pow(18))
            .toFixed(),
        });

        currentIntervalStart += ohlcvInterval;
        openPrice = trade.price;
        highPrice = trade.price;
        lowPrice = trade.price;
        closePrice = trade.price;
        volume = new BigNumber(trade.volume).toFixed();
      }
    }

    ohlcv.push({
      timestamp: currentIntervalStart,
      open: openPrice,
      high: highPrice,
      low: lowPrice,
      close: closePrice,
      volume: new BigNumber(volume).div(new BigNumber(10).pow(18)).toFixed(),
    });

    return ohlcv;
  }
}
