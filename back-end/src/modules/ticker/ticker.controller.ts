import { Controller, Get, HttpStatus, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { IResponseToClient } from "src/configs/response-to-client.config";
import { Public } from "src/modules/authentication/auth.const";
import { TickerMessageSuccess } from "src/modules/ticker/ticker.const";
import { TickerService } from "src/modules/ticker/ticker.service";
import { GetTickerDto } from "src/modules/ticker/dto/get-ticker.dto";

@Controller("ticker")
@ApiBearerAuth()
@ApiTags("Ticker")
export class TickerController {
  constructor(private readonly tickerService: TickerService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: "Api get ticker by pair id",
  })
  public async getTrades(
    @Query() getTickerDto: GetTickerDto
  ): Promise<IResponseToClient> {
    const data = await this.tickerService.getTicker24H(getTickerDto.pairId);
    return {
      message: TickerMessageSuccess.GetTickerSuccess,
      data: data,
      statusCode: HttpStatus.OK,
    };
  }
}
