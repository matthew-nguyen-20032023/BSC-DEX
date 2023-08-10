export enum TradeMessageSuccess {
  GetTradesSuccess = "Get trades successfully.",
  GetOHLCVSuccess = "Get ohlcv successfully.",
  GetOriginTradesSuccess = "Get current origin trades happened success.",
  GetWalletTradesSuccess = "Get wallet trades success.",
}
export enum TradeMessageError {
  InvalidIntervalType = "Interval type does not support.",
}

export enum OHLCVTypeInterval {
  m1 = "1m",
  m3 = "3m",
  m5 = "5m",
  m15 = "15m",
  m30 = "30m",
  h1 = "1h",
  h2 = "2h",
  h4 = "4h",
  h8 = "8h",
  h12 = "12h",
  d1 = "1d",
  d3 = "3d",
  w1 = "1w",
  mth1 = "1mth",
}
