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
import { SocketEmitter } from "src/socket/socket-emitter";
import { IOrderBook } from "src/modules/order/order.interface";

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

  public static async buildOrderBook(
    groupOrders: {
      _id: { type: OrderType; price: string };
      totalRemainingAmount: string;
    }[]
  ): Promise<IOrderBook> {
    const buyOrders = [];
    const sellOrders = [];

    for (const order of groupOrders) {
      const orderBook = {
        price: new BigNumber(order._id.price).toFixed(2),
        amount: new BigNumber(order.totalRemainingAmount)
          .div(new BigNumber(10).pow(18))
          .toFixed(2),
        total: new BigNumber(order._id.price)
          .times(order.totalRemainingAmount)
          .div(new BigNumber(10).pow(18))
          .toFixed(2),
      };

      if (order._id.type === OrderType.BuyOrder) buyOrders.push(orderBook);
      else sellOrders.push(orderBook);
    }

    const funcSort = (a, b) => {
      {
        // Compare the 2 dates
        if (new BigNumber(a.price).gt(b.price)) return -1;
        if (new BigNumber(a.price).lt(b.price)) return 1;
      }
    };

    return {
      buyOrders: buyOrders.sort(funcSort),
      sellOrders: sellOrders.sort(funcSort),
    };
  }

  public async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const newOrder = plainToClass(Order, createOrderDto);
    newOrder.status = OrderStatus.FillAble;
    newOrder.pairId = await this.getPairId(
      newOrder.type,
      newOrder.makerToken,
      newOrder.takerToken
    );
    newOrder.verifyingContract = newOrder.verifyingContract.toLowerCase();
    newOrder.maker = newOrder.maker.toLowerCase();
    newOrder.taker = newOrder.taker.toLowerCase();
    newOrder.makerToken = newOrder.makerToken.toLowerCase();
    newOrder.takerToken = newOrder.takerToken.toLowerCase();
    newOrder.remainingAmount =
      createOrderDto.type === OrderType.BuyOrder
        ? createOrderDto.takerAmount
        : createOrderDto.makerAmount;

    const order = await this.orderRepository.save(newOrder);
    SocketEmitter.getInstance().emitNewOrderCreated(order);
    return order;
  }

  public async listOrder(
    listOrderDto: ListOrderDto
  ): Promise<{ data: Order[]; total: number }> {
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

  public async getMatchOrders(
    makerToken: string,
    takerToken: string,
    price: string,
    expectAmount: string,
    orderType: OrderType
  ): Promise<Order[]> {
    const matchedOrders = [];
    let totalRemainingAmount = new BigNumber(0);
    let page = 1;
    let stop = false;

    while (!stop) {
      const matchOrders = await this.orderRepository.getMatchOrders(
        makerToken,
        takerToken,
        price,
        orderType,
        page
      );

      if (matchOrders.length === 0) break;

      for (const order of matchOrders) {
        if (totalRemainingAmount.gte(expectAmount)) {
          stop = true;
          break;
        }
        totalRemainingAmount = totalRemainingAmount.plus(order.remainingAmount);
        matchedOrders.push(order);
      }

      // Increase the page if totalRemainingAmount not reach to expectAmount
      page = 2;
    }

    return matchedOrders;
  }

  public async getOrderBook(
    pairId: string,
    limit = 10
  ): Promise<{
    buyOrders: { price: string; amount: string }[];
    sellOrders: { price: string; amount: string }[];
  }> {
    const buyGroupOrders = await this.orderRepository.groupOrdersForOrderBook(
      pairId,
      OrderType.BuyOrder,
      limit
    );
    const sellGroupOrders = await this.orderRepository.groupOrdersForOrderBook(
      pairId,
      OrderType.SellOrder,
      limit
    );
    const buyOrder = await OrderService.buildOrderBook(buyGroupOrders);
    const sellOrder = await OrderService.buildOrderBook(sellGroupOrders);
    return {
      buyOrders: buyOrder.buyOrders,
      sellOrders: sellOrder.sellOrders,
    };
  }

  public async estimateAllowances(
    maker: string,
    makerToken: string
  ): Promise<string> {
    const fillAbleOrders =
      await this.orderRepository.getFillAbleOrdersToEstimateAllowance(
        maker.toLowerCase(),
        makerToken.toLowerCase()
      );

    let amount = new BigNumber(0);

    for (const order of fillAbleOrders) {
      if (order.type === OrderType.BuyOrder) {
        amount = amount.plus(
          new BigNumber(order.remainingAmount).times(order.price)
        );
      } else {
        amount = amount.plus(order.remainingAmount);
      }
    }

    return amount.div(new BigNumber(10).pow(18)).toFixed();
  }
}
