// client/src/utils/imageUrl.js
import { API_BASE_URL } from "../api/axios";

// Backend origin, e.g. https://connect2cure-backend.onrender.com
const BACKEND_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

/**
 * Turn /uploads/xyz.jpg or xyz.jpg or full URL into a usable image URL.
 * In prod this becomes:
 *   https://connect2cure-backend.onrender.com/uploads/xyz.jpg
 */
export const getDoctorImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // If already absolute (http/https), just return it
  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  const path = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${BACKEND_ORIGIN}${path}`;
};
