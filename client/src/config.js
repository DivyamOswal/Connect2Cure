// client/src/config.js
const isProd = import.meta.env.PROD;

// Same base URL you use for API calls
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (isProd
    ? "https://connect2cure-backend.onrender.com/api"
    : "http://localhost:5000/api");

// For images and other static assets served from Express (/uploads)
export const ASSET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");
