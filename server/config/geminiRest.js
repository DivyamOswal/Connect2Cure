// server/config/geminiRest.js
import fetch from "node-fetch";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Default to the model we saw in your /v1/models response
const GEMINI_MODEL =
  process.env.GEMINI_MODEL || "models/gemini-2.5-flash";

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
 * Call Gemini via REST and return parsed JSON.
 * Uses v1 models endpoint and your configured model.
 */
export const callGeminiJson = async (prompt) => {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment");
  }

  const url = `https://generativelanguage.googleapis.com/v1/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  console.log("Calling Gemini URL:", url);

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    // ❌ NO generationConfig here – your API version rejects responseMimeType
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await resp.text();

  if (!resp.ok) {
    console.error("Gemini HTTP error:", resp.status, text);
    throw new Error(`Gemini API error: ${resp.status}`);
  }

  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    console.error("Gemini non-JSON HTTP body:", text);
    throw new Error("Gemini HTTP body is not JSON");
  }

  // Extract the model's text output
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
