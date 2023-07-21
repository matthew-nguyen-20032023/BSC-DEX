import { Controller, Get, HttpStatus, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { IResponseToClient } from "src/configs/response-to-client.config";
import { Public } from "src/modules/authentication/auth.const";
import { TradeService } from "src/modules/trade/trade.service";
import { TradeMessageSuccess } from "src/modules/trade/trade.const";
import { TradeDto } from "src/modules/trade/dto/trade.dto";
import { CurrentOriginTradeDto } from "src/modules/trade/dto/current-origin-trade.dto";

@Controller("trade")
@ApiBearerAuth()
@ApiTags("Trade")
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Get()
  @Public()
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

  @Get("origin")
  @Public()
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
