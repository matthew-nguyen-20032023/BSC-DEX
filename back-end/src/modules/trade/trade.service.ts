import { MyTradeDto } from "./dto/my-trade.dto";

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
import { OHLCV, OHLCVType } from "src/models/schemas/ohlcv.schema";

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
    dataConvert["12h"] = 43200000;
    dataConvert["1d"] = 86400000;
    dataConvert["3d"] = 259200000;
    dataConvert["1w"] = 604800000;
    return dataConvert[ohlcvTypeInterval]
      ? dataConvert[ohlcvTypeInterval]
      : null;
  }

  /**
   * @description round down the time of trade follow OHLCV rule
   * @param trade
   * @param ohlcvType
   */
  public static roundDownTimeByOHLCVRules(
    trade: Trade,
    ohlcvType: OHLCVType
  ): number {
    // round down to exactly minute
    const roundDownTradeTimestamp = Math.floor(trade.timestamp / 60000) * 60000;
    const tradeTimestamp = new Date(roundDownTradeTimestamp);
    // round down to exactly rule of ohlcv
    const roundedMinutes =
      Math.floor(tradeTimestamp.getMinutes() / ohlcvType) * ohlcvType;
    tradeTimestamp.setMinutes(roundedMinutes);
    tradeTimestamp.setSeconds(0);
    // return timestamp rounded
    return tradeTimestamp.getTime();
  }

  public static combineOHLCVWithTrade(
    currentOHLCV: OHLCV,
    trade: Trade,
    ohlvcType: OHLCVType
  ): { data: OHLCV; isNext: boolean } {
    const tradeTimestamp = TradeService.roundDownTimeByOHLCVRules(
      trade,
      ohlvcType
    );

    // No ohlvc or new trade have new timestamp
    if (!currentOHLCV || tradeTimestamp > currentOHLCV.timestamp) {
      const newOHLCV = new OHLCV();
      newOHLCV.pairId = trade.pairId;
      newOHLCV.ohlcvType = ohlvcType;
      newOHLCV.timestamp = tradeTimestamp;
      newOHLCV.open = trade.price;
      newOHLCV.high = trade.price;
      newOHLCV.low = trade.price;
      newOHLCV.close = trade.price;
      newOHLCV.volume = new BigNumber(trade.volume)
        .div(new BigNumber(10).pow(18))
        .toFixed(2);
      return {
        data: newOHLCV,
        isNext: true,
      };
    }

    // Update current ohlvc
    if (new BigNumber(currentOHLCV.high).lt(trade.price))
      currentOHLCV.high = trade.price;
    if (new BigNumber(currentOHLCV.low).gt(trade.price))
      currentOHLCV.low = trade.price;
    currentOHLCV.close = trade.price;
    currentOHLCV.volume = new BigNumber(currentOHLCV.volume)
      .plus(new BigNumber(trade.volume).div(new BigNumber(10).pow(18)))
      .toFixed(2);
    return {
      data: currentOHLCV,
      isNext: false,
    };
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
    let roundDownTradeTimestamp =
      Math.floor(trades[0].timestamp / (60 * 1000)) * 60 * 1000;
    let currentIntervalStart = roundDownTradeTimestamp;
    let openPrice = trades[0].price;
    let highPrice = trades[0].price;
    let lowPrice = trades[0].price;
    let closePrice = trades[0].price;
    let volume = "0";

    for (const trade of trades) {
      roundDownTradeTimestamp =
        Math.floor(trade.timestamp / (60 * 1000)) * 60 * 1000;
      if (roundDownTradeTimestamp <= currentIntervalStart) {
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
          timestamp: roundDownTradeTimestamp,
          open: openPrice,
          high: highPrice,
          low: lowPrice,
          close: closePrice,
          volume: new BigNumber(volume)
            .div(new BigNumber(10).pow(18))
            .toFixed(),
        });

        currentIntervalStart += ohlcvInterval;
        openPrice = closePrice;
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

  public async getOriginTradesHappened(
    pairId: string,
    limit: number
  ): Promise<Trade[]> {
    return this.tradeRepository.getLatestTradeHappenedByPair(pairId, limit);
  }

  public async getMyTrades(
    myTradeDto: MyTradeDto
  ): Promise<{ data: Trade[]; total: number }> {
    const data = await this.tradeRepository.getLastTradesByWallet(
      myTradeDto.wallet,
      myTradeDto.pairId,
      myTradeDto.page,
      myTradeDto.limit
    );
    const total = await this.tradeRepository.countGetLastTradesByWallet(
      myTradeDto.wallet,
      myTradeDto.pairId
    );
    return {
      data,
      total,
    };
  }
}
