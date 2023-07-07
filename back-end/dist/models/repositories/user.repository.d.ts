import { Model } from "mongoose";
import { User, UserDocument } from "src/models/schemas/user.schema";
export declare class UserRepository {
    private readonly model;
    constructor(model: Model<UserDocument>);
    save(user: User): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
}
