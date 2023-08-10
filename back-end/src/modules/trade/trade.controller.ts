import { Controller, Get, HttpStatus, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { IResponseToClient } from "src/configs/response-to-client.config";
import { Public } from "src/modules/authentication/auth.const";
import { TradeService } from "src/modules/trade/trade.service";
import { TradeMessageSuccess } from "src/modules/trade/trade.const";
import { TradeDto } from "src/modules/trade/dto/trade.dto";
import { CurrentOriginTradeDto } from "src/modules/trade/dto/current-origin-trade.dto";
import { MyTradeDto } from "src/modules/trade/dto/my-trade.dto";
import { GetOHLCVDto } from "src/modules/trade/dto/get-ohlcv.dto";

@Controller("trade")
@Public()
@ApiTags("Trade")
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}
  @Get("ohlcv")
  @ApiOperation({
    summary: "Api get ohlcv calculated",
  })
  public async getOHLCV(
    @Query() getOHLCVDto: GetOHLCVDto
  ): Promise<IResponseToClient> {
    const data = await this.tradeService.getOHLCV(getOHLCVDto);
    return {
      message: TradeMessageSuccess.GetOHLCVSuccess,
      data: data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get()
  @ApiOperation({
    summary:
      "Api get trades to draw chart format open, high, low, close, volume",
  })
  public async getTrades(
    @Query() tradeDto: TradeDto
  ): Promise<IResponseToClient> {
    const data = await this.tradeService.getTrades(tradeDto);
    return {
      message: TradeMessageSuccess.GetTradesSuccess,
      data: data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get("my-trades")
  @ApiOperation({
    summary: "Api get user trade base on wallet address",
  })
  public async getMyTrades(
    @Query() myTradeDto: MyTradeDto
  ): Promise<IResponseToClient> {
    const data = await this.tradeService.getMyTrades(myTradeDto);
    return {
      message: TradeMessageSuccess.GetWalletTradesSuccess,
      data: data.data,
      statusCode: HttpStatus.OK,
      metadata: {
        total: data.total,
      },
    };
  }

  @Get("origin")
  @ApiOperation({
    summary:
      "Api get trades origin to display current trades happened (Not use for draw chart)",
  })
  public async getTradesOrigin(
    @Query() currentOriginTradeDto: CurrentOriginTradeDto
  ): Promise<IResponseToClient> {
    const data = await this.tradeService.getOriginTradesHappened(
      currentOriginTradeDto.pairId,
      currentOriginTradeDto.limit
    );
    return {
      message: TradeMessageSuccess.GetOriginTradesSuccess,
      data: data,
      statusCode: HttpStatus.OK,
    };
  }
}
