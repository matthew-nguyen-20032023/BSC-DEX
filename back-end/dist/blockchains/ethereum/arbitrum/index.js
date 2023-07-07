"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arbitrum = void 0;
const Web3 = require("web3");
const ethereum_1 = require("..");
class Arbitrum extends ethereum_1.Ethereum {
    constructor() {
        super();
        this.client = new Web3(process.env.ARBITRUM_PROVIDER);
    }
}
exports.Arbitrum = Arbitrum;
//# sourceMappingURL=index.js.map