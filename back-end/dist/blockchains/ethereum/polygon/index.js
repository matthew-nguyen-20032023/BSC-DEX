"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygon = void 0;
const Web3 = require("web3");
const ethereum_1 = require("..");
class Polygon extends ethereum_1.Ethereum {
    constructor() {
        super();
        this.client = new Web3(process.env.POLYGON_PROVIDER);
    }
}
exports.Polygon = Polygon;
//# sourceMappingURL=index.js.map