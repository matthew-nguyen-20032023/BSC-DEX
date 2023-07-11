import { Body, Controller, Get, HttpStatus, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { IResponseToClient } from "src/configs/response-to-client.config";
import { TokenService } from "src/modules/token/token.service";
import { AddTokenDto } from "src/modules/token/dto/add-token.dto";
import { TokenMessageSuccess } from "src/modules/token/token.const";
import { ListTokenDto } from "src/modules/token/dto/list-token.dto";
import { Public } from "src/modules/authentication/auth.const";
import { DetailTokenDto } from "src/modules/token/dto/detail-token.dto";

@Controller("token")
@ApiBearerAuth()
@ApiTags("Token Management")
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  @ApiOperation({
    summary: "Api to add new token.",
  })
  public async addToken(
    @Body() addTokenDto: AddTokenDto
  ): Promise<IResponseToClient> {
    const data = await this.tokenService.addToken(addTokenDto.tokenAddress);
    return {
      message: TokenMessageSuccess.AddTokenSuccess,
      data,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get("")
  @ApiOperation({
    summary: "Api list token.",
  })
  @Public()
  public async listToken(
    @Query() listTokenDto: ListTokenDto
  ): Promise<IResponseToClient> {
    const data = await this.tokenService.listToken(
      listTokenDto.page,
      listTokenDto.limit
    );
    return {
      message: TokenMessageSuccess.ListTokenSuccess,
      data: data.data,
      statusCode: HttpStatus.OK,
      metadata: {
        total: data.total,
      },
    };
  }

  @Get("/detail")
  @Public()
  @ApiOperation({
    summary: "Api to get token information by token address.",
  })
  public async getTokenByAddress(
    @Query() detailTokenDto: DetailTokenDto
  ): Promise<IResponseToClient> {
    const data = await this.tokenService.getTokenByAddress(
      detailTokenDto.tokenAddress
    );
    return {
      message: TokenMessageSuccess.GetTokenDetailSuccess,
      data,
      statusCode: HttpStatus.OK,
    };
  }
}
