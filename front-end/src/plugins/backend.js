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
  maker = null
) => {
  let url = `${process.env.VUE_APP_BACKEND_URL}/order?page=${page}&limit=${limit}&sortPrice=${sortPrice}&baseTokenAddress=${baseTokenAddress}&quoteTokenAddress=${quoteTokenAddress}&type=${type}`;
  if (maker !== null) url += `&maker=${maker}`;
  return axios.get(url);
};
