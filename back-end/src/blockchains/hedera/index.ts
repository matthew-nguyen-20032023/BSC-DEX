import BigNumber from "bignumber.js";
const CryptoJS = require("crypto-js");
import {
  Client,
  ContractFunctionParameters,
  ContractExecuteTransaction,
  PrivateKey,
  AccountCreateTransaction,
  TokenAssociateTransaction,
  TransactionRecord,
  AccountId,
  TransferTransaction,
  AccountBalanceQuery,
  Hbar,
  TokenMintTransaction,
} from "@hashgraph/sdk";
import { IResponseCallFunctionOnChain } from "src/blockchains/hedera/hedera.interface";
import { Wallet } from "src/models/schemas/wallet.schema";
import { hethers } from "@hashgraph/hethers";
import { NftType } from "src/models/schemas/nft-type.schema";
import { SmartContractManageNFTFunction } from "src/blockchains/hedera/hedera.const";
import {
  Transaction,
  TransactionType,
} from "src/models/schemas/transaction.schema";

export class Hedera {
  protected client: Client;

  public constructor() {
    this.client =
      process.env.NODE_ENV === "production"
        ? Client.forMainnet()
        : Client.forPreviewnet();
    this.client.setOperator(
      process.env.HEDERA_ADMIN_WALLET,
      process.env.HEDERA_ADMIN_PRIVATE_KEY
    );
  }

  /**
   * @description Use when want to change wallet interact with hedera network
   * @param accountId
   * @param privateKey
   */
  public async setOperator(
    accountId: string,
    privateKey: string
  ): Promise<void> {
    this.client.setOperator(accountId, privateKey);
  }

  /**
   * Any logic interacting with smart contract on hedera chain have to call throw this function
   * @param contractId Id of contract after deployed on hedera chain. ex: 0.0.3992423
   * @param functionCalled Name of exist function on smart contract and can be called. ex: Mint
   * @param functionParameters Parameters input follow ContractFunctionParameters format of hashgraph/sdk
   * @param callBackReturn Optional: Used when want to get back data return of function on smart contract
   * @param maxGas Optional: Used when want to set more gas for priority transaction
   * @param payableAmount Optional: Used for send HBAR related to bussiness needed
   * @private
   */
  private async callFunctionOnChain(
    contractId: string,
    functionCalled: string,
    functionParameters: ContractFunctionParameters,
    callBackReturn?: Function,
    maxGas?: number,
    payableAmount?: number
  ): Promise<IResponseCallFunctionOnChain> {
    try {
      const contractExecuteTx = new ContractExecuteTransaction()
        .setContractId(contractId)
        .setFunction(functionCalled, functionParameters)
        .setGas(Number(process.env.DEFAULT_HEDERA_GAS));
      if (maxGas) contractExecuteTx.setGas(maxGas);
      if (payableAmount) contractExecuteTx.setPayableAmount(payableAmount);

      const contractExecuteSubmit = await contractExecuteTx.execute(
        this.client
      );
      await contractExecuteSubmit.getReceipt(this.client);

      let dataCallback;
      if (callBackReturn) {
        const transactionRecord = await contractExecuteSubmit.getRecord(
          this.client
        );
        dataCallback = await callBackReturn(transactionRecord);
      }

      return {
        transactionId: contractExecuteSubmit.transactionId.toString(),
        status: true,
        message: "Success",
        dataCallback,
      };
    } catch (error) {
      console.log(error);
      return {
        transactionId: error.transactionId.toString(),
        status: false,
        message: error.message,
      };
    }
  }

  private static createTransaction(
    transactionType: TransactionType,
    transactionId: string,
    status: boolean
  ): Transaction {
    const newTransaction = new Transaction();
    newTransaction.transactionId = transactionId;
    newTransaction.type = transactionType;
    newTransaction.status = status;
    return newTransaction;
  }

  public async associateTokenToWallet(
    accountId: string,
    accountPrivateKey: string,
    tokenIds: string[]
  ): Promise<Transaction> {
    const transaction = await new TokenAssociateTransaction()
      .setAccountId(accountId)
      .setTokenIds(tokenIds)
      .freezeWith(this.client);
    const signTx = await transaction.sign(
      PrivateKey.fromString(accountPrivateKey)
    );
    const txResponse = await signTx.execute(this.client);
    try {
      await txResponse.getReceipt(this.client);
      return Hedera.createTransaction(
        TransactionType.TokenAssociate,
        txResponse.transactionId.toString(),
        true
      );
    } catch (error) {
      return Hedera.createTransaction(
        TransactionType.TokenAssociate,
        txResponse.transactionId.toString(),
        false
      );
    }
  }

