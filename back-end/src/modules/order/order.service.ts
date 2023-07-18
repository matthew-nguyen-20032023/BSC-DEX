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
      baseTokenAddress,
      quoteTokenAddress
    );
    if (!existPair) {
      throw new HttpException(
        { message: PairMessageError.PairNotFound },
        HttpStatus.BAD_REQUEST
      );
    }
    return existPair._id.toString();
  }

  public async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const newOrder = plainToClass(Order, createOrderDto);
    newOrder.status = OrderStatus.FillAble;
    newOrder.pairId = await this.getPairId(
      newOrder.type,
      newOrder.makerToken,
      newOrder.takerToken
    );
    newOrder.remainingAmount = newOrder.takerAmount;

    return this.orderRepository.save(newOrder);
  }
}
