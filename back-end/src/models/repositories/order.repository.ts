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

  public async listOrder(listOrderDto: ListOrderDto): Promise<Order[]> {
    const sort = {};
    const condition = {};

    if (listOrderDto.sortPrice) {
      sort["price"] = listOrderDto.sortPrice;
    }

    if (listOrderDto.type) condition["type"] = listOrderDto.type;
    if (listOrderDto.pairId) condition["pairId"] = listOrderDto.pairId;
    condition["expiry"] = { $gt: Date.now() / 1000 };
    condition["status"] = OrderStatus.FillAble;

    return this.model
      .find(condition)
      .sort(sort)
      .skip((listOrderDto.page - 1) * listOrderDto.limit)
      .limit(listOrderDto.limit);
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
}
