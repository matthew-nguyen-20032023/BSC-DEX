import { Controller, Get, HttpStatus, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { IResponseToClient } from "src/configs/response-to-client.config";
import { Public } from "src/modules/authentication/auth.const";
import { TradeService } from "src/modules/trade/trade.service";
import { TradeMessageSuccess } from "src/modules/trade/trade.const";
import { TradeDto } from "src/modules/trade/dto/trade.dto";

@Controller("trade")
@ApiBearerAuth()
@ApiTags("Trade")
export class TradeController {
  constructor(private readonly tradeService: TradeService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: "Api get trades",
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
}
