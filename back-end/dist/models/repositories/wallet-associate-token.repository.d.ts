import { Model } from "mongoose";
import { WalletAssociateToken, WalletAssociateTokenDocument } from "src/models/schemas/wallet_associate_token.schema";
export declare class WalletAssociateTokenRepository {
    private readonly model;
    constructor(model: Model<WalletAssociateTokenDocument>);
    save(walletAssociateToken: WalletAssociateToken): Promise<WalletAssociateToken>;
    getUserAssociateToken(userId: string, tokenId: string): Promise<WalletAssociateToken>;
}
