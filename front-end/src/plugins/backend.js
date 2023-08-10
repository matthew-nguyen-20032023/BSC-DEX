import axios from "axios";

export const createOrder = async (data) => {
  return axios.post(`${process.env.VUE_APP_BACKEND_URL}/order`, data);
};

export const listPair = async (page = 1, limit = 20) => {
  return axios.get(
    `${process.env.VUE_APP_BACKEND_URL}/pair?page=${page}&limit=${limit}`
  );
};

export const listOrder = async (
  sortPrice,
  baseTokenAddress,
  quoteTokenAddress,
  type,
  page,
  limit,
  maker = null,
  sortCreated = null,
  status = null
) => {
  let url = `${
    process.env.VUE_APP_BACKEND_URL
  }/order?page=${page}&limit=${limit}&baseTokenAddress=${baseTokenAddress.toLowerCase()}&quoteTokenAddress=${quoteTokenAddress.toLowerCase()}`;
  if (sortPrice !== null) url += `&sortPrice=${sortPrice}`;
  if (type !== null) url += `&type=${type}`;
  if (maker !== null) url += `&maker=${maker.toLowerCase()}`;
  if (sortCreated) url += `&sortCreated=${sortCreated}`;
  if (status) url += `&orderStatus=${status}`;
  return axios.get(url);
};

export const listTrades = async (
  pairId,
  fromTimestamp,
  toTimestamp,
  ohlcvTypeInterval
) => {
  let url = `${process.env.VUE_APP_BACKEND_URL}/trade?pairId=${pairId}&fromTimestamp=${fromTimestamp}&toTimestamp=${toTimestamp}&ohlcvTypeInterval=${ohlcvTypeInterval}`;
  return axios.get(url);
};

export const getOHLCV = async (
  pairId,
  fromTimestamp,
  toTimestamp,
  ohlcvTypeInterval
) => {
  let url = `${process.env.VUE_APP_BACKEND_URL}/trade/ohlcv?pairId=${pairId}&fromTimestamp=${fromTimestamp}&toTimestamp=${toTimestamp}&ohlcvTypeInterval=${ohlcvTypeInterval}`;
  return axios.get(url);
};

export const listMyTrades = async (page, limit, wallet, pairId) => {
  let url = `${
    process.env.VUE_APP_BACKEND_URL
  }/trade/my-trades?page=${page}&limit=${limit}&wallet=${wallet.toLowerCase()}&pairId=${pairId}`;
  return axios.get(url);
};

export const listCurrentOriginTrades = async (pairId, limit) => {
  let url = `${process.env.VUE_APP_BACKEND_URL}/trade/origin?pairId=${pairId}&limit=${limit}`;
  return axios.get(url);
};

export const listOrderBook = async (pairId, type, limit) => {
  let url = `${process.env.VUE_APP_BACKEND_URL}/order/order-book?pairId=${pairId}&limit=${limit}&type=${type}`;
  return axios.get(url);
};

export const estimateAllowance = async (maker, makerToken) => {
  let url = `${process.env.VUE_APP_BACKEND_URL}/order/estimate-allowance?maker=${maker}&makerToken=${makerToken}`;
  return axios.get(url);
};

export const getMatchOffers = async (
  makerToken,
  takerToken,
  price,
  amount,
  orderType,
  isMarket = false
) => {
  let url = `${
    process.env.VUE_APP_BACKEND_URL
  }/order/match-orders?makerToken=${makerToken.toLowerCase()}&takerToken=${takerToken.toLowerCase()}&price=${price}&amount=${amount}&orderType=${orderType}`;
  if (isMarket) url += `&isMarketOrder=${isMarket}`;
  return axios.get(url);
};

export const getTicker24H = async (pairId) => {
  let url = `${process.env.VUE_APP_BACKEND_URL}/ticker?pairId=${pairId}`;
  return axios.get(url);
};
