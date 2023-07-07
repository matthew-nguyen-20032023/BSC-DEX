import { WalletServer, ShelleyWallet } from "cardano-wallet-js";
export declare class Cardano {
    protected walletServer: WalletServer;
    constructor();
    createOrRestoreWallet(walletName: string, walletPassword: string, recoveryPhrase?: string): Promise<ShelleyWallet>;
    getWalletById(walletId: string): Promise<ShelleyWallet>;
    renameWallet(walletId: string, newName: string): Promise<ShelleyWallet>;
    updateWalletPassword(walletId: string, oldPassword: string, newPassword: string): Promise<ShelleyWallet>;
}
