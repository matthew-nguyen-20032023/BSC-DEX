import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { IResponseToClient } from "src/configs/response-to-client.config";
import { PairService } from "src/modules/pair/pair.service";
import { CreatePairDto } from "src/modules/pair/dto/create-pair.dto";
import { PairMessageSuccess } from "src/modules/pair/pair.const";
import { ListPairDto } from "src/modules/pair/dto/list-pair.dto";
import { Public } from "src/modules/authentication/auth.const";
import { UpdatePairStatusDto } from "src/modules/pair/dto/update-pair-status.dto";

@Controller("pair")
@ApiBearerAuth()
@ApiTags("Pair")
export class PairController {
  constructor(private readonly pairService: PairService) {}

  @Post()
  @ApiOperation({
    summary:
      "Api to create pair. Only support to add token that added on api token above",
  })
  public async createPair(
    @Body() createPairDto: CreatePairDto
  ): Promise<IResponseToClient> {
    const data = await this.pairService.createPair(
      createPairDto.baseTokenAddress,
      createPairDto.quoteTokenAddress
    );
    return {
      message: PairMessageSuccess.CreatePairSuccess,
      data,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get()
  @ApiOperation({
    summary: "Api get list pair",
  })
  @Public()
  public async listPair(
    @Query() listPairDto: ListPairDto
  ): Promise<IResponseToClient> {
    const data = await this.pairService.listPair(
      listPairDto.page,
      listPairDto.limit
    );
    return {
      message: PairMessageSuccess.ListPairSuccess,
      data: data.data,
      statusCode: HttpStatus.OK,
      metadata: {
        total: data.total,
      },
    };
  }

  @Put()
  @ApiOperation({
    summary:
      "Update pair status. Use to disable one pair, the pair will disable not display, but all data still keep and you can active again for user to continue to trade",
  })
  @Public()
  public async disablePair(
    @Body() updatePairStatusDto: UpdatePairStatusDto
  ): Promise<IResponseToClient> {
    const data = await this.pairService.disablePair(
      updatePairStatusDto.pairId,
      updatePairStatusDto.status
    );
    return {
      message: PairMessageSuccess.DisablePairSuccess,
      data: data,
      statusCode: HttpStatus.OK,
    };
  }
}
