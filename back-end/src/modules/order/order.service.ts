const BigNumber = require("bignumber.js");
import { plainToClass } from "class-transformer";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Model } from "mongoose";
import { OrderRepository } from "src/models/repositories/order.repository";
import {
  Order,
  OrderDocument,
  OrderStatus,
  OrderType,
} from "src/models/schemas/order.schema";
import { CreateOrderDto } from "src/modules/order/dto/create-order.dto";
import { PairRepository } from "src/models/repositories/pair.repository";
import { Pair, PairDocument } from "src/models/schemas/pair.schema";
import { PairMessageError } from "src/modules/pair/pair.const";
import { ListOrderDto } from "src/modules/order/dto/list-order.dto";

@Injectable()
export class OrderService {
  private orderRepository: OrderRepository;
  private pairRepository: PairRepository;

  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Pair.name)
    private readonly pairModel: Model<PairDocument>
  ) {
    this.orderRepository = new OrderRepository(this.orderModel);
    this.pairRepository = new PairRepository(this.pairModel);
  }

  private async getPairId(
    type: OrderType,
    makerToken: string,
    takerToken: string
  ): Promise<string> {
    const baseTokenAddress =
      type === OrderType.BuyOrder ? takerToken : makerToken;
    const quoteTokenAddress =
      type === OrderType.BuyOrder ? makerToken : takerToken;

    const existPair = await this.pairRepository.getPairByBaseQuoteToken(
      baseTokenAddress.toLowerCase(),
      quoteTokenAddress.toLowerCase()
    );
    if (!existPair) {
      throw new HttpException(
        { message: PairMessageError.PairNotFound },
        HttpStatus.BAD_REQUEST
      );
    }
    return existPair._id.toString();
  }

  private static async buildOrderBook(
    orders: Order[]
  ): Promise<{ price: string; amount: string }[]> {
    const orderBook = [];
    for (const order of orders) {
      if (!orderBook[order.price]) {
        orderBook[order.price] = {
          price: order.price,
          amount: order.remainingAmount,
        };
        continue;
      }
      orderBook[order.price].amount = new BigNumber(
        orderBook[order.price].amount
      )
        .plus(order.remainingAmount)
        .toFixed();
    }
    return Object.values(orderBook);
  }

  public async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const newOrder = plainToClass(Order, createOrderDto);
    newOrder.status = OrderStatus.FillAble;
    newOrder.pairId = await this.getPairId(
      newOrder.type,
      newOrder.makerToken,
      newOrder.takerToken
    );
    newOrder.remainingAmount =
      createOrderDto.type === OrderType.BuyOrder
        ? createOrderDto.takerAmount
        : createOrderDto.makerAmount;

    return this.orderRepository.save(newOrder);
  }

  public async listOrder(listOrderDto: ListOrderDto): Promise<Order[]> {
    const pair = await this.pairRepository.getPairByBaseQuoteToken(
      listOrderDto.baseTokenAddress.toLowerCase(),
      listOrderDto.quoteTokenAddress.toLowerCase()
    );

    if (!pair) {
      throw new HttpException(
        { message: PairMessageError.PairNotFound },
        HttpStatus.BAD_REQUEST
      );
    }

    listOrderDto.pairId = pair._id.toString();
    return this.orderRepository.listOrder(listOrderDto);
  }

  public async getOrderBook(pairId: string, limit: number): Promise<any> {
    const buyOrders = await this.orderRepository.getBestFillAbleOrder(
      pairId,
      OrderType.BuyOrder,
      limit
    );
    const sellOrders = await this.orderRepository.getBestFillAbleOrder(
      pairId,
      OrderType.SellOrder,
      limit
    );

    return {
      buyOrders: await OrderService.buildOrderBook(buyOrders),
      sellOrders: await OrderService.buildOrderBook(sellOrders),
    };
  }
}
