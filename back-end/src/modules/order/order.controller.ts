import { Body, Controller, Get, HttpStatus, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "src/modules/authentication/auth.const";
import { IResponseToClient } from "src/configs/response-to-client.config";
import { OrderService } from "src/modules/order/order.service";
import { OrderMessageSuccess } from "src/modules/order/order.const";
import { CreateOrderDto } from "src/modules/order/dto/create-order.dto";
import { ListOrderDto } from "src/modules/order/dto/list-order.dto";
import { ListOrderBookDto } from "src/modules/order/dto/list-order-book.dto";
import { EstimateAllowanceDto } from "src/modules/order/dto/estimate-allowance.dto";
import { GetMatchOrdersDto } from "src/modules/order/dto/get-match-orders.dto";

@Controller("order")
@Public()
@ApiTags("Order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({
    summary: "Api to create limit order (use to create off-chain order only)",
  })
  public async createOrder(
    @Body() createOrderDto: CreateOrderDto
  ): Promise<IResponseToClient> {
    const data = await this.orderService.createOrder(createOrderDto);
    return {
      message: OrderMessageSuccess.OrderCreated,
      data,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get()
  @ApiOperation({
    summary: "Api to list best order offer by conditions",
  })
  public async listOrder(
    @Query() listOrderDto: ListOrderDto
  ): Promise<IResponseToClient> {
    const data = await this.orderService.listOrder(listOrderDto);
    return {
      message: OrderMessageSuccess.ListOrderSuccess,
      data: data.data,
      statusCode: HttpStatus.OK,
      metadata: {
        total: data.total,
      },
    };
  }

  @Get("estimate-allowance")
  @ApiOperation({
    summary:
      "Api to estimate maker amount to approve when you create multiple order",
  })
  public async estimateAllowance(
    @Query() estimateAllowanceDto: EstimateAllowanceDto
  ): Promise<IResponseToClient> {
    const data = await this.orderService.estimateAllowances(
      estimateAllowanceDto.maker,
      estimateAllowanceDto.makerToken
    );
    return {
      message: OrderMessageSuccess.EstimateAllowanceSuccess,
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get("match-orders")
  @ApiOperation({
    summary: "Api to get match order",
  })
  public async getMatchOrders(
    @Query() getMatchOrdersDto: GetMatchOrdersDto
  ): Promise<IResponseToClient> {
    const data = await this.orderService.getMatchOrders(
      getMatchOrdersDto.makerToken,
      getMatchOrdersDto.takerToken,
      getMatchOrdersDto.price,
      getMatchOrdersDto.amount,
      getMatchOrdersDto.orderType
    );
    return {
      message: OrderMessageSuccess.GetMatchOrderSuccess,
      data,
      statusCode: HttpStatus.OK,
    };
  }

  @Get("order-book")
  @ApiOperation({
    summary: "Api to get order-book",
  })
  public async listOrderBook(
    @Query() listOrderBookDto: ListOrderBookDto
  ): Promise<IResponseToClient> {
    const data = await this.orderService.getOrderBook(
      listOrderBookDto.pairId,
      listOrderBookDto.limit
    );
    return {
      message: OrderMessageSuccess.ListOrderBookSuccess,
      data,
      statusCode: HttpStatus.OK,
    };
  }
}
