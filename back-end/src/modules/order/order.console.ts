const { MongoClient } = require("mongodb");
const BigNumber = require("bignumber.js");
import { Command, Console } from "nestjs-console";
import { Binance } from "src/blockchains/binance";
import { OrderEvent } from "src/modules/order/order.const";
import { InjectModel } from "@nestjs/mongoose";
import { sleep } from "src/helper/common";
import { Model } from "mongoose";
import {
  Event,
  EventDocument,
  EventStatus,
} from "src/models/schemas/event.schema";
import { EventRepository } from "src/models/repositories/event.repository";
import { OrderRepository } from "src/models/repositories/order.repository";
import {
  Order,
  OrderDocument,
  OrderStatus,
  OrderType,
} from "src/models/schemas/order.schema";
import { Trade, TradeDocument } from "src/models/schemas/trade.schema";
import { TradeRepository } from "src/models/repositories/trade.repository";
import { SocketEmitter } from "src/socket/socket-emitter";

@Console()
export class OrderConsole {
  private readonly eventRepository: EventRepository;
  private readonly orderRepository: OrderRepository;
  private readonly tradeRepository: TradeRepository;

  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Trade.name)
    private readonly tradeModel: Model<TradeDocument>
  ) {
    this.eventRepository = new EventRepository(this.eventModel);
    this.orderRepository = new OrderRepository(this.orderModel);
    this.tradeRepository = new TradeRepository(this.tradeModel);
  }

  /**
   * @description: Determine start block for listen, I don't want to listen old event crawled and handled
   * @eventName: event name from blockchain
   */
  private async getStartBlockForEvent(eventName: string): Promise<number> {
    let startBlockCrawl;
    const latestEventCrawled = await this.eventRepository.getLatestEventCrawled(
      eventName
    );
    if (!latestEventCrawled) {
      startBlockCrawl = await Binance.getInstance().getLatestBlock();
    } else startBlockCrawl = latestEventCrawled.blockNumber;
    return startBlockCrawl + 1;
  }

  private static async createTradeFromOrderAndEvent(
    order: Order,
    event: Event
  ): Promise<Trade> {
    const newTrade = new Trade();
    newTrade.orderType = order.type;
    newTrade.price = order.price;
    newTrade.volume =
      order.type === OrderType.BuyOrder
        ? event.takerTokenFilledAmount
        : new BigNumber(event.takerTokenFilledAmount).div(order.price);
    newTrade.pairId = order.pairId;
    newTrade.timestamp = Date.now();
    return newTrade;
  }

  /**
   * @description Crawl LimitOrderFilled event on smart contract
   */
  @Command({ command: "crawl-order-matched" })
  public async orderMatched(): Promise<void> {
    const orderSmartContract =
      await Binance.getInstance().getOrderSmartContractWs();

    const startBlockCrawl = await this.getStartBlockForEvent(
      OrderEvent.LimitOrderFilled
    );

    console.log(
      `Starting crawl order event ${
        OrderEvent.LimitOrderFilled
      } at block ${startBlockCrawl} (${new Date()})`
    );
    await orderSmartContract.events[OrderEvent.LimitOrderFilled](
      { fromBlock: startBlockCrawl },
      async (error, event) => {
        if (!error) {
          console.log(`Event crawled at block ${event.blockNumber}`);
          const MONGODB_URI = `mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;
          const client = await MongoClient.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
          const db = client.db(process.env.DATABASE_NAME);
          const eventCollection = db.collection("events");

          const newEvent = new Event();
          newEvent.blockNumber = event.blockNumber;
          newEvent.transactionHash = event.transactionHash;
          newEvent.name = OrderEvent.LimitOrderFilled;
          newEvent.orderHash = event.returnValues.orderHash;
          newEvent.maker = event.returnValues.maker;
          newEvent.taker = event.returnValues.taker;
          newEvent.feeRecipient = event.returnValues.feeRecipient;
          newEvent.makerToken = event.returnValues.makerToken;
          newEvent.takerToken = event.returnValues.takerToken;
          newEvent.takerTokenFilledAmount =
            event.returnValues.takerTokenFilledAmount;
          newEvent.makerTokenFilledAmount =
            event.returnValues.makerTokenFilledAmount;
          newEvent.takerTokenFeeFilledAmount =
            event.returnValues.takerTokenFeeFilledAmount;
          newEvent.protocolFeePaid = event.returnValues.protocolFeePaid;
          newEvent.pool = event.returnValues.pool;
          newEvent.status = EventStatus.Crawled;

          await eventCollection.insertOne(newEvent);
          await client.close();
        } else {
          throw Error(
            `Error processing event with error: ${JSON.stringify(error)}`
          );
        }
      }
    );
  }

  /**
   * @description Handle order Crawled from LimitOrderFilled event on smart contract
   */
  @Command({ command: "handle-limit-order-filled-crawled" })
  public async handleOrderCrawled(): Promise<void> {
    while (1) {
      const oldestEventCrawled =
        await this.eventRepository.getOldestEventCrawled(
          OrderEvent.LimitOrderFilled
        );

      if (!oldestEventCrawled) {
        console.log(
          "No new LimitOrderFilled event crawled found, waiting to get again!"
        );
        await sleep(3000);
        continue;
      }
      console.log(
        `Handle event crawled with id ${
          oldestEventCrawled._id
        } at ${new Date()}`
      );

      const order = await this.orderRepository.getOrderByOrderHash(
        oldestEventCrawled.orderHash
      );

      if (!order) {
        oldestEventCrawled.status = EventStatus.Failed;
        oldestEventCrawled.updatedAt = new Date();
        oldestEventCrawled.note = "No match order found in orders";
        await this.eventRepository.save(oldestEventCrawled);
        continue;
      }

      const remainingAmount =
        order.type === OrderType.SellOrder
          ? new BigNumber(order.remainingAmount).minus(
              new BigNumber(oldestEventCrawled.takerTokenFilledAmount).div(
                order.price
              )
            )
          : new BigNumber(order.remainingAmount).minus(
              oldestEventCrawled.takerTokenFilledAmount
            );

      // This must be happened
      const newTrade = await OrderConsole.createTradeFromOrderAndEvent(
        order,
        oldestEventCrawled
      );
      order.updatedAt = new Date();
      oldestEventCrawled.status = EventStatus.Complete;
      oldestEventCrawled.updatedAt = new Date();

      // Emit trade to FE
      SocketEmitter.getInstance().emitNewTradeCreated(newTrade);

      if (remainingAmount.eq(0)) {
        // Fulfill
        order.remainingAmount = "0";
        order.status = OrderStatus.Completed;
        await this.eventRepository.save(oldestEventCrawled);
        await this.orderRepository.save(order);
        await this.tradeRepository.save(newTrade);
      } else {
        // PartialFill
        order.remainingAmount = remainingAmount.toFixed();
        await this.eventRepository.save(oldestEventCrawled);
        await this.orderRepository.save(order);
        await this.tradeRepository.save(newTrade);
      }

      SocketEmitter.getInstance().emitOrderMatched(order);
    }
  }
}
