import axios from "axios";

export const createOrder = async (data) => {
  return axios.post(`${process.env.VUE_APP_BACKEND_URL}/order`, data);
};

export const listPair = async (page = 1, limit = 20) => {
  return axios.get(
    `${process.env.VUE_APP_BACKEND_URL}/pair?page=${page}&limit=${limit}`
  );
};
