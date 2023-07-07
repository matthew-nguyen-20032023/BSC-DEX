import Web3 from "web3";
import { Transaction, TransactionReceipt } from "web3-core";

/**
 * @description This is supper class of ethereum network
 */
export class Ethereum {
  /**
   * @description Every chains in ethereum net work have to set up client
   */
  protected client: Web3;

  /**
   * @description Get wallet balance base on subclass chain
   * @param walletAddress
   */
  public async getWalletBalance(walletAddress: string): Promise<string> {
    return this.client.eth.getBalance(walletAddress);
  }

  /**
   * @description Get transaction detail
   * @param transactionHash
   */
  public async getTransaction(transactionHash: string): Promise<Transaction> {
    return this.client.eth.getTransaction(transactionHash);
  }

  /**
   * @description Get detail transaction after executed on blockchain
   * @param transactionHash
   */
  public async getTransactionReceipt(
    transactionHash: string
  ): Promise<TransactionReceipt> {
    return this.client.eth.getTransactionReceipt(transactionHash);
  }
}
