const Web3 = require("web3");
import { Ethereum } from "src/blockchains/ethereum";

export class Moonbeam extends Ethereum {
  constructor() {
    super();
    this.client = new Web3(process.env.MOONBEAM_PROVIDER);
  }
}
