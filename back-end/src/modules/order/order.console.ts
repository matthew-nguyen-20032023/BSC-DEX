import { Command, Console } from "nestjs-console";
import { Binance } from "src/blockchains/binance";
import { OrderEvent } from "./order.const";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  Event,
  EventDocument,
  EventStatus,
} from "src/models/schemas/event.schema";
import { EventRepository } from "src/models/repositories/event.repository";
const { MongoClient } = require("mongodb");

@Console()
export class OrderConsole {
  private readonly eventRepository: EventRepository;

  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>
  ) {
    this.eventRepository = new EventRepository(this.eventModel);
  }

  /**
   * @description: Determine start block for listen, I don't want to listen old event crawled and handled
   * @eventName: event name from blockchain
   */
  private async getStartBlockForEvent(eventName: string): Promise<number> {
    let startBlockCrawl = 0;
    const latestEventCrawled = await this.eventRepository.getLatestEventCrawled(
      eventName
    );
    if (!latestEventCrawled) {
      if (process.env.ORDER_START_BLOCK) {
        startBlockCrawl = Number(process.env.ORDER_START_BLOCK);
      }
    } else startBlockCrawl = latestEventCrawled.blockNumber;
    return startBlockCrawl + 1;
  }

  /**
   * @description Crawl LimitOrderFilled event on smart contract
   */
  @Command({ command: "crawl-order-matched" })
  public async orderMatched() {
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
}
