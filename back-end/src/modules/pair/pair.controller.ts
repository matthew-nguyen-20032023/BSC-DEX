import { Body, Controller, Get, HttpStatus, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { IResponseToClient } from "src/configs/response-to-client.config";
import { PairService } from "src/modules/pair/pair.service";
import { CreatePairDto } from "src/modules/pair/dto/create-pair.dto";
import { PairMessageSuccess } from "src/modules/pair/pair.const";
import { ListPairDto } from "./dto/list-pair.dto";

@Controller("pair")
@ApiBearerAuth()
@ApiTags("Pair")
export class PairController {
  constructor(private readonly pairService: PairService) {}

  @Post()
  @ApiOperation({
    summary: "Api to create pair",
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
}