  /**
   * @description Create wallet for user on Hedera chain
   * @param userId
   */
  public async createNewAccount(userId: string): Promise<Wallet> {
    const newAccountPrivateKey = PrivateKey.generateED25519();
    const newAccountPublicKey = newAccountPrivateKey.publicKey;
    const transaction = await new AccountCreateTransaction()
      .setKey(newAccountPublicKey)
      .execute(this.client);

    const getReceipt = await transaction.getReceipt(this.client);
    const newAccountId = getReceipt.accountId;

    const newWallet = new Wallet();
    newWallet.userId = userId;
    newWallet.accountId = newAccountId.toString();
    newWallet.evmAddress = hethers.utils.getAddressFromAccount(
      newAccountId.toString()
    );
    newWallet.privateKey = CryptoJS.AES.encrypt(
      newAccountPrivateKey.toString(),
      process.env.HEDERA_SECRET_KEY_ENCRYPT
    ).toString();
    newWallet.publicKey = newAccountPublicKey.toString();
    return newWallet;
  }

  /**
   * @description Create new type of NFT on Hedera chain
   * @param nftName
   * @param nftSymbol
   */
  public async createNewNftType(
    nftName: string,
    nftSymbol: string
  ): Promise<{ newNftType: NftType; transaction: Transaction }> {
    const getNftTypeCreatedInfo = (
      transactionRecord: TransactionRecord
    ): { emvAddress: string; accountId: string } => {
      const NFTAddress = transactionRecord.contractFunctionResult.getAddress(0);
      const NFTAccountId = AccountId.fromSolidityAddress(NFTAddress);
      return { emvAddress: NFTAddress, accountId: NFTAccountId.toString() };
    };

    const result = await this.callFunctionOnChain(
      process.env.SMART_CONTRACT_MANAGE_NFT,
      SmartContractManageNFTFunction.CreateNonFungibleToken,
      new ContractFunctionParameters()
        .addString(nftName)
        .addString(nftSymbol)
        .addInt64(new BigNumber(process.env.HEDERA_NFT_AUTO_RENEWABLE)),
      getNftTypeCreatedInfo,
      Number(process.env.HEDERA_CREATE_NFT_TYPE_MAX_GAS),
      Number(process.env.HEDERA_CREATE_NFT_TYPE_MAX_PAYABLE)
    );

    if (!result.status) {
      return {
        newNftType: null,
        transaction: Hedera.createTransaction(
          TransactionType.NewNftTypeCreated,
          result.transactionId,
          result.status
        ),
      };
    }

    const newNftType = new NftType();
    newNftType.name = nftName;
    newNftType.symbol = nftSymbol;
    newNftType.evmAddress = result.dataCallback.emvAddress;
    newNftType.accountId = result.dataCallback.accountId;
    return {
      newNftType: newNftType,
      transaction: Hedera.createTransaction(
        TransactionType.NewNftTypeCreated,
        result.transactionId,
        result.status
      ),
    };
  }

  /**
   * @description Register NFT type created above to management NFT smart contract
   * @param nftType
   * @param NFTEvmAddress
   */
  public async registerNFTType(
    nftType: string,
    NFTEvmAddress: string
  ): Promise<Transaction> {
    const result = await this.callFunctionOnChain(
      process.env.SMART_CONTRACT_MANAGE_NFT,
      SmartContractManageNFTFunction.RegisterNFTType,
      new ContractFunctionParameters()
        .addString(nftType)
        .addAddress(NFTEvmAddress)
    );
    return Hedera.createTransaction(
      TransactionType.NftTypeRegister,
      result.transactionId,
      result.status
    );
  }

