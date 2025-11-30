// src/components/ReportSummary.jsx
import React from "react";
import CreateBadge from "./CreditBadge";

export default function ReportSummary({ summary, medicalTerms }) {
  if (!summary) return null;

  return (
    <div className="p-4 border rounded-xl bg-white shadow space-y-4 mt-6">
      <h2 className="text-xl font-semibold">Summary</h2>

      <p className="whitespace-pre-line text-gray-800">{summary}</p>

      {medicalTerms?.length > 0 && (
        <>
          <h3 className="font-semibold mt-4">Key Medical Terms</h3>
          <div className="flex flex-wrap gap-2">
            {medicalTerms.map((term, idx) => (
              <CreateBadge key={`${term}-${idx}`} label={term} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
