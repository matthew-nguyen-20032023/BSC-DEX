import { Model } from "mongoose";
import { Order, OrderDocument } from "src/models/schemas/order.schema";

export class OrderRepository {
  constructor(private readonly model: Model<OrderDocument>) {}

  public async save(order: Order): Promise<Order> {
    const newOrder = new this.model(order);
    return this.model.create(newOrder);
  }
}
