/**
 * Extract the first balanced JSON object from a string using brace counting.
 * Correctly handles nested braces and braces inside JSON string literals.
 */
function extractFirstJsonObject(text: string): string | null {
  const start = text.indexOf('{');
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (ch === '\\' && inString) {
      escape = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }

  return null;
}

/**
 * Defensive JSON parser for AI API responses.
 * Handles cases where the response might be wrapped in markdown code fences.
 */
export function parseAIResponse(rawText: string): unknown {
  // First attempt: direct JSON parse
  try {
    return JSON.parse(rawText);
  } catch {
    // Second attempt: strip markdown code fences
    const stripped = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    try {
      return JSON.parse(stripped);
    } catch {
      // Third attempt: extract the first balanced JSON object via brace counting
      const jsonStr = extractFirstJsonObject(stripped);
      if (jsonStr) {
        return JSON.parse(jsonStr);
      }
      throw new Error('Failed to parse AI response as JSON');
    }
  }
}
