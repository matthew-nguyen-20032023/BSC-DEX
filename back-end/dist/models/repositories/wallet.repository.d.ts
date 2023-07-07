import { Model } from "mongoose";
import { Wallet, WalletDocument } from "src/models/schemas/wallet.schema";
export declare class WalletRepository {
    private readonly model;
    constructor(model: Model<WalletDocument>);
    save(wallet: Wallet): Promise<Wallet>;
    getWalletByUserId(userId: string): Promise<Wallet>;
}
