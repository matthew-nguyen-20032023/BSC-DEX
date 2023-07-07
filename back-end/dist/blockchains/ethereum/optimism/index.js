"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Optimism = void 0;
const Web3 = require("web3");
const ethereum_1 = require("..");
class Optimism extends ethereum_1.Ethereum {
    constructor() {
        super();
        this.client = new Web3(process.env.OPTIMISM_PROVIDER);
    }
}
exports.Optimism = Optimism;
//# sourceMappingURL=index.js.map