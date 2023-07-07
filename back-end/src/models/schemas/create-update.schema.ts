import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export class CreateUpdateSchema {
  _id: string;

  @Prop({
    required: true,
    default(): Date {
      return new Date();
    },
  })
  createdAt: Date;

  @Prop({
    required: true,
    default(): Date {
      return new Date();
    },
  })
  updatedAt: Date;
}
