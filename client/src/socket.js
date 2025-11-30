// client/src/socket.js
import { io } from "socket.io-client";

// create and export a single connected socket instance
const socket = io(import.meta.env.VITE_BASE_URL, {
  withCredentials: true,
});

export default socket;
