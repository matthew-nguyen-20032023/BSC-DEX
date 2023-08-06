import { Emitter } from "@socket.io/redis-emitter";
import { createClient } from "redis";
import { Order } from "src/models/schemas/order.schema";
import { EventEmit } from "src/socket/socket-server.const";
import { Trade } from "src/models/schemas/trade.schema";
import { Ticker24H } from "src/modules/ticker/ticker.interface";
import { IOrderBook } from "src/modules/order/order.interface";

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
    this.emitter.emit(`${EventEmit.NewOrderCreated}_${order.pairId}`, order);
  }

  /**
   * @description use getInstance() above to call this function
   * @param order: Order
   */
  public emitOrderCancelled(order: Order): void {
    this.emitter.emit(`${EventEmit.OrderCancelled}_${order.pairId}`, order);
  }

  /**
   * @description use getInstance() above to call this function
   * @param trade: Trade
   */
  public emitNewTradeCreated(trade: Trade): void {
    this.emitter.emit(`${EventEmit.NewTradeCreated}_${trade.pairId}`, trade);
  }

  /**
   * @description for emit ticker 24h change for UI by pair
   * @param ticker
   * @param pairId
   */
  public emitTicker24h(ticker: Ticker24H, pairId: string): void {
    this.emitter.emit(`${EventEmit.TickerChange}_${pairId}`, ticker);
  }

  /**
   * @description for emit order book by pair
   * @param orderBook
   * @param pairId
   */
  public emitOrderBookByPairId(orderBook: IOrderBook, pairId: string): void {
    this.emitter.emit(`${EventEmit.OrderBookByPair}_${pairId}`, orderBook);
  }
}
