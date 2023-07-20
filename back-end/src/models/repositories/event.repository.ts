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

  public async getLatestEventCrawled(): Promise<Event> {
    return this.model.findOne().sort({ blockNumber: "desc" });
  }
}
