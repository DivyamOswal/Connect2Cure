// src/api/userApi.js
import api from "./axios";

export async function getMe() {
  const res = await api.get("/auth/me");
  return res.data; // should contain { credits, ... }
}
