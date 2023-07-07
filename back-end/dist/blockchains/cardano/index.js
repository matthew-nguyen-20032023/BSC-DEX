"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cardano = void 0;
const cardano_wallet_js_1 = require("cardano-wallet-js");
class Cardano {
    constructor() {
        this.walletServer = cardano_wallet_js_1.WalletServer.init(process.env.CARDANO_WALLET_SERVER);
    }
    async createOrRestoreWallet(walletName, walletPassword, recoveryPhrase = cardano_wallet_js_1.Seed.generateRecoveryPhrase()) {
        const mnemonicSentence = cardano_wallet_js_1.Seed.toMnemonicList(recoveryPhrase);
        return this.walletServer.createOrRestoreShelleyWallet(walletName, mnemonicSentence, walletPassword);
    }
    async getWalletById(walletId) {
        return this.walletServer.getShelleyWallet(walletId);
    }
    async renameWallet(walletId, newName) {
        const wallet = await this.getWalletById(walletId);
        return wallet.rename(newName);
    }
    async updateWalletPassword(walletId, oldPassword, newPassword) {
        const wallet = await this.getWalletById(walletId);
        return wallet.updatePassphrase(oldPassword, newPassword);
    }
}
exports.Cardano = Cardano;
//# sourceMappingURL=index.js.map