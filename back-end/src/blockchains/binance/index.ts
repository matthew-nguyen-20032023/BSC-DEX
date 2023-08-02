import { BatchMatchOrderABI } from "./abi/batch-match-order";

const Web3 = require("web3");
import { erc20ABI } from "src/blockchains/binance/abi/erc20";
import { exchangeABI } from "src/blockchains/binance/abi/exchange";
import { Contract } from "web3-eth-contract";

export class Binance {
  private client;
  private ws;
  private static instance: Binance;

  constructor() {
    this.client = new Web3(process.env.BSC_RPC); // This for http provider
    this.ws = new Web3(process.env.BSC_WS); // This for websocket provider
  }

  public static getInstance(): Binance {
    if (!Binance.instance) {
      Binance.instance = new Binance();
    }
    return Binance.instance;
  }

  public async getOrderSmartContractWs(): Promise<Contract> {
    return new this.ws.eth.Contract(
      exchangeABI,
      process.env.ORDER_SMART_CONTRACT_ADDRESS
    );
  }

  public async createERC20ContractByToken(
    tokenAddress: string
  ): Promise<Contract> {
    return new this.client.eth.Contract(erc20ABI, tokenAddress);
  }

  public async getMatchingOrderContract(): Promise<Contract> {
    return new this.client.eth.Contract(
      exchangeABI,
      process.env.ORDER_SMART_CONTRACT_ADDRESS
    );
  }

  public async getBatchMatchOrderContract(): Promise<Contract> {
    return new this.client.eth.Contract(
      BatchMatchOrderABI,
      process.env.BATCH_MATCH_ORDER_ADDRESS
    );
  }

  public async getERC20TokenInfo(tokenAddress: string): Promise<{
    name: string;
    symbol: string;
    decimals: number;
  }> {
    const erc20TokenContract = new this.client.eth.Contract(
      erc20ABI,
      tokenAddress
    );

    const [name, symbol, decimals] = await Promise.all([
      await erc20TokenContract.methods.name().call(),
      await erc20TokenContract.methods.symbol().call(),
      await erc20TokenContract.methods.decimals().call(),
    ]);
    return {
      name,
      symbol,
      decimals,
    };
  }

  /**
   * @description this for testing on ganache only, ganache does require connect account
   * @param receiver
   * @param amount
   * @param tokenAddress
   */
  public async mintTokenForTest(
    receiver: string,
    amount: string,
    tokenAddress: string
  ): Promise<boolean> {
    const account = await this.client.eth.accounts.privateKeyToAccount(
      process.env.ADMIN_WALLET_PRIVATE_KEY
    );
    const erc20TokenContract = new this.client.eth.Contract(
      erc20ABI,
      tokenAddress
    );
    await erc20TokenContract.methods
      .mint(receiver, amount)
      .send({ from: account.address });
    // const privateKey = toBuffer(process.env.ADMIN_WALLET_PRIVATE_KEY);
    // const adminAddress = "0x19Ef6AB7a5e9753C214462df01F77aD324dA645D";
    //
    // const mintFunctionData = erc20TokenContract.methods
    //   .mint(receiver, amount)
    //   .encodeABI();
    //
    // const rawTx = {
    //   from: adminAddress,
    //   nonce: await this.client.eth.getTransactionCount(adminAddress),
    //   gasPrice: this.client.utils.toHex("20000000000"),
    //   gasLimit: this.client.utils.toHex("3000000"),
    //   to: tokenAddress,
    //   value: "0x00",
    //   data: mintFunctionData,
    //   chainId: this.client.utils.toHex(1337),
    // };
    //
    // const tx = new Transaction(rawTx);
    // tx.sign(privateKey);
    // const serializedTx = tx.serialize();
    //
    // this.client.eth
    //   .sendSignedTransaction("0x" + serializedTx.toString("hex"))
    //   .on("transactionHash", (hash) => {
    //     console.log("Transaction hash:", hash);
    //   })
    //   .on("receipt", (receipt) => {
    //     console.log("Transaction receipt:", receipt);
    //   })
    //   .on("error", (error) => {
    //     console.error("Error while sending transaction:", error);
    //   });
    return true;
  }

  public async getLatestBlock(): Promise<number> {
    return this.client.eth.getBlockNumber();
  }
}
