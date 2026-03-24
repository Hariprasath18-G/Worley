import { NextResponse } from 'next/server';
import { ASSET_PROFILE_INTERPRETER_PROMPT, PATHWAY_NARRATIVE_GENERATOR_PROMPT } from '@/lib/prompts';
import { parseAIResponse } from '@/lib/responseParser';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

// --- Rate limiting (in-memory, resets on cold start) ---
const MAX_BODY_SIZE = 200_000;
const MAX_DOCUMENT_TEXT_LENGTH = 60_000;
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);
  if (!entry || now > entry.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

// --- OpenAI model allowlist ---
const ALLOWED_MODELS = [
  'gpt-4o',
  'gpt-4o-mini',
  'gpt-4-turbo',
  'gpt-4',
  'gpt-3.5-turbo',
  'o4-mini',
];

// --- API key ---
function getApiKey(): string | null {
  const key = process.env.OPENAI_API_KEY;
  if (key && key.trim() !== '') {
    return key.trim();
  }
  return null;
}

// --- Input sanitization for LLM prompts ---
function sanitizeForPrompt(text: string): string {
  return text
    .replace(/ignore\s+(all\s+)?(previous|above|prior)\s+instructions/gi, '[REDACTED]')
    .replace(/system\s*prompt/gi, '[REDACTED]')
    .replace(/\bdo\s+not\s+follow\b/gi, '[REDACTED]');
}

// --- Response validation ---
function validateAnalysisResult(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  if (Array.isArray(d.pathways)) {
    if (d.pathways.length === 0) return false;
    if (typeof d.recommendation !== 'string') return false;
    if (!Array.isArray(d.precedentStudies)) return false;
    for (const p of d.pathways) {
      if (typeof p !== 'object' || p === null) return false;
      const pw = p as Record<string, unknown>;
      if (typeof pw.pathwayName !== 'string') return false;
      if (typeof pw.detailedNarrative !== 'string') return false;
    }
  }
  return true;
}

export async function POST(request: Request) {
  try {
    // --- Rate limiting ---
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.', code: 'RATE_LIMITED' as const },
        { status: 429 }
      );
    }

    // --- Request body size limit ---
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      return NextResponse.json(
        { success: false, error: 'Request too large.', code: 'INVALID_REQUEST' as const },
        { status: 413 }
      );
    }

    // --- Origin validation ---
    const origin = request.headers.get('origin');
    if (origin) {
      const allowedOrigins = [
        'http://localhost',
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
        process.env.NEXT_PUBLIC_SITE_URL || '',
      ].filter(Boolean);
      if (!allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized origin.', code: 'INVALID_REQUEST' as const },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { analysisType, assetProfile } = body;

    // Validate request
    if (!analysisType || !assetProfile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request: analysisType and assetProfile are required',
          code: 'INVALID_REQUEST',
        },
        { status: 400 }
      );
    }

    if (analysisType !== 'extractProfile' && analysisType !== 'generateScenarios') {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request: analysisType must be 'extractProfile' or 'generateScenarios'",
          code: 'INVALID_REQUEST',
        },
        { status: 400 }
      );
    }

    // --- Document text size limit ---
    if (analysisType === 'extractProfile') {
      if (typeof assetProfile?.documentText !== 'string' || assetProfile.documentText.length > MAX_DOCUMENT_TEXT_LENGTH) {
        return NextResponse.json(
          {
            success: false,
            error: `Document text exceeds maximum allowed length (${MAX_DOCUMENT_TEXT_LENGTH.toLocaleString()} characters).`,
            code: 'INVALID_REQUEST',
          },
          { status: 400 }
        );
      }
    }

    // --- Field length limits for generateScenarios ---
    if (analysisType === 'generateScenarios') {
      if (typeof assetProfile.knownConstraints === 'string' && assetProfile.knownConstraints.length > 5000) {
        return NextResponse.json(
          { success: false, error: 'knownConstraints field is too long.', code: 'INVALID_REQUEST' },
          { status: 400 }
        );
      }
      if (typeof assetProfile.assetName === 'string' && assetProfile.assetName.length > 200) {
        return NextResponse.json(
          { success: false, error: 'assetName field is too long.', code: 'INVALID_REQUEST' },
          { status: 400 }
        );
      }
    }

    // Check API key
    const apiKey = getApiKey();
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Server configuration error. Please contact the administrator.',
          code: 'MISSING_API_KEY',
        },
        { status: 500 }
      );
    }

    // Select prompt and build messages
    let systemPrompt: string;
    let userPrompt: string;

    if (analysisType === 'extractProfile') {
      systemPrompt = ASSET_PROFILE_INTERPRETER_PROMPT;
      const sanitizedText = sanitizeForPrompt(assetProfile.documentText);
      userPrompt = `Extract asset data from this text:\n\n[BEGIN USER DATA]\n${sanitizedText}\n[END USER DATA]`;
    } else {
      systemPrompt = PATHWAY_NARRATIVE_GENERATOR_PROMPT;
      const sanitizedProfile = JSON.parse(JSON.stringify(assetProfile));
      if (typeof sanitizedProfile.knownConstraints === 'string') {
        sanitizedProfile.knownConstraints = sanitizeForPrompt(sanitizedProfile.knownConstraints);
      }
      if (typeof sanitizedProfile.assetName === 'string') {
        sanitizedProfile.assetName = sanitizeForPrompt(sanitizedProfile.assetName);
      }
      userPrompt = `Here is the asset profile:\n[BEGIN USER DATA]\n${JSON.stringify(sanitizedProfile, null, 2)}\n[END USER DATA]`;
    }

    // Call OpenAI API
    const requestedModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const model = ALLOWED_MODELS.includes(requestedModel) ? requestedModel : 'gpt-4o-mini';
    const openaiUrl = 'https://api.openai.com/v1/chat/completions';

    const requestBody = JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 10000,
      response_format: { type: 'json_object' },
    });

    // Call OpenAI API
    const response = await fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: requestBody,
    });

    if (!response.ok) {
      const status = response.status;
      console.error(`OpenAI API error: ${status}`);

      if (status === 429) {
        return NextResponse.json(
          {
            success: false,
            error: 'API rate limit reached. Please wait a moment and try again.',
            code: 'RATE_LIMITED',
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: 'AI service temporarily unavailable. Please try again.',
          code: 'API_ERROR',
        },
        { status: 502 }
      );
    }

    const openaiData = await response.json();

    // Extract text from OpenAI response
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawText = (openaiData as any)?.choices?.[0]?.message?.content;

    if (!rawText) {
      console.error('OpenAI response missing text content');
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to parse AI response. Please try again.',
          code: 'PARSE_ERROR',
        },
        { status: 500 }
      );
    }

    // Parse JSON from OpenAI response
    try {
      const parsedData = parseAIResponse(rawText);

      // Validate response structure for generateScenarios
      if (analysisType === 'generateScenarios' && !validateAnalysisResult(parsedData)) {
        console.error('OpenAI response failed schema validation');
        return NextResponse.json(
          {
            success: false,
            error: 'AI response did not match expected format. Please try again.',
            code: 'PARSE_ERROR',
          },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true, data: parsedData });
    } catch {
      console.error('Failed to parse OpenAI JSON response (length:', rawText.length, ')');
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to parse AI response. Please try again.',
          code: 'PARSE_ERROR',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API route error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
        code: 'API_ERROR',
      },
      { status: 500 }
    );
  }
}
