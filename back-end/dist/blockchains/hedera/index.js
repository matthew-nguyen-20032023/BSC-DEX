"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hedera = void 0;
const bignumber_js_1 = require("bignumber.js");
const CryptoJS = require("crypto-js");
const sdk_1 = require("@hashgraph/sdk");
const wallet_schema_1 = require("../../models/schemas/wallet.schema");
const hethers_1 = require("@hashgraph/hethers");
const nft_type_schema_1 = require("../../models/schemas/nft-type.schema");
const hedera_const_1 = require("./hedera.const");
const transaction_schema_1 = require("../../models/schemas/transaction.schema");
class Hedera {
    constructor() {
        this.client =
            process.env.NODE_ENV === "production"
                ? sdk_1.Client.forMainnet()
                : sdk_1.Client.forPreviewnet();
        this.client.setOperator(process.env.HEDERA_ADMIN_WALLET, process.env.HEDERA_ADMIN_PRIVATE_KEY);
    }
    async setOperator(accountId, privateKey) {
        this.client.setOperator(accountId, privateKey);
    }
    async callFunctionOnChain(contractId, functionCalled, functionParameters, callBackReturn, maxGas, payableAmount) {
        try {
            const contractExecuteTx = new sdk_1.ContractExecuteTransaction()
                .setContractId(contractId)
                .setFunction(functionCalled, functionParameters)
                .setGas(Number(process.env.DEFAULT_HEDERA_GAS));
            if (maxGas)
                contractExecuteTx.setGas(maxGas);
            if (payableAmount)
                contractExecuteTx.setPayableAmount(payableAmount);
            const contractExecuteSubmit = await contractExecuteTx.execute(this.client);
            await contractExecuteSubmit.getReceipt(this.client);
            let dataCallback;
            if (callBackReturn) {
                const transactionRecord = await contractExecuteSubmit.getRecord(this.client);
                dataCallback = await callBackReturn(transactionRecord);
            }
            return {
                transactionId: contractExecuteSubmit.transactionId.toString(),
                status: true,
                message: "Success",
                dataCallback,
            };
        }
        catch (error) {
            console.log(error);
            return {
                transactionId: error.transactionId.toString(),
                status: false,
                message: error.message,
            };
        }
    }
    static createTransaction(transactionType, transactionId, status) {
        const newTransaction = new transaction_schema_1.Transaction();
        newTransaction.transactionId = transactionId;
        newTransaction.type = transactionType;
        newTransaction.status = status;
        return newTransaction;
    }
    async associateTokenToWallet(accountId, accountPrivateKey, tokenIds) {
        const transaction = await new sdk_1.TokenAssociateTransaction()
            .setAccountId(accountId)
            .setTokenIds(tokenIds)
            .freezeWith(this.client);
        const signTx = await transaction.sign(sdk_1.PrivateKey.fromString(accountPrivateKey));
        const txResponse = await signTx.execute(this.client);
        try {
            await txResponse.getReceipt(this.client);
            return Hedera.createTransaction(transaction_schema_1.TransactionType.TokenAssociate, txResponse.transactionId.toString(), true);
        }
        catch (error) {
            return Hedera.createTransaction(transaction_schema_1.TransactionType.TokenAssociate, txResponse.transactionId.toString(), false);
        }
    }
    async createNewAccount(userId) {
        const newAccountPrivateKey = sdk_1.PrivateKey.generateED25519();
        const newAccountPublicKey = newAccountPrivateKey.publicKey;
        const transaction = await new sdk_1.AccountCreateTransaction()
            .setKey(newAccountPublicKey)
            .execute(this.client);
        const getReceipt = await transaction.getReceipt(this.client);
        const newAccountId = getReceipt.accountId;
        const newWallet = new wallet_schema_1.Wallet();
        newWallet.userId = userId;
        newWallet.accountId = newAccountId.toString();
        newWallet.evmAddress = hethers_1.hethers.utils.getAddressFromAccount(newAccountId.toString());
        newWallet.privateKey = CryptoJS.AES.encrypt(newAccountPrivateKey.toString(), process.env.HEDERA_SECRET_KEY_ENCRYPT).toString();
        newWallet.publicKey = newAccountPublicKey.toString();
        return newWallet;
    }
    async createNewNftType(nftName, nftSymbol) {
        const getNftTypeCreatedInfo = (transactionRecord) => {
            const NFTAddress = transactionRecord.contractFunctionResult.getAddress(0);
            const NFTAccountId = sdk_1.AccountId.fromSolidityAddress(NFTAddress);
            return { emvAddress: NFTAddress, accountId: NFTAccountId.toString() };
        };
        const result = await this.callFunctionOnChain(process.env.SMART_CONTRACT_MANAGE_NFT, hedera_const_1.SmartContractManageNFTFunction.CreateNonFungibleToken, new sdk_1.ContractFunctionParameters()
            .addString(nftName)
            .addString(nftSymbol)
            .addInt64(new bignumber_js_1.default(process.env.HEDERA_NFT_AUTO_RENEWABLE)), getNftTypeCreatedInfo, Number(process.env.HEDERA_CREATE_NFT_TYPE_MAX_GAS), Number(process.env.HEDERA_CREATE_NFT_TYPE_MAX_PAYABLE));
        if (!result.status) {
            return {
                newNftType: null,
                transaction: Hedera.createTransaction(transaction_schema_1.TransactionType.NewNftTypeCreated, result.transactionId, result.status),
            };
        }
        const newNftType = new nft_type_schema_1.NftType();
        newNftType.name = nftName;
        newNftType.symbol = nftSymbol;
        newNftType.evmAddress = result.dataCallback.emvAddress;
        newNftType.accountId = result.dataCallback.accountId;
        return {
            newNftType: newNftType,
            transaction: Hedera.createTransaction(transaction_schema_1.TransactionType.NewNftTypeCreated, result.transactionId, result.status),
        };
    }
    async registerNFTType(nftType, NFTEvmAddress) {
        const result = await this.callFunctionOnChain(process.env.SMART_CONTRACT_MANAGE_NFT, hedera_const_1.SmartContractManageNFTFunction.RegisterNFTType, new sdk_1.ContractFunctionParameters()
            .addString(nftType)
            .addAddress(NFTEvmAddress));
        return Hedera.createTransaction(transaction_schema_1.TransactionType.NftTypeRegister, result.transactionId, result.status);
    }
    async mintNFT(NFTType, evmReceiverAddress, tier, balance, metadata) {
        const getTokenIdOfNFT = (transactionRecord) => {
            const NFTSerial = transactionRecord.contractFunctionResult
                .getInt64(1)
                .toNumber();
            return {
                tokenId: NFTSerial,
                transaction: Hedera.createTransaction(transaction_schema_1.TransactionType.NftMinted, transactionRecord.transactionId.toString(), true),
            };
        };
        const result = await this.callFunctionOnChain(process.env.SMART_CONTRACT_MANAGE_NFT, hedera_const_1.SmartContractManageNFTFunction.MintNFT, new sdk_1.ContractFunctionParameters()
            .addString(NFTType)
            .addAddress(evmReceiverAddress)
            .addString(tier)
            .addInt64(new bignumber_js_1.default(balance))
            .addBytesArray(metadata), getTokenIdOfNFT);
        if (!result.status) {
            return {
                tokenId: null,
                transaction: Hedera.createTransaction(transaction_schema_1.TransactionType.NftMinted, result.transactionId, false),
            };
        }
        return result.dataCallback;
    }
    async configStakeRule(stakeType, duration, rewardBalance, penaltyBalance) {
        const result = await this.callFunctionOnChain(process.env.SMART_CONTRACT_MANAGE_NFT, hedera_const_1.SmartContractManageNFTFunction.ConfigStakeRule, new sdk_1.ContractFunctionParameters()
            .addString(stakeType)
            .addInt64(new bignumber_js_1.default(duration))
            .addInt64(new bignumber_js_1.default(rewardBalance))
            .addInt64(new bignumber_js_1.default(penaltyBalance)));
        return Hedera.createTransaction(transaction_schema_1.TransactionType.ConfigStakeRule, result.transactionId, result.status);
    }
    async stakeNFT(stakeType, nftType, tokenId) {
        const result = await this.callFunctionOnChain(process.env.SMART_CONTRACT_MANAGE_NFT, hedera_const_1.SmartContractManageNFTFunction.StakeNFT, new sdk_1.ContractFunctionParameters()
            .addString(stakeType)
            .addString(nftType)
            .addInt64(new bignumber_js_1.default(tokenId)));
        return Hedera.createTransaction(transaction_schema_1.TransactionType.StakeNft, result.transactionId.toString(), result.status);
    }
    async unStakeNft(nftType, tokenId) {
        const result = await this.callFunctionOnChain(process.env.SMART_CONTRACT_MANAGE_NFT, hedera_const_1.SmartContractManageNFTFunction.UnStakeNFT, new sdk_1.ContractFunctionParameters()
            .addString(nftType)
            .addInt64(new bignumber_js_1.default(tokenId)));
        return Hedera.createTransaction(transaction_schema_1.TransactionType.UnStakeNft, result.transactionId.toString(), result.status);
    }
    async setNFTProperty(nftType, tokenId, tier, balance) {
        const result = await this.callFunctionOnChain(process.env.SMART_CONTRACT_MANAGE_NFT, hedera_const_1.SmartContractManageNFTFunction.setNFTProperty, new sdk_1.ContractFunctionParameters()
            .addString(nftType)
            .addInt64(new bignumber_js_1.default(tokenId))
            .addString(tier)
            .addInt64(new bignumber_js_1.default(balance)));
        return Hedera.createTransaction(transaction_schema_1.TransactionType.SetNFTProperty, result.transactionId.toString(), result.status);
    }
    async setMetaData(nftAccountId, metadata) {
        const transaction = await new sdk_1.TokenMintTransaction()
            .setTokenId(nftAccountId)
            .setMetadata(metadata)
            .execute(this.client);
        await transaction.getReceipt(this.client);
        return Hedera.createTransaction(transaction_schema_1.TransactionType.UpdateNFTMetadata, transaction.transactionId.toString(), true);
    }
    async mintHBAR(accountId) {
        const transaction = await new sdk_1.TransferTransaction()
            .addHbarTransfer("0.0.1086", sdk_1.Hbar.fromTinybars(-50000000000))
            .addHbarTransfer(accountId, sdk_1.Hbar.fromTinybars(50000000000))
            .execute(this.client);
        await transaction.getReceipt(this.client);
    }
    async checkAccountBalance(accountId) {
        const query = new sdk_1.AccountBalanceQuery().setAccountId(accountId);
        const accountBalance = await query.execute(this.client);
        return accountBalance.toString();
    }
}
exports.Hedera = Hedera;
//# sourceMappingURL=index.js.map