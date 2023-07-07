import { Model } from "mongoose";
import { Hedera } from "src/blockchains/hedera";
import { NftType, NftTypeDocument } from "src/models/schemas/nft-type.schema";
import { Nft, NftDocument } from "src/models/schemas/nft.schema";
import { WalletDocument } from "src/models/schemas/wallet.schema";
import { WalletAssociateToken, WalletAssociateTokenDocument } from "src/models/schemas/wallet_associate_token.schema";
import { UserDocument } from "src/models/schemas/user.schema";
import { TransactionDocument } from "src/models/schemas/transaction.schema";
export declare class NftService {
    private readonly nftTypeModel;
    private readonly nftModel;
    private readonly walletModel;
    private readonly walletAssociateTokenModel;
    private readonly userModel;
    private readonly transactionModel;
    private readonly hederaLib;
    private nftTypeRepository;
    private nftRepository;
    private walletRepository;
    private walletAssociateTokenRepository;
    private userRepository;
    private transactionRepository;
    constructor(nftTypeModel: Model<NftTypeDocument>, nftModel: Model<NftDocument>, walletModel: Model<WalletDocument>, walletAssociateTokenModel: Model<WalletAssociateTokenDocument>, userModel: Model<UserDocument>, transactionModel: Model<TransactionDocument>, hederaLib: Hedera);
    createNewNftType(nftType: string, nftName: string, nftSymbol: string, tier: string, defaultBalance: number): Promise<NftType>;
    getListNftType(page: number, limit: number): Promise<{
        types: NftType[];
        total: number;
    }>;
    getListNFT(page: number, limit: number): Promise<{
        nfts: Nft[];
        total: number;
    }>;
    registerNftTypeToSmartContract(nftTypeId: string): Promise<NftType>;
    mintNFT(nftTypeId: string, ipfs: string, receiverEmail: string, tier: string, balance: number, description: string): Promise<Nft>;
    updateNFT(nftId: string, ipfs: string, tier: string, balance: number): Promise<Nft>;
    isAssociateToken(userId: string, tokenId: string): Promise<boolean>;
    associateTokenToAccount(userId: string, nftTypeId: string): Promise<WalletAssociateToken>;
}
