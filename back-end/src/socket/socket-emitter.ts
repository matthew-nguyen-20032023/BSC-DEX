import { Emitter } from "@socket.io/redis-emitter";
import { createClient } from "redis";
import { Order } from "src/models/schemas/order.schema";
import { EventEmit } from "src/socket/socket-server.const";
import { Trade } from "src/models/schemas/trade.schema";

export class SocketEmitter {
  private static instance: SocketEmitter;
  private emitter;

  constructor() {
    const redisClient = createClient({
      // @ts-ignore
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });
    redisClient.connect().then();
    this.emitter = new Emitter(redisClient);
  }

  public static getInstance(): SocketEmitter {
    if (!this.instance) {
      this.instance = new SocketEmitter();
    }
    return this.instance;
  }

  /**
   * @description use getInstance() above to call this function
   * @param order: Order
   */
  public emitNewOrderCreated(order: Order): void {
    this.emitter.emit(EventEmit.NewOrderCreated, order);
  }

  /**
   * @description use getInstance() above to call this function
   * @param trade: Trade
   */
  public emitNewTradeCreated(trade: Trade): void {
    this.emitter.emit(EventEmit.NewTradeCreated, trade);
  }

  /**
   * @description use getInstance() above to call this function
   * @param order: Order
   */
  public emitOrderMatched(order: Order): void {
    this.emitter.emit(EventEmit.OrderMatched, order);
  }
}
