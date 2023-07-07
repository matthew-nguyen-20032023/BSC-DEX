const Xdc3 = require("xdc3");
import Web3 from "xdc3";

export class Xinfin {
  protected client: Web3;

  constructor() {
    this.client = new Xdc3(
      new Xdc3.providers.HttpProvider(process.env.XINFIN_PROVIDER)
    );
  }
}
