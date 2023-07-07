"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NftService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const hedera_1 = require("../../blockchains/hedera");
const nft_type_repository_1 = require("../../models/repositories/nft-type.repository");
const nft_type_schema_1 = require("../../models/schemas/nft-type.schema");
const nft_const_1 = require("./nft.const");
const nft_schema_1 = require("../../models/schemas/nft.schema");
const nft_repository_1 = require("../../models/repositories/nft.repository");
const wallet_schema_1 = require("../../models/schemas/wallet.schema");
const wallet_repository_1 = require("../../models/repositories/wallet.repository");
const wallet_associate_token_schema_1 = require("../../models/schemas/wallet_associate_token.schema");
const wallet_associate_token_repository_1 = require("../../models/repositories/wallet-associate-token.repository");
const wallet_service_1 = require("../wallet/wallet.service");
const user_repository_1 = require("../../models/repositories/user.repository");
const user_schema_1 = require("../../models/schemas/user.schema");
const transaction_repository_1 = require("../../models/repositories/transaction.repository");
const transaction_schema_1 = require("../../models/schemas/transaction.schema");
const transaction_const_1 = require("../transaction/transaction.const");
let NftService = class NftService {
    constructor(nftTypeModel, nftModel, walletModel, walletAssociateTokenModel, userModel, transactionModel, hederaLib) {
        this.nftTypeModel = nftTypeModel;
        this.nftModel = nftModel;
        this.walletModel = walletModel;
        this.walletAssociateTokenModel = walletAssociateTokenModel;
        this.userModel = userModel;
        this.transactionModel = transactionModel;
        this.hederaLib = hederaLib;
        this.nftTypeRepository = new nft_type_repository_1.NftTypeRepository(this.nftTypeModel);
        this.nftRepository = new nft_repository_1.NftRepository(this.nftModel);
        this.walletRepository = new wallet_repository_1.WalletRepository(this.walletModel);
        this.walletAssociateTokenRepository = new wallet_associate_token_repository_1.WalletAssociateTokenRepository(this.walletAssociateTokenModel);
        this.userRepository = new user_repository_1.UserRepository(this.userModel);
        this.transactionRepository = new transaction_repository_1.TransactionRepository(this.transactionModel);
    }
    async createNewNftType(nftType, nftName, nftSymbol, tier, defaultBalance) {
        const existNftType = await this.nftTypeRepository.getNftTypeByType(nftType);
        if (existNftType) {
            throw new common_1.HttpException({ message: nft_const_1.NFTErrorMessage.NftTypeCreated }, common_1.HttpStatus.BAD_REQUEST);
        }
        const { newNftType, transaction } = await this.hederaLib.createNewNftType(nftName, nftSymbol);
        await this.transactionRepository.save(transaction);
        if (!transaction.status) {
            throw new common_1.HttpException({ message: transaction_const_1.TransactionErrorMessage.FailedToExecuteTransaction }, common_1.HttpStatus.BAD_REQUEST);
        }
        newNftType.tier = tier;
        newNftType.defaultBalance = defaultBalance;
        newNftType.nftType = nftType;
        newNftType.isRegister = false;
        return this.nftTypeRepository.save(newNftType);
    }
    async getListNftType(page, limit) {
        const types = await this.nftTypeRepository.getListNftType(page, limit);
        const total = await this.nftTypeRepository.countTotalNftType();
        return { types, total };
    }
    async getListNFT(page, limit) {
        const nfts = await this.nftRepository.listNft(page, limit);
        const total = await this.nftRepository.totalNft();
        return { nfts, total };
    }
    async registerNftTypeToSmartContract(nftTypeId) {
        const nftType = await this.nftTypeRepository.getNftTypeById(nftTypeId);
        if (!nftType) {
            throw new common_1.HttpException({ message: nft_const_1.NFTErrorMessage.NftTypeNotFound }, common_1.HttpStatus.BAD_REQUEST);
        }
        const transaction = await this.hederaLib.registerNFTType(nftType.nftType, nftType.evmAddress);
        await this.transactionRepository.save(transaction);
        if (!transaction.status) {
            throw new common_1.HttpException({ message: transaction_const_1.TransactionErrorMessage.FailedToExecuteTransaction }, common_1.HttpStatus.BAD_REQUEST);
        }
        nftType.isRegister = true;
        await this.nftTypeRepository.save(nftType);
        return nftType;
    }
    async mintNFT(nftTypeId, ipfs, receiverEmail, tier, balance, description) {
        const user = await this.userRepository.getUserByEmail(receiverEmail);
        if (!user) {
            throw new common_1.HttpException({ message: nft_const_1.NFTErrorMessage.InvalidReceiverEmail }, common_1.HttpStatus.BAD_REQUEST);
        }
        const receiverWallet = await this.walletRepository.getWalletByUserId(user._id.toString());
        if (!receiverWallet) {
            throw new common_1.HttpException({ message: nft_const_1.NFTErrorMessage.InvalidReceiverWallet }, common_1.HttpStatus.BAD_REQUEST);
        }
        const nftType = await this.nftTypeRepository.getNftTypeById(nftTypeId);
        if (!nftType || !nftType.isRegister) {
            throw new common_1.HttpException({ message: nft_const_1.NFTErrorMessage.NftTypeNotRegisterYet }, common_1.HttpStatus.BAD_REQUEST);
        }
        if (!(await this.isAssociateToken(user._id.toString(), nftType.accountId))) {
            await this.associateTokenToAccount(user._id.toString(), nftTypeId);
        }
        const { tokenId, transaction } = await this.hederaLib.mintNFT(nftType.nftType, receiverWallet.evmAddress, tier ? tier : nftType.tier, balance ? balance : nftType.defaultBalance, [new TextEncoder().encode(ipfs)]);
        await this.transactionRepository.save(transaction);
        if (!transaction.status) {
            throw new common_1.HttpException({ message: transaction_const_1.TransactionErrorMessage.FailedToExecuteTransaction }, common_1.HttpStatus.BAD_REQUEST);
        }
        const newNftMinted = new nft_schema_1.Nft();
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
    async updateNFT(nftId, ipfs, tier, balance) {
        const nft = await this.nftRepository.getNftById(nftId);
        let isCallSc = false;
        if (ipfs && ipfs !== nft.ipfs)
            nft.ipfs = ipfs;
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
            const transaction = await this.hederaLib.setNFTProperty(nft.nftType, nft.tokenId, nft.tier, nft.balance);
            await this.transactionRepository.save(transaction);
            if (!transaction.status) {
                throw new common_1.HttpException({ message: transaction_const_1.TransactionErrorMessage.FailedToExecuteTransaction }, common_1.HttpStatus.BAD_REQUEST);
            }
        }
        return this.nftRepository.save(nft);
    }
    async isAssociateToken(userId, tokenId) {
        const existAssociation = await this.walletAssociateTokenRepository.getUserAssociateToken(userId, tokenId);
        return !!existAssociation;
    }
    async associateTokenToAccount(userId, nftTypeId) {
        const userWallet = await this.walletRepository.getWalletByUserId(userId);
        const nftType = await this.nftTypeRepository.getNftTypeById(nftTypeId);
        if (await this.isAssociateToken(userId, nftType.accountId)) {
            throw new common_1.HttpException({ message: nft_const_1.NFTErrorMessage.ExistAssociation }, common_1.HttpStatus.BAD_REQUEST);
        }
        const transaction = await this.hederaLib.associateTokenToWallet(userWallet.accountId, wallet_service_1.WalletService.decodeWalletPrivateKey(userWallet.privateKey), [nftType.accountId]);
        await this.transactionRepository.save(transaction);
        if (!transaction.status) {
            throw new common_1.HttpException({ message: transaction_const_1.TransactionErrorMessage.FailedToExecuteTransaction }, common_1.HttpStatus.BAD_REQUEST);
        }
        const newAssociation = new wallet_associate_token_schema_1.WalletAssociateToken();
        newAssociation.tokenId = nftType.accountId;
        newAssociation.userId = userId;
        return this.walletAssociateTokenRepository.save(newAssociation);
    }
};
NftService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(nft_type_schema_1.NftType.name)),
    tslib_1.__param(1, (0, mongoose_1.InjectModel)(nft_schema_1.Nft.name)),
    tslib_1.__param(2, (0, mongoose_1.InjectModel)(wallet_schema_1.Wallet.name)),
    tslib_1.__param(3, (0, mongoose_1.InjectModel)(wallet_associate_token_schema_1.WalletAssociateToken.name)),
    tslib_1.__param(4, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    tslib_1.__param(5, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    tslib_1.__metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        hedera_1.Hedera])
], NftService);
exports.NftService = NftService;
//# sourceMappingURL=nft.service.js.map