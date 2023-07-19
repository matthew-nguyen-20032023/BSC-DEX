import { Model } from "mongoose";
import {
  Order,
  OrderDocument,
  OrderStatus,
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
}
