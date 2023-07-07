"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XDai = void 0;
const Web3 = require("web3");
const ethereum_1 = require("..");
class XDai extends ethereum_1.Ethereum {
    constructor() {
        super();
        this.client = new Web3(process.env.XDAI_PROVIDER);
    }
}
exports.XDai = XDai;
//# sourceMappingURL=index.js.map