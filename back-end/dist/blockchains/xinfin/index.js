"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Xinfin = void 0;
const Xdc3 = require("xdc3");
class Xinfin {
    constructor() {
        this.client = new Xdc3(new Xdc3.providers.HttpProvider(process.env.XINFIN_PROVIDER));
    }
}
exports.Xinfin = Xinfin;
//# sourceMappingURL=index.js.map