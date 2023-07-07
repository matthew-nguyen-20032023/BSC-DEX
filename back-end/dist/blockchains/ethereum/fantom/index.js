"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fantom = void 0;
const Web3 = require("web3");
const ethereum_1 = require("..");
class Fantom extends ethereum_1.Ethereum {
    constructor() {
        super();
        this.client = new Web3(process.env.FANTOM_PROVIDER);
    }
}
exports.Fantom = Fantom;
//# sourceMappingURL=index.js.map