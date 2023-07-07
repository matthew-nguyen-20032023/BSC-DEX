import { WalletServer, Seed, ShelleyWallet } from "cardano-wallet-js";

export class Cardano {
  protected walletServer: WalletServer;

  constructor() {
    this.walletServer = WalletServer.init(process.env.CARDANO_WALLET_SERVER);
  }

  /**
   * @description Note that the wallet password must have at least 10 characters
   * @param walletName
   * @param walletPassword
   * @param recoveryPhrase
   */
  public async createOrRestoreWallet(
    walletName: string,
    walletPassword: string,
    recoveryPhrase = Seed.generateRecoveryPhrase()
  ): Promise<ShelleyWallet> {
    const mnemonicSentence = Seed.toMnemonicList(recoveryPhrase);
    return this.walletServer.createOrRestoreShelleyWallet(
      walletName,
      mnemonicSentence,
      walletPassword
    );
  }

  public async getWalletById(walletId: string): Promise<ShelleyWallet> {
    return this.walletServer.getShelleyWallet(walletId);
  }

  public async renameWallet(
    walletId: string,
    newName: string
  ): Promise<ShelleyWallet> {
    const wallet = await this.getWalletById(walletId);
    return wallet.rename(newName);
  }

  /**
   * @description Have to validate old password at backend main logic before using this
   * @param walletId
   * @param oldPassword
   * @param newPassword Must have at least 10 characters
   */
  public async updateWalletPassword(
    walletId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<ShelleyWallet> {
    const wallet = await this.getWalletById(walletId);
    return wallet.updatePassphrase(oldPassword, newPassword);
  }
}
