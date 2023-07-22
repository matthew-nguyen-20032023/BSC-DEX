const io = require("socket.io-client");
export const socket = io.io(process.env.VUE_APP_SOCKET_SERVER_URL, {
  transports: ["websocket"],
  withCredentials: true,
  extraHeaders: {
    "Access-Control-Allow-Origin": process.env.VUE_APP_FE_URL, // Replace with your backend origin
  },
});
