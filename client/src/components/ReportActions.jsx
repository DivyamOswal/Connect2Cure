// src/components/ReportActions.jsx
import React, { useState } from "react";
import QRCode from "react-qr-code";
import {
  downloadReportPdf,
  createReportShareLink,
} from "../api/reportApi";

export default function ReportActions({ report }) {
  const [shareUrl, setShareUrl] = useState("");
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingShare, setLoadingShare] = useState(false);
  const [error, setError] = useState("");

  const handleDownloadPdf = async () => {
  try {
    setError("");
    setLoadingPdf(true);
    const res = await downloadReportPdf(report._id);

    const blob = new Blob([res.data], {
      type: "application/pdf",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report-${report._id}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("downloadReportPdf error:", err);
    setError("Failed to download PDF.");
  } finally {
    setLoadingPdf(false);
  }
};

const handleCreateShareLink = async () => {
  try {
    setError("");
    setLoadingShare(true);

    const { token } = await createReportShareLink(report._id);
    const url = `${window.location.origin}/share/${token}`;
    setShareUrl(url);

  } catch (err) {
    console.error("createShareLink error:", err);
    setError("Failed to create share link.");
  } finally {
    setLoadingShare(false);
  }
};


  return (
    <div className="p-4 border rounded-xl bg-white shadow space-y-4">
      <h3 className="font-semibold text-lg">
        Report Actions
      </h3>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <div className="flex flex-wrap gap-3 items-center">
        <button
          onClick={handleDownloadPdf}
          disabled={loadingPdf}
          className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm disabled:opacity-60"
        >
          {loadingPdf ? "Downloading..." : "Download PDF"}
        </button>

        <button
          onClick={handleCreateShareLink}
          disabled={loadingShare}
          className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm disabled:opacity-60"
        >
          {loadingShare ? "Generating..." : "Create Share Link"}
        </button>

        {shareUrl && (
          <a
            href={shareUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-600 underline"
          >
            Open shared link
          </a>
        )}
      </div>

      {shareUrl && (
        <div className="mt-4">
          <p className="text-sm mb-2">
            Scan this QR code to open the shared report:
          </p>
          <div className="bg-white p-3 inline-block border rounded-lg">
            <QRCode value={shareUrl} size={128} />
          </div>
        </div>
      )}
    </div>
  );
}
