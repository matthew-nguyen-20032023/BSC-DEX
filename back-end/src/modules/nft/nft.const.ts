export enum NFTSuccessMessage {
  MintNFTSuccess = "Mint NFT success",
  CreateNewNFTTypeSuccess = "Create new type of NFT success",
  GetNFTTypeSuccess = "Get list type of NFT success",
  GetNFTSuccess = "Get list of NFT success",
  RegisterNFTSuccess = "Register NFT success to smart contract",
  AssociateTokenSuccess = "Associate token success",
  PinFileToPinataSuccess = "Upload file to pinata success",
  GetMyNFTSuccess = "Get my NFT success",
  UpdateNFTSuccess = "Update NFT success",
}

export enum NFTErrorMessage {
  NftTypeCreated = "Exist collection created",
  PermissionDenied = "Permission denied",
  NftTypeNotFound = "Nft type not found",
  NftTypeNotRegisterYet = "Nft type not register to manage smart contract yet",
  ExistAssociation = "Token has associate to account",
  InvalidReceiverEmail = "Receiver email not exist on system",
  InvalidReceiverWallet = "Receiver wallet not exist on system",
}
