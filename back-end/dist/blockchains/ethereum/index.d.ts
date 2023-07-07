import Web3 from "web3";
import { Transaction, TransactionReceipt } from "web3-core";
export declare class Ethereum {
    protected client: Web3;
    getWalletBalance(walletAddress: string): Promise<string>;
    getTransaction(transactionHash: string): Promise<Transaction>;
    getTransactionReceipt(transactionHash: string): Promise<TransactionReceipt>;
}
