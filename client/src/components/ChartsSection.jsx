// src/components/ChartsSection.jsx
import React from "react";
import { Pie, Bar, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

// ⭐ NEW: helpers to convert numeric severity → Low / Medium / High
const getSeverityLabel = (score) => {
  // You can tweak thresholds as needed
  if (score >= 8) return "High";
  if (score >= 4) return "Medium";
  return "Low";
};

const getSeverityColor = (label) => {
  switch (label) {
    case "High":
      return "#dc2626"; // red
    case "Medium":
      return "#f59e0b"; // amber
    case "Low":
    default:
      return "#16a34a"; // green
  }
};

export default function ChartsSection({ charts, medicalTerms = [] }) {
  if (!charts) return null;

  const toNumber = (v) => {
    if (v === null || v === undefined) return 0;
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  // ---------- TERM FREQUENCY (PIE) ----------
  const normalizeTerms = () => {
    const arr = Array.isArray(charts.termsFrequency)
      ? charts.termsFrequency
      : [];

    return arr.map((item, idx) => {
      let value = 0;
      let label = medicalTerms[idx] || `Term ${idx + 1}`;

      if (typeof item === "number" || typeof item === "string") {
        value = toNumber(item);
      } else if (item && typeof item === "object") {
        value = toNumber(
          item.value ?? item.count ?? item.frequency ?? 0
        );
        label =
          item.label ??
          item.term ??
          medicalTerms[idx] ??
          `Term ${idx + 1}`;
      }

      return { label, value };
    });
  };

  const termsFrequency = normalizeTerms();
  const hasPie =
    termsFrequency.length > 0 &&
    termsFrequency.some((t) => t.value !== 0);

  const pieData = {
    labels: termsFrequency.map((t) => t.label),
    datasets: [
      {
        data: termsFrequency.map((t) => t.value),
        backgroundColor: [
          "#4F46E5",
          "#22C55E",
          "#F59E0B",
          "#EF4444",
          "#3B82F6",
          "#A855F7",
          "#10B981",
          "#6366F1",
          "#EC4899",
          "#14B8A6",
          "#F97316",
          "#06B6D4",
        ],
      },
    ],
  };

  // ---------- CATEGORIES (BAR) ----------
  const normalizeCategories = () => {
    const arr = Array.isArray(charts.categories)
      ? charts.categories
      : [];

    return arr.map((item, idx) => {
      let label = `Category ${idx + 1}`;
      let value = 0;

      if (typeof item === "string") {
        label = item;
      } else if (typeof item === "number") {
        value = toNumber(item);
      } else if (item && typeof item === "object") {
        label =
          item.label ||
          item.name ||
          item.category ||
          `Category ${idx + 1}`;
        value = toNumber(item.value ?? item.count ?? 0);
      }

      return { label, value };
    });
  };

  const categories = normalizeCategories();
  const hasBar =
    categories.length > 0 &&
    categories.some((c) => c.value !== 0);

  const barData = {
    labels: categories.map((c) => c.label),
    datasets: [
      {
        label: "Count",
        data: categories.map((c) => c.value),
        backgroundColor: "#3B82F6",
      },
    ],
  };

  // ---------- SEVERITY (SCATTER) ----------
  const normalizeSeverity = () => {
    const arr = Array.isArray(charts.severityDots)
      ? charts.severityDots
      : [];

    return arr.map((item, idx) => {
      let label = medicalTerms[idx] || `Item ${idx + 1}`;
      let value = 0;

      if (typeof item === "number" || typeof item === "string") {
        value = toNumber(item);
      } else if (item && typeof item === "object") {
        value = toNumber(item.value ?? item.severity ?? 0);
        label =
          item.label ??
          item.term ??
          medicalTerms[idx] ??
          `Item ${idx + 1}`;
      }

      return { label, value };
    });
  };

  const severityDots = normalizeSeverity();
  const hasDots =
    severityDots.length > 0 &&
    severityDots.some((s) => s.value !== 0);

  const dotData = {
    datasets: [
      {
        label: "Severity",
        data: severityDots.map((item, idx) => ({
          x: idx,
          y: item.value,
          label: item.label,
        })),
        backgroundColor: "#EF4444",
      },
    ],
  };

  const dotOptions = {
    scales: {
      x: {
        ticks: {
          callback: (index) =>
            severityDots[index]?.label || "",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Severity (1–10)",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const point =
              severityDots[context.dataIndex];
            if (!point) return "";
            const label = getSeverityLabel(point.value); // ⭐ NEW: include Low/Medium/High
            return `${point.label}: ${point.value} (${label})`;
          },
        },
      },
    },
  };

  // ⭐ NEW: build term → Low/Medium/High list (using severityDots + medicalTerms)
  const termSeverityRatings = medicalTerms.map((term, idx) => {
    const severityPoint = severityDots[idx];
    const score = severityPoint ? severityPoint.value : 0;
    const label = getSeverityLabel(score);
    return {
      term,
      score,
      label,
    };
  }).filter((t) => t.term); // filter out any empty terms

  const hasTermRatings =
    termSeverityRatings.length > 0 &&
    termSeverityRatings.some((t) => t.score !== 0);

  // If absolutely no non-zero data anywhere, hide section
  if (!hasPie && !hasBar && !hasDots) return null;

  return (
    <div className="space-y-6 mt-6">
      {/* ⭐ NEW: Term severity list BEFORE the pie chart */}
      {hasTermRatings && (
        <div className="p-4 border rounded-xl bg-white shadow">
          <h3 className="font-semibold mb-2">
            Term Severity (Low / Medium / High)
          </h3>
          <ul className="space-y-1 text-sm">
            {termSeverityRatings.map((t) => (
              <li
                key={t.term}
                className="flex items-center justify-between"
              >
                <span className="font-medium text-slate-800">
                  {t.term}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: `${getSeverityColor(
                      t.label
                    )}22`,
                    color: getSeverityColor(t.label),
                  }}
                >
                  {t.label}{" "}
                  {t.score
                    ? `(score: ${t.score}/10)`
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasPie && (
        <div className="p-4 border rounded-xl bg-white shadow">
          <h3 className="font-semibold mb-2">
            Term Frequency (Pie Chart)
          </h3>
          <Pie data={pieData} />
        </div>
      )}

      {hasBar && (
        <div className="p-4 border rounded-xl bg-white shadow">
          <h3 className="font-semibold mb-2">
            Categories (Bar Chart)
          </h3>
          <Bar data={barData} />
        </div>
      )}

      {hasDots && (
        <div className="p-4 border rounded-xl bg-white shadow">
          <h3 className="font-semibold mb-2">
            Severity Dot Plot
          </h3>
          <Scatter data={dotData} options={dotOptions} />
        </div>
      )}
    </div>
  );
}
