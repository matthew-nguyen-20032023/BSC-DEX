const Web3 = require("web3");
import { erc20ABI } from "src/blockchains/binance/abi/erc20";

export class Binance {
  private client;
  private static instance: Binance;

  constructor() {
    this.client = new Web3(process.env.BSC_RPC);
  }

  public static getInstance(): Binance {
    if (!Binance.instance) {
      Binance.instance = new Binance();
    }
    return Binance.instance;
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
}
