import { io } from "socket.io-client";

const URL = "http://localhost:5000";

export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
});

export const connectSocket = (token) => {
  if (!token) return;

  if (!socket.connected) socket.connect();

  socket.emit("authenticate", token);
};
