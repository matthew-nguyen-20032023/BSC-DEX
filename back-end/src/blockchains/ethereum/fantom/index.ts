const Web3 = require("web3");
import { Ethereum } from "src/blockchains/ethereum";

export class Fantom extends Ethereum {
  constructor() {
    super();
    this.client = new Web3(process.env.FANTOM_PROVIDER);
  }
}
