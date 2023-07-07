import { Client } from "@hashgraph/sdk";
import { Wallet } from "src/models/schemas/wallet.schema";
import { NftType } from "src/models/schemas/nft-type.schema";
import { Transaction } from "src/models/schemas/transaction.schema";
export declare class Hedera {
    protected client: Client;
    constructor();
    setOperator(accountId: string, privateKey: string): Promise<void>;
    private callFunctionOnChain;
    private static createTransaction;
    associateTokenToWallet(accountId: string, accountPrivateKey: string, tokenIds: string[]): Promise<Transaction>;
    createNewAccount(userId: string): Promise<Wallet>;
    createNewNftType(nftName: string, nftSymbol: string): Promise<{
        newNftType: NftType;
        transaction: Transaction;
    }>;
    registerNFTType(nftType: string, NFTEvmAddress: string): Promise<Transaction>;
    mintNFT(NFTType: string, evmReceiverAddress: string, tier: string, balance: number, metadata: Uint8Array[]): Promise<{
        tokenId: number;
        transaction: Transaction;
    }>;
    configStakeRule(stakeType: string, duration: number, rewardBalance: number, penaltyBalance: number): Promise<Transaction>;
    stakeNFT(stakeType: string, nftType: string, tokenId: number): Promise<Transaction>;
    unStakeNft(nftType: string, tokenId: number): Promise<Transaction>;
    setNFTProperty(nftType: string, tokenId: number, tier: string, balance: number): Promise<Transaction>;
    setMetaData(nftAccountId: string, metadata: Uint8Array[]): Promise<Transaction>;
    mintHBAR(accountId: string): Promise<void>;
    checkAccountBalance(accountId: string): Promise<string>;
}
