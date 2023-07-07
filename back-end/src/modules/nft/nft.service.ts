import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Hedera } from "src/blockchains/hedera";
import { NftTypeRepository } from "src/models/repositories/nft-type.repository";
import { NftType, NftTypeDocument } from "src/models/schemas/nft-type.schema";
import { NFTErrorMessage } from "src/modules/nft/nft.const";
import { Nft, NftDocument } from "src/models/schemas/nft.schema";
import { NftRepository } from "src/models/repositories/nft.repository";
import { Wallet, WalletDocument } from "src/models/schemas/wallet.schema";
import { WalletRepository } from "src/models/repositories/wallet.repository";
import {
  WalletAssociateToken,
  WalletAssociateTokenDocument,
} from "src/models/schemas/wallet_associate_token.schema";
import { WalletAssociateTokenRepository } from "src/models/repositories/wallet-associate-token.repository";
import { WalletService } from "src/modules/wallet/wallet.service";
import { UserRepository } from "src/models/repositories/user.repository";
import { User, UserDocument } from "src/models/schemas/user.schema";
import { TransactionRepository } from "src/models/repositories/transaction.repository";
import {
  Transaction,
  TransactionDocument,
} from "src/models/schemas/transaction.schema";
import { TransactionErrorMessage } from "src/modules/transaction/transaction.const";

@Injectable()
export class NftService {
  private nftTypeRepository: NftTypeRepository;
  private nftRepository: NftRepository;
  private walletRepository: WalletRepository;
  private walletAssociateTokenRepository: WalletAssociateTokenRepository;
  private userRepository: UserRepository;
  private transactionRepository: TransactionRepository;

  constructor(
    @InjectModel(NftType.name)
    private readonly nftTypeModel: Model<NftTypeDocument>,
    @InjectModel(Nft.name)
    private readonly nftModel: Model<NftDocument>,
    @InjectModel(Wallet.name)
    private readonly walletModel: Model<WalletDocument>,
    @InjectModel(WalletAssociateToken.name)
    private readonly walletAssociateTokenModel: Model<WalletAssociateTokenDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
    private readonly hederaLib: Hedera
  ) {
    this.nftTypeRepository = new NftTypeRepository(this.nftTypeModel);
    this.nftRepository = new NftRepository(this.nftModel);
    this.walletRepository = new WalletRepository(this.walletModel);
    this.walletAssociateTokenRepository = new WalletAssociateTokenRepository(
      this.walletAssociateTokenModel
    );
    this.userRepository = new UserRepository(this.userModel);
    this.transactionRepository = new TransactionRepository(
      this.transactionModel
    );
  }

  public async createNewNftType(
    nftType: string,
    nftName: string,
    nftSymbol: string,
    tier: string,
    defaultBalance: number
  ): Promise<NftType> {
    const existNftType = await this.nftTypeRepository.getNftTypeByType(nftType);
    if (existNftType) {
      throw new HttpException(
        { message: NFTErrorMessage.NftTypeCreated },
        HttpStatus.BAD_REQUEST
      );
    }

    const { newNftType, transaction } = await this.hederaLib.createNewNftType(
      nftName,
      nftSymbol
    );
    await this.transactionRepository.save(transaction);
    if (!transaction.status) {
      throw new HttpException(
        { message: TransactionErrorMessage.FailedToExecuteTransaction },
        HttpStatus.BAD_REQUEST
      );
    }

    newNftType.tier = tier;
    newNftType.defaultBalance = defaultBalance;
    newNftType.nftType = nftType;
    newNftType.isRegister = false;
    return this.nftTypeRepository.save(newNftType);
  }

  public async getListNftType(
    page: number,
    limit: number
  ): Promise<{ types: NftType[]; total: number }> {
    const types = await this.nftTypeRepository.getListNftType(page, limit);
    const total = await this.nftTypeRepository.countTotalNftType();
    return { types, total };
  }

  public async getListNFT(
    page: number,
    limit: number
  ): Promise<{ nfts: Nft[]; total: number }> {
    const nfts = await this.nftRepository.listNft(page, limit);
    const total = await this.nftRepository.totalNft();
    return { nfts, total };
  }

  public async registerNftTypeToSmartContract(
    nftTypeId: string
  ): Promise<NftType> {
    const nftType = await this.nftTypeRepository.getNftTypeById(nftTypeId);
    if (!nftType) {
      throw new HttpException(
        { message: NFTErrorMessage.NftTypeNotFound },
        HttpStatus.BAD_REQUEST
      );
    }
    const transaction = await this.hederaLib.registerNFTType(
      nftType.nftType,
      nftType.evmAddress
    );
    await this.transactionRepository.save(transaction);
    if (!transaction.status) {
      throw new HttpException(
        { message: TransactionErrorMessage.FailedToExecuteTransaction },
        HttpStatus.BAD_REQUEST
      );
    }

    nftType.isRegister = true;
    await this.nftTypeRepository.save(nftType);
    return nftType;
  }

