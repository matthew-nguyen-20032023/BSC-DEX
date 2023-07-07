"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avalanche = void 0;
const Web3 = require("web3");
const ethereum_1 = require("..");
class Avalanche extends ethereum_1.Ethereum {
    constructor() {
        super();
        this.client = new Web3(process.env.AVALANCHE_PROVIDER);
    }
}
exports.Avalanche = Avalanche;
//# sourceMappingURL=index.js.map