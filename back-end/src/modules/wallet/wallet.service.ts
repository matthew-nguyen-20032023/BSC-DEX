const CryptoJS = require("crypto-js");
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Wallet, WalletDocument } from "src/models/schemas/wallet.schema";
import { WalletRepository } from "src/models/repositories/wallet.repository";
import { Hedera } from "src/blockchains/hedera";
import { Nft, NftDocument } from "src/models/schemas/nft.schema";
import { NftRepository } from "src/models/repositories/nft.repository";

@Injectable()
export class WalletService {
  private walletRepository: WalletRepository;
  private nftRepository: NftRepository;

  constructor(
    @InjectModel(Wallet.name)
    private readonly walletModel: Model<WalletDocument>,
    @InjectModel(Nft.name)
    private readonly nftModel: Model<NftDocument>,
    private readonly hederaLib: Hedera
  ) {
    this.walletRepository = new WalletRepository(this.walletModel);
    this.nftRepository = new NftRepository(this.nftModel);
  }

  public static decodeWalletPrivateKey(
    encryptWalletPrivateKey: string
  ): string {
    return CryptoJS.AES.decrypt(
      encryptWalletPrivateKey,
      process.env.HEDERA_SECRET_KEY_ENCRYPT
    ).toString(CryptoJS.enc.Utf8);
  }

  public async getUserWallet(
    userId: string
  ): Promise<{ wallet: Wallet; balance: string }> {
    let userWallet = await this.walletRepository.getWalletByUserId(userId);

    if (!userWallet) {
      const newWallet = await this.hederaLib.createNewAccount(userId);
      userWallet = await this.walletRepository.save(newWallet);
    }

    const balance = await this.hederaLib.checkAccountBalance(
      userWallet.accountId
    );

    return { wallet: userWallet, balance: balance };
  }

  public async exportWalletPrivateKey(
    userId: string
  ): Promise<{ privateKey: string }> {
    const { wallet } = await this.getUserWallet(userId);
    return {
      privateKey: WalletService.decodeWalletPrivateKey(wallet.privateKey),
    };
  }

  public async listNft(
    userId: string,
    nftTypes: string[],
    page: number,
    limit: number
  ): Promise<{ nfts: Nft[]; total: number }> {
    return await this.nftRepository.getListNft(userId, nftTypes, page, limit);
  }

  public async mintHBAR(userId: string): Promise<void> {
    const wallet = await this.walletRepository.getWalletByUserId(userId);
    await this.hederaLib.mintHBAR(wallet.accountId);
  }
}
