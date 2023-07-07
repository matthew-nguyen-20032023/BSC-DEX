import { Model } from "mongoose";
import { Wallet, WalletDocument } from "src/models/schemas/wallet.schema";

export class WalletRepository {
  constructor(private readonly model: Model<WalletDocument>) {}

  public async save(wallet: Wallet): Promise<Wallet> {
    const newWallet = new this.model(wallet);
    return this.model.create(newWallet);
  }

  public async getWalletByUserId(userId: string): Promise<Wallet> {
    return this.model.findOne({
      userId,
    });
  }
}
