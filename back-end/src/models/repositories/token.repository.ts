import { Model } from "mongoose";
import { Token, TokenDocument } from "src/models/schemas/token.schema";

export class TokenRepository {
  constructor(private readonly model: Model<TokenDocument>) {}

  public async save(token: Token): Promise<Token> {
    const newToken = new this.model(token);
    newToken.address = newToken.address.toLowerCase();
    return this.model.create(newToken);
  }

  public async getTokenByAddress(tokenAddress: string): Promise<Token> {
    return this.model.findOne({
      address: tokenAddress.toLowerCase(),
    });
  }

  public async listToken(page: number, limit: number): Promise<Token[]> {
    return this.model
      .find()
      .skip((page - 1) * limit)
      .limit(limit);
  }

  public async countTotalToken(): Promise<number> {
    return this.model.count();
  }

  /**
   * @description Just you for seeding and testing in local version
   */
  public async deleteAll(): Promise<void> {
    await this.model.deleteMany({});
  }
}
