import { Model } from "mongoose";
import { Wallet, WalletDocument } from "src/models/schemas/wallet.schema";
import { Hedera } from "src/blockchains/hedera";
import { Nft, NftDocument } from "src/models/schemas/nft.schema";
export declare class WalletService {
    private readonly walletModel;
    private readonly nftModel;
    private readonly hederaLib;
    private walletRepository;
    private nftRepository;
    constructor(walletModel: Model<WalletDocument>, nftModel: Model<NftDocument>, hederaLib: Hedera);
    static decodeWalletPrivateKey(encryptWalletPrivateKey: string): string;
    getUserWallet(userId: string): Promise<{
        wallet: Wallet;
        balance: string;
    }>;
    exportWalletPrivateKey(userId: string): Promise<{
        privateKey: string;
    }>;
    listNft(userId: string, nftTypes: string[], page: number, limit: number): Promise<{
        nfts: Nft[];
        total: number;
    }>;
    mintHBAR(userId: string): Promise<void>;
}
