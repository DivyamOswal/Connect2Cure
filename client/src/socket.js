// client/src/socket.js
import { io } from "socket.io-client";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// If you have a separate socket URL, set VITE_SOCKET_URL.
// Otherwise derive it from API_BASE_URL by stripping "/api".
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || API_BASE_URL.replace(/\/api\/?$/, "");

const socket = io(SOCKET_URL, {
  withCredentials: true,
});

// Optional: auto-authenticate on connect using the stored token
socket.on("connect", () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    socket.emit("authenticate", token);
  }
});

export default socket;
