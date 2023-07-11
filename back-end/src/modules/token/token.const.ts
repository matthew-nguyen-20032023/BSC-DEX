/**
 * @description: Message use for return for client
 */
export enum TokenMessageSuccess {
  AddTokenSuccess = "Add token success",
  ListTokenSuccess = "List token success",
  GetTokenDetailSuccess = "Get token detail success",
}

export enum TokenMessageError {
  ExistTokenAdded = "Exist token added",
  TokenNotFound = "Token not found",
}
