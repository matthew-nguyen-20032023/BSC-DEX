const Web3 = require("web3");
import { Ethereum } from "src/blockchains/ethereum";

export class Polygon extends Ethereum {
  constructor() {
    super();
    this.client = new Web3(process.env.POLYGON_PROVIDER);
  }
}
