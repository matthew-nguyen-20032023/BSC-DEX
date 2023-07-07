"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Binance = void 0;
const Web3 = require("web3");
const ethereum_1 = require("..");
class Binance extends ethereum_1.Ethereum {
    constructor() {
        super();
        this.client = new Web3(process.env.BINANCE_PROVIDER);
    }
}
exports.Binance = Binance;
//# sourceMappingURL=index.js.map