  /**
   * @description Mint NFT by type. Only NFT type register can mint and only owner of smart contract can call
   * @param NFTType
   * @param evmReceiverAddress
   * @param tier
   * @param balance
   * @param metadata
   */
  public async mintNFT(
    NFTType: string,
    evmReceiverAddress: string,
    tier: string,
    balance: number,
    metadata: Uint8Array[]
  ): Promise<{ tokenId: number; transaction: Transaction }> {
    const getTokenIdOfNFT = (
      transactionRecord: TransactionRecord
    ): { tokenId: number; transaction: Transaction } => {
      const NFTSerial = transactionRecord.contractFunctionResult
        .getInt64(1)
        .toNumber();
      return {
        tokenId: NFTSerial,
        transaction: Hedera.createTransaction(
          TransactionType.NftMinted,
          transactionRecord.transactionId.toString(),
          true
        ),
      };
    };

    const result = await this.callFunctionOnChain(
      process.env.SMART_CONTRACT_MANAGE_NFT,
      SmartContractManageNFTFunction.MintNFT,
      new ContractFunctionParameters()
        .addString(NFTType)
        .addAddress(evmReceiverAddress)
        .addString(tier)
        .addInt64(new BigNumber(balance))
        .addBytesArray(metadata),
      getTokenIdOfNFT
    );

    if (!result.status) {
      return {
        tokenId: null,
        transaction: Hedera.createTransaction(
          TransactionType.NftMinted,
          result.transactionId,
          false
        ),
      };
    }

    return result.dataCallback;
  }

  public async configStakeRule(
    stakeType: string,
    duration: number,
    rewardBalance: number,
    penaltyBalance: number
  ): Promise<Transaction> {
    const result = await this.callFunctionOnChain(
      process.env.SMART_CONTRACT_MANAGE_NFT,
      SmartContractManageNFTFunction.ConfigStakeRule,
      new ContractFunctionParameters()
        .addString(stakeType)
        .addInt64(new BigNumber(duration))
        .addInt64(new BigNumber(rewardBalance))
        .addInt64(new BigNumber(penaltyBalance))
    );
    return Hedera.createTransaction(
      TransactionType.ConfigStakeRule,
      result.transactionId,
      result.status
    );
  }

  public async stakeNFT(
    stakeType: string,
    nftType: string,
    tokenId: number
  ): Promise<Transaction> {
    const result = await this.callFunctionOnChain(
      process.env.SMART_CONTRACT_MANAGE_NFT,
      SmartContractManageNFTFunction.StakeNFT,
      new ContractFunctionParameters()
        .addString(stakeType)
        .addString(nftType)
        .addInt64(new BigNumber(tokenId))
    );
    return Hedera.createTransaction(
      TransactionType.StakeNft,
      result.transactionId.toString(),
      result.status
    );
  }

  public async unStakeNft(
    nftType: string,
    tokenId: number
  ): Promise<Transaction> {
    const result = await this.callFunctionOnChain(
      process.env.SMART_CONTRACT_MANAGE_NFT,
      SmartContractManageNFTFunction.UnStakeNFT,
      new ContractFunctionParameters()
        .addString(nftType)
        .addInt64(new BigNumber(tokenId))
    );
    return Hedera.createTransaction(
      TransactionType.UnStakeNft,
      result.transactionId.toString(),
      result.status
    );
  }

  public async setNFTProperty(
    nftType: string,
    tokenId: number,
    tier: string,
    balance: number
  ): Promise<Transaction> {
    const result = await this.callFunctionOnChain(
      process.env.SMART_CONTRACT_MANAGE_NFT,
      SmartContractManageNFTFunction.setNFTProperty,
      new ContractFunctionParameters()
        .addString(nftType)
        .addInt64(new BigNumber(tokenId))
        .addString(tier)
        .addInt64(new BigNumber(balance))
    );
    return Hedera.createTransaction(
      TransactionType.SetNFTProperty,
      result.transactionId.toString(),
      result.status
    );
  }

  public async setMetaData(
    nftAccountId: string,
    metadata: Uint8Array[]
  ): Promise<Transaction> {
    const transaction = await new TokenMintTransaction()
      .setTokenId(nftAccountId)
      .setMetadata(metadata)
      .execute(this.client);
    await transaction.getReceipt(this.client);
    return Hedera.createTransaction(
      TransactionType.UpdateNFTMetadata,
      transaction.transactionId.toString(),
      true
    );
  }

  public async mintHBAR(accountId: string): Promise<void> {
    const transaction = await new TransferTransaction()
      .addHbarTransfer("0.0.1086", Hbar.fromTinybars(-50000000000)) //Sending account
      .addHbarTransfer(accountId, Hbar.fromTinybars(50000000000)) //Receiving account
      .execute(this.client);

    await transaction.getReceipt(this.client);
  }

  public async checkAccountBalance(accountId: string): Promise<string> {
    const query = new AccountBalanceQuery().setAccountId(accountId);
    const accountBalance = await query.execute(this.client);
    return accountBalance.toString();
  }
}
