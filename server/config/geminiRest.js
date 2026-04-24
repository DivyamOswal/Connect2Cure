// server/config/geminiRest.js
import fetch from "node-fetch";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Use v1beta — required for gemini-2.5-flash and all preview models.
 * Falls back to gemini-1.5-flash (stable) if env var not set.
 */
const GEMINI_MODEL =
  process.env.GEMINI_MODEL || "models/gemini-1.5-flash";

/**
 * Strip ```json fences and extra junk around JSON if the model
 * wraps the response in Markdown.
 */
const extractJsonString = (raw) => {
  if (!raw || typeof raw !== "string") return "{}";

  let str = raw.trim();

  // Remove ```json ... ``` or ``` ... ```
  const fencedMatch = str.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch) {
    str = fencedMatch[1].trim();
  }

  // Take from first { to last }
  const firstBrace = str.indexOf("{");
  const lastBrace = str.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    str = str.slice(firstBrace, lastBrace + 1).trim();
  }

  return str;
};

/**
 * Call Gemini via REST (v1beta) and return parsed JSON.
 *
 * Supported model strings (set via GEMINI_MODEL env var):
 *   models/gemini-1.5-flash          ← stable, recommended for production
 *   models/gemini-1.5-pro
 *   models/gemini-2.5-flash-preview-04-17   ← latest preview (v1beta only)
 */
export const callGeminiJson = async (prompt) => {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment");
  }

  // ✅ v1beta — works for both stable and preview models
  const url = `https://generativelanguage.googleapis.com/v1beta/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  console.log("📡 Calling Gemini URL:", url);

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.2,       // lower = more deterministic JSON output
      maxOutputTokens: 2048,
    },
  };

  let resp;
  try {
    resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (networkErr) {
    console.error("❌ Network error reaching Gemini:", networkErr.message);
    throw new Error("Network error: could not reach Gemini API");
  }

  const text = await resp.text();

  if (!resp.ok) {
    // Log the full Gemini error so you can debug on Render
    console.error(`❌ Gemini HTTP ${resp.status}:`, text.slice(0, 500));
    throw new Error(`Gemini API error: ${resp.status} — ${text.slice(0, 300)}`);
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.error("❌ Gemini non-JSON HTTP body:", text.slice(0, 300));
    throw new Error("Gemini HTTP body is not JSON");
  }

  // Extract the model's text output from candidates
  const raw =
    data?.candidates?.[0]?.content?.parts
      ?.map((p) => (typeof p.text === "string" ? p.text : ""))
      .join("") || "{}";

  const cleaned = extractJsonString(raw);

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ Gemini JSON parse error. Raw text:", raw);
    console.error("❌ After cleaning:", cleaned);
    throw new Error("Gemini returned invalid JSON");
  }
};