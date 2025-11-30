// client/src/socket.js
import { io } from "socket.io-client";

// Detect prod vs dev
const isProd = import.meta.env.PROD;

// In dev, default to localhost
// In prod, default directly to your Render backend if env is not set
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (isProd
    ? "https://connect2cure-backend.onrender.com/api"
    : "http://localhost:5000/api");

// If you have a separate socket URL, set VITE_SOCKET_URL.
// Otherwise derive it from API_BASE_URL by stripping trailing "/api".
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || API_BASE_URL.replace(/\/api\/?$/, "");

console.log("[socket] Connecting to:", SOCKET_URL);

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"], // try websocket first, then polling
});

// Optional: auto-authenticate on connect using the stored token
socket.on("connect", () => {
  console.log("[socket] Connected:", socket.id);
  const token = localStorage.getItem("accessToken");
  if (token) {
    socket.emit("authenticate", token);
  }
});

socket.on("connect_error", (err) => {
  console.error("[socket] Connect error:", err.message);
});

export default socket;
