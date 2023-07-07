"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthereumClassic = void 0;
const Web3 = require("web3");
const ethereum_1 = require("..");
class EthereumClassic extends ethereum_1.Ethereum {
    constructor() {
        super();
        this.client = new Web3(process.env.ETHEREUM_CLASSIC_PROVIDER);
    }
}
exports.EthereumClassic = EthereumClassic;
//# sourceMappingURL=index.js.map