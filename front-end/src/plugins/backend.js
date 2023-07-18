import axios from "axios";

export const createOrder = async (data) => {
  return axios.post(`${process.env.VUE_APP_BACKEND_URL}/order`, data);
};