  public async mintNFT(
    nftTypeId: string,
    ipfs: string,
    receiverEmail: string,
    tier: string,
    balance: number,
    description: string
  ): Promise<Nft> {
    const user = await this.userRepository.getUserByEmail(receiverEmail);
    if (!user) {
      throw new HttpException(
        { message: NFTErrorMessage.InvalidReceiverEmail },
        HttpStatus.BAD_REQUEST
      );
    }

    const receiverWallet = await this.walletRepository.getWalletByUserId(
      user._id.toString()
    );
    if (!receiverWallet) {
      throw new HttpException(
        { message: NFTErrorMessage.InvalidReceiverWallet },
        HttpStatus.BAD_REQUEST
      );
    }

    const nftType = await this.nftTypeRepository.getNftTypeById(nftTypeId);
    if (!nftType || !nftType.isRegister) {
      throw new HttpException(
        { message: NFTErrorMessage.NftTypeNotRegisterYet },
        HttpStatus.BAD_REQUEST
      );
    }

    if (
      !(await this.isAssociateToken(user._id.toString(), nftType.accountId))
    ) {
      await this.associateTokenToAccount(user._id.toString(), nftTypeId);
    }

    const { tokenId, transaction } = await this.hederaLib.mintNFT(
      nftType.nftType,
      receiverWallet.evmAddress,
      tier ? tier : nftType.tier,
      balance ? balance : nftType.defaultBalance,
      [new TextEncoder().encode(ipfs)]
    );
    await this.transactionRepository.save(transaction);
    if (!transaction.status) {
      throw new HttpException(
        { message: TransactionErrorMessage.FailedToExecuteTransaction },
        HttpStatus.BAD_REQUEST
      );
    }

    const newNftMinted = new Nft();
    newNftMinted.nftType = nftType.nftType;
    newNftMinted.tokenId = tokenId;
    newNftMinted.isStake = false;
    newNftMinted.ownerId = receiverWallet.userId;
    newNftMinted.tier = tier ? tier : nftType.tier;
    newNftMinted.balance = balance ? balance : nftType.defaultBalance;
    newNftMinted.ipfs = ipfs;
    newNftMinted.description = description;
    return this.nftRepository.save(newNftMinted);
  }

  public async updateNFT(
    nftId: string,
    ipfs: string,
    tier: string,
    balance: number
  ): Promise<Nft> {
    const nft = await this.nftRepository.getNftById(nftId);

    let isCallSc = false;
    if (ipfs && ipfs !== nft.ipfs) nft.ipfs = ipfs;
    if (tier && tier !== nft.tier) {
      isCallSc = true;
      nft.tier = tier;
    }
    if (balance && balance !== nft.balance) {
      isCallSc = true;
      nft.balance = balance;
    }

    if (ipfs) {
      nft.ipfs = ipfs;
    }

    if (isCallSc) {
      const transaction = await this.hederaLib.setNFTProperty(
        nft.nftType,
        nft.tokenId,
        nft.tier,
        nft.balance
      );
      await this.transactionRepository.save(transaction);
      if (!transaction.status) {
        throw new HttpException(
          { message: TransactionErrorMessage.FailedToExecuteTransaction },
          HttpStatus.BAD_REQUEST
        );
      }
    }

    return this.nftRepository.save(nft);
  }

  public async isAssociateToken(
    userId: string,
    tokenId: string
  ): Promise<boolean> {
    const existAssociation =
      await this.walletAssociateTokenRepository.getUserAssociateToken(
        userId,
        tokenId
      );
    return !!existAssociation;
  }

  public async associateTokenToAccount(
    userId: string,
    nftTypeId: string
  ): Promise<WalletAssociateToken> {
    const userWallet = await this.walletRepository.getWalletByUserId(userId);
    const nftType = await this.nftTypeRepository.getNftTypeById(nftTypeId);

    if (await this.isAssociateToken(userId, nftType.accountId)) {
      throw new HttpException(
        { message: NFTErrorMessage.ExistAssociation },
        HttpStatus.BAD_REQUEST
      );
    }

    const transaction = await this.hederaLib.associateTokenToWallet(
      userWallet.accountId,
      WalletService.decodeWalletPrivateKey(userWallet.privateKey),
      [nftType.accountId]
    );
    await this.transactionRepository.save(transaction);
    if (!transaction.status) {
      throw new HttpException(
        { message: TransactionErrorMessage.FailedToExecuteTransaction },
        HttpStatus.BAD_REQUEST
      );
    }

    const newAssociation = new WalletAssociateToken();
    newAssociation.tokenId = nftType.accountId;
    newAssociation.userId = userId;
    return this.walletAssociateTokenRepository.save(newAssociation);
  }
}
