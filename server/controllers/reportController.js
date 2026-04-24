// server/controllers/reportController.js
import PDFDocument from "pdfkit";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";
import { callGeminiJson } from "../config/geminiRest.js";
import Report from "../models/Report.js";
import { User } from "../models/User.js";

/** FIX for pdf-parse in ES modules (Node 18–22) */
const loadPdfParse = async () => {
  const mod = await import("pdf-parse");
  return mod.default || mod;
};

/**
 * Shared Gemini prompt builder.
 * Used by both analyzeReport (text) and analyzeReportFile (file).
 */
const buildMedicalPrompt = (reportText) => `
You are a medical assistant.

Read the following lab report text and respond with ONLY a single JSON object.
DO NOT wrap it in markdown or backticks.

The JSON MUST have exactly this shape:

{
  "summary": "string",
  "medicalTerms": ["string", ...],
  "charts": {
    "termsFrequency": [number, ...],
    "categories": ["string", ...],
    "severityDots": [number, ...]
  }
}

Rules:
- "summary": 5-6 sentences in plain language describing the important abnormalities and overall impression.
- "medicalTerms": up to 10 key lab terms or diagnoses from the report, as short strings (e.g. "Hemoglobin", "Hematocrit", "WBC count").
- "termsFrequency": an array of the SAME LENGTH as "medicalTerms".
  Each element is an integer from 1 to 5 representing how prominent/important that term is in the report (5 = very important).
- "categories": 2–5 short strings grouping the terms logically (e.g. "Red cell indices", "White cell count", "Platelets").
- "severityDots": an array of the SAME LENGTH as "medicalTerms".
  Each element is an integer from 1 to 10 representing clinical severity (10 = very severe).
- Always use numbers for "termsFrequency" and "severityDots", never objects.
- Always use plain strings for "categories", never objects.
- Do NOT include any fields other than "summary", "medicalTerms", and "charts".

Report text:
"""${reportText}"""
`;

/**
 * Normalize charts object to match our schema:
 * {
 *   termsFrequency: [Number],
 *   categories: [String],
 *   severityDots: [Number]
 * }
 * and align the numeric arrays with medicalTerms length when possible.
 */
const normalizeCharts = (charts, medicalTermsLength = 0) => {
  const safe = charts && typeof charts === "object" ? charts : {};

  const toArray = (v) => {
    if (Array.isArray(v)) return v;
    if (v === null || v === undefined) return [];
    return [v];
  };

  // ---- termsFrequency: numeric array ----
  let termsFrequency = toArray(safe.termsFrequency).map((n) =>
    Number.isFinite(Number(n)) ? Number(n) : 0
  );

  if (medicalTermsLength > 0) {
    termsFrequency = termsFrequency.slice(0, medicalTermsLength);
    while (termsFrequency.length < medicalTermsLength) {
      termsFrequency.push(0);
    }
  }

  // ---- categories: plain strings (handle possible objects) ----
  const categories = toArray(safe.categories).map((c) => {
    if (typeof c === "string") return c;
    if (c && typeof c === "object") {
      return c.label || c.name || c.category || JSON.stringify(c);
    }
    return String(c);
  });

  // ---- severityDots: numeric array ----
  let severityDots = toArray(safe.severityDots).map((n) =>
    Number.isFinite(Number(n)) ? Number(n) : 0
  );

  if (medicalTermsLength > 0) {
    severityDots = severityDots.slice(0, medicalTermsLength);
    while (severityDots.length < medicalTermsLength) {
      severityDots.push(0);
    }
  }

  return { termsFrequency, categories, severityDots };
};

// Shared core: deduct credit → call AI → save report
const runAnalysis = async ({ userId, rawText, res }) => {
  // STEP 1: Deduct credit atomically
  const updatedUser = await User.findOneAndUpdate(
    { _id: userId, credits: { $gte: 1 } },
    { $inc: { credits: -1 } },
    { new: true }
  );

  if (!updatedUser) {
    return res.status(402).json({ message: "Not enough credits" });
  }

  // STEP 2: Call Gemini
  let json;
  try {
    json = await callGeminiJson(buildMedicalPrompt(rawText));
  } catch (err) {
    // Refund credit if AI fails
    await User.findByIdAndUpdate(userId, { $inc: { credits: 1 } });
    console.error("❌ Gemini error:", err.message);
    return res.status(502).json({ message: "Analyzer failed. Please try again." });
  }

  const medicalTerms = Array.isArray(json.medicalTerms) ? json.medicalTerms : [];
  const charts = normalizeCharts(json.charts, medicalTerms.length);

  // STEP 3: Save report
  const report = await Report.create({
    user: userId,
    rawText,
    summary: json.summary || "",
    medicalTerms,
    charts,
  });

  // STEP 4: Return
  return res.json({
    report,
    remainingCredits: updatedUser.credits,
  });
};


