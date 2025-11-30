// src/api/reportApi.js
import api from "./axios";

export const analyzeReport = async (text) => {
  const res = await api.post("/reports/analyze", { text });
  return res.data;
};

export const analyzeReportFile = async (file) => {
  const form = new FormData();
  form.append("file", file);

  const res = await api.post("/reports/analyze-file", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const downloadReportPdf = (id) =>
  api.get(`/reports/${id}/pdf`, {
    responseType: "blob",
  });


// ✅ IMPORTANT: return res.data
export const createReportShareLink = async (id) => {
  const res = await api.post(`/reports/${id}/share`);
  return res.data; // { message, token }
};

export const getSharedReport = async (shareId) => {
  const res = await api.get(`/reports/shared/${shareId}`);
  return res.data;
};
