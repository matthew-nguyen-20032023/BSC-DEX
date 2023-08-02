import { Controller, Get, HttpStatus, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { IResponseToClient } from "src/configs/response-to-client.config";
import { Public } from "src/modules/authentication/auth.const";
import { TradeDto } from "src/modules/trade/dto/trade.dto";
import { TickerMessageSuccess } from "src/modules/ticker/ticker.const";
import { TickerService } from "src/modules/ticker/ticker.service";

@Controller("ticker")
@ApiBearerAuth()
@ApiTags("Ticker")
export class TickerController {
  constructor(private readonly tickerService: TickerService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: "Api get ticker",
  })
  public async getTrades(
    @Query() tradeDto: TradeDto
  ): Promise<IResponseToClient> {
    return {
      message: TickerMessageSuccess.GetTickerSuccess,
      data: 1,
      statusCode: HttpStatus.OK,
    };
  }
}
