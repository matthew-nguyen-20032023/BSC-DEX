export enum PairMessageSuccess {
  CreatePairSuccess = "Create pair success.",
  ListPairSuccess = "List pair success",
}

export enum PairMessageError {
  BaseTokenNotFound = "Base token not found.",
  QuoteTokenNotFound = "Quote token not found.",
  PairExist = "Pair exist.",
  PairNotFound = "Pair not found",
  SameBaseQuoteToken = "Can not create pair with same base and quote token"
}
