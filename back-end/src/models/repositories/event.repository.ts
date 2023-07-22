import { Model } from "mongoose";
import {
  Event,
  EventDocument,
  EventStatus,
} from "src/models/schemas/event.schema";

export class EventRepository {
  constructor(private readonly model: Model<EventDocument>) {}

  public async save(event: Event): Promise<Event> {
    const newEvent = new this.model(event);
    return this.model.create(newEvent);
  }

  public async getLatestEventCrawled(eventName: string): Promise<Event> {
    return this.model
      .findOne({ name: eventName })
      .sort({ blockNumber: "desc" });
  }

  public async getOldestEventCrawled(eventName: string): Promise<Event> {
    return this.model
      .findOne({
        name: eventName,
        status: EventStatus.Crawled,
      })
      .sort({ blockNumber: "asc" });
  }

  /**
   * @description Just you for seeding and testing in local version
   */
  public async deleteAll(): Promise<void> {
    await this.model.deleteMany({});
  }
}
