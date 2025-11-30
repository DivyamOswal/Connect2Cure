// src/components/ReportForm.jsx
import React, { useState } from "react";

export default function ReportForm(props) {
  const {
    // text-mode props
    reportText,
    setReportText,
    handleSubmit,
    // file-mode props
    handleFileSubmit,
    // common
    loading,
  } = props;

  const [file, setFile] = useState(null);

  // FILE MODE (used in PatientDashboard)
  if (handleFileSubmit) {
    return (
      <form
        onSubmit={(e) => handleFileSubmit(e, file)}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            Upload medical report
          </label>
          <input
            type="file"
            accept=".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png"
            className="border p-2 rounded-md w-full bg-white shadow"
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Supported: PDF, DOCX, TXT, JPG, PNG
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="px-4 py-2 bg-[#FF8040] text-white rounded-md shadow disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Upload & Analyze (1 credit)"}
        </button>
      </form>
    );
  }

  // TEXT MODE (used in NewSummaryPage)
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Paste medical report text
        </label>
        <textarea
          className="w-full border rounded-md p-3 min-h-[180px] bg-white shadow"
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          placeholder="Paste the medical report here..."
        />
      </div>

      <button
        type="submit"
        disabled={loading || !reportText?.trim()}
        className="px-4 py-2 rounded-md bg-[#FF8040] text-white disabled:opacity-60 shadow"
      >
        {loading ? "Analyzing..." : "Generate Summary (1 credit)"}
      </button>
    </form>
  );
}
