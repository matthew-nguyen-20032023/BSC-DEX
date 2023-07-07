"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Moonbeam = void 0;
const Web3 = require("web3");
const ethereum_1 = require("..");
class Moonbeam extends ethereum_1.Ethereum {
    constructor() {
        super();
        this.client = new Web3(process.env.MOONBEAM_PROVIDER);
    }
}
exports.Moonbeam = Moonbeam;
//# sourceMappingURL=index.js.map