"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NFTErrorMessage = exports.NFTSuccessMessage = void 0;
var NFTSuccessMessage;
(function (NFTSuccessMessage) {
    NFTSuccessMessage["MintNFTSuccess"] = "Mint NFT success";
    NFTSuccessMessage["CreateNewNFTTypeSuccess"] = "Create new type of NFT success";
    NFTSuccessMessage["GetNFTTypeSuccess"] = "Get list type of NFT success";
    NFTSuccessMessage["GetNFTSuccess"] = "Get list of NFT success";
    NFTSuccessMessage["RegisterNFTSuccess"] = "Register NFT success to smart contract";
    NFTSuccessMessage["AssociateTokenSuccess"] = "Associate token success";
    NFTSuccessMessage["PinFileToPinataSuccess"] = "Upload file to pinata success";
    NFTSuccessMessage["GetMyNFTSuccess"] = "Get my NFT success";
    NFTSuccessMessage["UpdateNFTSuccess"] = "Update NFT success";
})(NFTSuccessMessage = exports.NFTSuccessMessage || (exports.NFTSuccessMessage = {}));
var NFTErrorMessage;
(function (NFTErrorMessage) {
    NFTErrorMessage["NftTypeCreated"] = "Exist collection created";
    NFTErrorMessage["PermissionDenied"] = "Permission denied";
    NFTErrorMessage["NftTypeNotFound"] = "Nft type not found";
    NFTErrorMessage["NftTypeNotRegisterYet"] = "Nft type not register to manage smart contract yet";
    NFTErrorMessage["ExistAssociation"] = "Token has associate to account";
    NFTErrorMessage["InvalidReceiverEmail"] = "Receiver email not exist on system";
    NFTErrorMessage["InvalidReceiverWallet"] = "Receiver wallet not exist on system";
})(NFTErrorMessage = exports.NFTErrorMessage || (exports.NFTErrorMessage = {}));
//# sourceMappingURL=nft.const.js.map