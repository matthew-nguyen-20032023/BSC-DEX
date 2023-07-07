import { Model } from "mongoose";
import {
  WalletAssociateToken,
  WalletAssociateTokenDocument,
} from "src/models/schemas/wallet_associate_token.schema";

export class WalletAssociateTokenRepository {
  constructor(private readonly model: Model<WalletAssociateTokenDocument>) {}

  public async save(
    walletAssociateToken: WalletAssociateToken
  ): Promise<WalletAssociateToken> {
    const newWalletAssociateToken = new this.model(walletAssociateToken);
    return this.model.create(newWalletAssociateToken);
  }

  public async getUserAssociateToken(
    userId: string,
    tokenId: string
  ): Promise<WalletAssociateToken> {
    return this.model.findOne({
      userId,
      tokenId,
    });
  }
}
