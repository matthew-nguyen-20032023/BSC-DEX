"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ethereum = void 0;
class Ethereum {
    async getWalletBalance(walletAddress) {
        return this.client.eth.getBalance(walletAddress);
    }
    async getTransaction(transactionHash) {
        return this.client.eth.getTransaction(transactionHash);
    }
    async getTransactionReceipt(transactionHash) {
        return this.client.eth.getTransactionReceipt(transactionHash);
    }
}
exports.Ethereum = Ethereum;
//# sourceMappingURL=index.js.map