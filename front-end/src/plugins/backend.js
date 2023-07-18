import axios from "axios";

export const createOrder = async (data) => {
  axios
    .post(`${process.env.VUE_APP_BACKEND_URL}/order`, data)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error;
    });
};
