import { Model } from "mongoose";
import {
  Order,
  OrderDocument,
  OrderStatus,
  OrderType,
} from "src/models/schemas/order.schema";
import { ListOrderDto } from "src/modules/order/dto/list-order.dto";

export class OrderRepository {
  constructor(private readonly model: Model<OrderDocument>) {}

  public async save(order: Order): Promise<Order> {
    const newOrder = new this.model(order);
    return this.model.create(newOrder);
  }

  public async listOrder(conditions: ListOrderDto): Promise<Order[]> {
    const sort = {};
    const condition = {};

    if (conditions.sortPrice) {
      sort["price"] = conditions.sortPrice;
    }
    if (conditions.sortCreated) {
      sort["createdAt"] = conditions.sortCreated;
    }

    if (conditions.type) condition["type"] = conditions.type;
    if (conditions.pairId) condition["pairId"] = conditions.pairId;
    condition["expiry"] = { $gt: Date.now() / 1000 };
    condition["status"] = OrderStatus.FillAble;

    return this.model
      .find(condition)
      .sort(sort)
      .skip((conditions.page - 1) * conditions.limit)
      .limit(conditions.limit);
  }

  public async getOrderByOrderHash(orderHash: string): Promise<Order> {
    return this.model.findOne({ orderHash: orderHash });
  }

  /**
   * @description Get fill able order by pair and type order. For buy order get order from high price -> low
   * @param pairId
   * @param type
   * @param limit
   */
  public getBestFillAbleOrder(
    pairId: string,
    type: OrderType,
    limit: number
  ): Promise<Order[]> {
    return this.model
      .find({
        pairId,
        type,
        status: OrderStatus.FillAble,
        expiry: { $gt: Date.now() / 1000 },
      })
      .sort({ price: type === OrderType.BuyOrder ? "desc" : "asc" })
      .limit(limit);
  }

  /**
   * @description Just you for seeding and testing in local version
   */
  public async deleteAll(): Promise<void> {
    await this.model.deleteMany({});
  }

  public async getFillAbleOrdersToEstimateAllowance(
    maker: string,
    makerToken: string
  ): Promise<Order[]> {
    return this.model.find({
      maker,
      makerToken,
      status: OrderStatus.FillAble,
      expiry: { $gt: Date.now() / 1000 },
    });
  }

  /**
   * @description Get best offers for user want to buy or sell order
   * @param makerToken token user want to give
   * @param takerToken token user want to receive
   * @param price
   * @param orderType // if user is buyer, so find the sell offers for, and opposite
   * @param page
   * @param limit
   */
  public async getMatchOrders(
    makerToken: string,
    takerToken: string,
    price: string,
    orderType: OrderType,
    page = 1,
    limit = 20
  ): Promise<Order[]> {
    const priceCondition =
      orderType === OrderType.BuyOrder
        ? { $lte: price } // find best for buyer will get order low or equal expect price
        : { $gte: price }; // find best for seller will get order high or equal expect price
    return this.model
      .find({
        makerToken: takerToken,
        takerToken: makerToken,
        status: OrderStatus.FillAble,
        expiry: { $gt: Date.now() / 1000 },
        price: priceCondition,
      })
      .skip((page - 1) * limit)
      .limit(limit);
  }
}
