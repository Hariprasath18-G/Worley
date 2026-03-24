/**
 * API Route Tests for /api/analyze
 *
 * These tests verify the POST handler logic without running a real Next.js server.
 * We import the handler directly and call it with mock Request objects.
 * The global fetch is mocked to intercept OpenAI API calls.
 */

// Mock next/server before importing the route handler
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      json: async () => body,
      status: init?.status || 200,
      body,
    }),
  },
}));

// Save original env
const originalEnv = process.env;

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Import after mocking
import { POST } from '@/app/api/analyze/route';

describe('/api/analyze POST handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      OPENAI_API_KEY: 'sk-test-api-key-12345',
      OPENAI_MODEL: 'gpt-4o-mini',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  // Counter to give each test a unique IP (avoids rate limiter collisions)
  let requestCounter = 0;

  // Helper to create a Request-like object with proper headers mock
  function createRequest(body: unknown): Request {
    requestCounter++;
    const headersMap: Record<string, string> = {
      'content-type': 'application/json',
      'x-forwarded-for': `10.0.0.${requestCounter}`,
      'origin': 'http://localhost:3000',
    };
    return {
      json: async () => body,
      headers: {
        get: (name: string) => headersMap[name.toLowerCase()] || null,
      },
    } as unknown as Request;
  }

  describe('request validation', () => {
    it('should return 400 when analysisType is missing', async () => {
      const request = createRequest({ assetProfile: {} });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.code).toBe('INVALID_REQUEST');
      expect(data.error).toContain('analysisType');
    });

    it('should return 400 when assetProfile is missing', async () => {
      const request = createRequest({ analysisType: 'generateScenarios' });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.code).toBe('INVALID_REQUEST');
    });

    it('should return 400 when both fields are missing', async () => {
      const request = createRequest({});
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.code).toBe('INVALID_REQUEST');
    });

    it('should return 400 for invalid analysisType value', async () => {
      const request = createRequest({
        analysisType: 'invalidType',
        assetProfile: {},
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.code).toBe('INVALID_REQUEST');
      expect(data.error).toContain("'extractProfile' or 'generateScenarios'");
    });
  });

  describe('API key validation', () => {
    it('should return 500 when no OPENAI_API_KEY is set', async () => {
      delete process.env.OPENAI_API_KEY;

      const request = createRequest({
        analysisType: 'generateScenarios',
        assetProfile: { assetName: 'Test' },
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.code).toBe('MISSING_API_KEY');
    });

    it('should return 500 when API key is empty', async () => {
      process.env.OPENAI_API_KEY = '';

      const request = createRequest({
        analysisType: 'generateScenarios',
        assetProfile: { assetName: 'Test' },
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.code).toBe('MISSING_API_KEY');
    });

    it('should use the configured API key in Authorization header', async () => {
      process.env.OPENAI_API_KEY = 'sk-my-test-key-abc';

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: '{"pathways":[{"pathwayName":"Test","detailedNarrative":"Test"}],"recommendation":"ok","precedentStudies":[]}',
            },
          }],
        }),
      });

      const request = createRequest({
        analysisType: 'generateScenarios',
        assetProfile: { assetName: 'Test' },
      });
      const response = await POST(request);

      expect(response.status).toBe(200);
      const fetchHeaders = mockFetch.mock.calls[0][1].headers;
      expect(fetchHeaders['Authorization']).toBe('Bearer sk-my-test-key-abc');
    });
  });

  describe('generateScenarios flow', () => {
    it('should call OpenAI API and return parsed result on success', async () => {
      const mockResult = {
        pathways: [{ pathwayName: 'Optimize + CCS', detailedNarrative: 'Test narrative' }],
        recommendation: 'Test recommendation',
        precedentStudies: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: JSON.stringify(mockResult),
            },
          }],
        }),
      });

      const request = createRequest({
        analysisType: 'generateScenarios',
        assetProfile: {
          assetName: 'Test Refinery',
          assetType: 'Refinery',
          location: 'UK North Sea',
        },
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.pathways[0].pathwayName).toBe('Optimize + CCS');
      expect(data.data.recommendation).toBe('Test recommendation');
    });

    it('should pass asset profile as JSON in the user prompt', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: '{"pathways":[{"pathwayName":"Test","detailedNarrative":"Test"}],"recommendation":"ok","precedentStudies":[]}',
            },
          }],
        }),
      });

      const assetProfile = { assetName: 'My Refinery', assetType: 'Refinery' };
      const request = createRequest({
        analysisType: 'generateScenarios',
        assetProfile,
      });
      await POST(request);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      const userMessage = callBody.messages[1].content;
      expect(userMessage).toContain('My Refinery');
      expect(userMessage).toContain('Refinery');
    });

    it('should use gpt-4o-mini as default model', async () => {
      delete process.env.OPENAI_MODEL;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: '{"pathways":[{"pathwayName":"Test","detailedNarrative":"Test"}],"recommendation":"ok","precedentStudies":[]}',
            },
          }],
        }),
      });

      const request = createRequest({
        analysisType: 'generateScenarios',
        assetProfile: { assetName: 'Test' },
      });
      await POST(request);

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.model).toBe('gpt-4o-mini');
    });
  });

  describe('extractProfile flow', () => {
    it('should call OpenAI API with extraction prompt and return parsed data', async () => {
      const extractedData = {
        assetName: 'Coastal Refinery',
        assetType: 'Refinery',
        yearCommissioned: 1985,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: JSON.stringify(extractedData),
            },
          }],
        }),
      });

      const request = createRequest({
        analysisType: 'extractProfile',
        assetProfile: { documentText: 'This is a refinery built in 1985...' },
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.assetName).toBe('Coastal Refinery');
      expect(data.data.yearCommissioned).toBe(1985);
    });

    it('should include document text in the user prompt', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: '{"assetName":null}',
            },
          }],
        }),
      });

      const request = createRequest({
        analysisType: 'extractProfile',
        assetProfile: { documentText: 'Special document content here' },
      });
      await POST(request);

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      const userMessage = callBody.messages[1].content;
      expect(userMessage).toContain('Special document content here');
    });
  });

  describe('OpenAI API error handling', () => {
    it('should return 502 when OpenAI API returns a client error (e.g. 403)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
      });

      const request = createRequest({
        analysisType: 'generateScenarios',
        assetProfile: { assetName: 'Test' },
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(502);
      expect(data.success).toBe(false);
      expect(data.code).toBe('API_ERROR');
      expect(data.error).toContain('temporarily unavailable');
    });

    it('should return 429 when OpenAI API returns rate limit error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
      });

      const request = createRequest({
        analysisType: 'generateScenarios',
        assetProfile: { assetName: 'Test' },
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.success).toBe(false);
      expect(data.code).toBe('RATE_LIMITED');
      expect(data.error).toContain('rate limit');
    });

    it('should return 500 when OpenAI response has no text content', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: null } }],
        }),
      });

      const request = createRequest({
        analysisType: 'generateScenarios',
        assetProfile: { assetName: 'Test' },
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.code).toBe('PARSE_ERROR');
    });

    it('should return 500 when OpenAI response text is not valid JSON', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: 'This is not JSON at all and has no JSON objects',
            },
          }],
        }),
      });

      const request = createRequest({
        analysisType: 'generateScenarios',
        assetProfile: { assetName: 'Test' },
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.code).toBe('PARSE_ERROR');
    });

    it('should return 500 when fetch throws a network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network failure'));

      const request = createRequest({
        analysisType: 'generateScenarios',
        assetProfile: { assetName: 'Test' },
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.code).toBe('API_ERROR');
    });
  });

  describe('request body parsing error', () => {
    it('should return 500 when request.json() throws', async () => {
      const badRequest = {
        json: async () => { throw new Error('Invalid JSON body'); },
        headers: {
          get: (name: string) => {
            const h: Record<string, string> = { 'x-forwarded-for': '127.0.0.1', 'origin': 'http://localhost:3000' };
            return h[name.toLowerCase()] || null;
          },
        },
      } as unknown as Request;

      const response = await POST(badRequest);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
    });
  });

  describe('OpenAI API call configuration', () => {
    it('should set temperature to 0.3', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: '{"pathways":[{"pathwayName":"Test","detailedNarrative":"Test"}],"recommendation":"ok","precedentStudies":[]}',
            },
          }],
        }),
      });

      const request = createRequest({
        analysisType: 'generateScenarios',
        assetProfile: { assetName: 'Test' },
      });
      await POST(request);

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.temperature).toBe(0.3);
    });

    it('should request JSON response format from OpenAI', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: '{"pathways":[{"pathwayName":"Test","detailedNarrative":"Test"}],"recommendation":"ok","precedentStudies":[]}',
            },
          }],
        }),
      });

      const request = createRequest({
        analysisType: 'generateScenarios',
        assetProfile: { assetName: 'Test' },
      });
      await POST(request);

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(callBody.response_format).toEqual({ type: 'json_object' });
    });

    it('should include the API key in the Authorization Bearer header', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          choices: [{
            message: {
              content: '{"pathways":[{"pathwayName":"Test","detailedNarrative":"Test"}],"recommendation":"ok","precedentStudies":[]}',
            },
          }],
        }),
      });

      const request = createRequest({
        analysisType: 'generateScenarios',
        assetProfile: { assetName: 'Test' },
      });
      await POST(request);

      const fetchHeaders = mockFetch.mock.calls[0][1].headers;
      expect(fetchHeaders['Authorization']).toBe('Bearer sk-test-api-key-12345');
    });
  });
});