// POST /api/reports/analyze  (plain text body)
export const analyzeReport = async (req, res) => {
  try {
    const authUser = req.userDoc || req.user;
    if (!authUser) return res.status(401).json({ message: "Not authenticated" });

    const userId = authUser._id || authUser.userId;
    if (!userId) return res.status(401).json({ message: "Invalid user context" });

    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Report text is required" });
    }

    return await runAnalysis({ userId, rawText: text.trim(), res });
  } catch (err) {
    console.error("❌ analyzeReport error:", err);
    return res.status(500).json({ message: "Error analyzing text" });
  }
};

// POST /api/reports/analyze-file  (multipart file)
export const analyzeReportFile = async (req, res) => {
  try {
    const authUser = req.userDoc || req.user;
    if (!authUser) return res.status(401).json({ message: "Not authenticated" });

    const userId = authUser._id || authUser.userId;
    if (!userId) return res.status(401).json({ message: "Invalid user context" });

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { buffer, mimetype } = req.file;
    let extractedText = "";

    // ---- Extract text based on file type ----
    if (mimetype === "application/pdf") {
      const pdfParse = await loadPdfParse();
      const data = await pdfParse(buffer);
      extractedText = data.text;
    } else if (
      mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else if (mimetype === "text/plain") {
      extractedText = buffer.toString("utf8");
    } else if (mimetype.startsWith("image/")) {
      const result = await Tesseract.recognize(buffer, "eng");
      extractedText = result.data.text;
    } else {
      return res.status(415).json({
        message: "Unsupported file type. Upload PDF, DOCX, TXT, or an image.",
      });
    }

    if (!extractedText.trim()) {
      return res.status(400).json({ message: "Could not extract text from file" });
    }

    return await runAnalysis({ userId, rawText: extractedText.trim(), res });
  } catch (err) {
    console.error("❌ analyzeReportFile error:", err);
    return res.status(500).json({ message: "Error analyzing file" });
  }
};

// POST /api/reports/:id/share
export const createShareLink = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Report ID missing" });

    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    // Using _id as share token (simple & stateless)
    const shareToken = report._id.toString();

    return res.json({
      message: "Share link created",
      token: shareToken,
      // Frontend builds the full URL:  /shared/${shareToken}
    });
  } catch (err) {
    console.error("❌ createShareLink error:", err);
    return res.status(500).json({ message: "Error creating share link" });
  }
};

// GET /api/reports/:id/download
export const downloadReportPdf = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "Report id is required" });

    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    const doc = new PDFDocument({ margin: 50 });
    const filename = `report-${report._id}.pdf`;

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // ── Header ──
    doc.fontSize(20).text("Medical Report Summary", { underline: true });
    doc.moveDown();

    doc.fontSize(12).text(`Report ID: ${report._id}`);
    if (report.createdAt) {
      doc.text(`Created at: ${new Date(report.createdAt).toLocaleString()}`);
    }
    doc.moveDown();

    // ── Summary ──
    if (report.summary) {
      doc.fontSize(14).text("Summary", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12).text(report.summary, { align: "left" });
      doc.moveDown();
    }

    // ── Medical Terms ──
    if (Array.isArray(report.medicalTerms) && report.medicalTerms.length) {
      doc.fontSize(14).text("Key Medical Terms", { underline: true });
      doc.moveDown(0.5);
      report.medicalTerms.forEach((term, idx) => {
        doc.fontSize(12).text(`${idx + 1}. ${term}`);
      });
      doc.moveDown();
    }

    // ── Severity Scores ──
    if (report.charts && Array.isArray(report.charts.severityDots)) {
      doc.fontSize(14).text("Severity Scores (1–10)", { underline: true });
      doc.moveDown(0.5);
      (report.medicalTerms || []).forEach((term, idx) => {
        const score = Number(report.charts.severityDots[idx] ?? 0);
        doc.fontSize(12).text(`- ${term}: ${score}/10`);
      });
      doc.moveDown();
    }

    // ── Footer ──
    doc.moveDown();
    doc.fontSize(10).fillColor("gray").text("Generated by Connect2Cure", {
      align: "center",
    });

    doc.end();
  } catch (err) {
    console.error("❌ downloadReportPdf error:", err);
    if (!res.headersSent) {
      return res.status(500).json({ message: "Error downloading report" });
    }
  }
};

// GET /api/reports/shared/:shareId  (public, no auth)
export const getSharedReport = async (req, res) => {
  try {
    const { shareId } = req.params;

    if (!shareId) {
      return res.status(400).json({ message: "Share token is required" });
    }

    const report = await Report.findById(shareId);
    if (!report) {
      return res.status(404).json({ message: "Shared report not found" });
    }

    return res.json({
      id: report._id,
      summary: report.summary,
      medicalTerms: report.medicalTerms,
      charts: report.charts,
      createdAt: report.createdAt,
    });
  } catch (err) {
    console.error("❌ getSharedReport error:", err);
    return res.status(500).json({ message: "Error fetching shared report" });
  }
};