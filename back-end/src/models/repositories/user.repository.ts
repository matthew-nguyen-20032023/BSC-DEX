import { Model } from "mongoose";
import { User, UserDocument } from "src/models/schemas/user.schema";

export class UserRepository {
  constructor(private readonly model: Model<UserDocument>) {}

  public async save(user: User): Promise<User> {
    const newUser = new this.model(user);
    return this.model.create(newUser);
  }

  public async getUserByEmail(email: string): Promise<User> {
    return this.model.findOne({ email: email });
  }
}
