import { parseAIResponse } from '@/lib/responseParser';

describe('parseAIResponse', () => {
  describe('when given valid JSON directly', () => {
    it('should parse a simple JSON object', () => {
      const input = '{"key": "value"}';
      const result = parseAIResponse(input);
      expect(result).toEqual({ key: 'value' });
    });

    it('should parse a JSON array', () => {
      const input = '[1, 2, 3]';
      const result = parseAIResponse(input);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should parse nested JSON objects', () => {
      const input = '{"pathways": [{"name": "CCS"}], "recommendation": "test"}';
      const result = parseAIResponse(input);
      expect(result).toEqual({
        pathways: [{ name: 'CCS' }],
        recommendation: 'test',
      });
    });
  });

  describe('when given JSON wrapped in markdown code fences', () => {
    it('should strip ```json prefix and ``` suffix', () => {
      const input = '```json\n{"key": "value"}\n```';
      const result = parseAIResponse(input);
      expect(result).toEqual({ key: 'value' });
    });

    it('should strip plain ``` prefix and suffix', () => {
      const input = '```\n{"key": "value"}\n```';
      const result = parseAIResponse(input);
      expect(result).toEqual({ key: 'value' });
    });

    it('should handle code fences with extra whitespace', () => {
      const input = '```json  \n  {"key": "value"}  \n  ```';
      const result = parseAIResponse(input);
      expect(result).toEqual({ key: 'value' });
    });

    it('should be case-insensitive for json marker', () => {
      const input = '```JSON\n{"key": "value"}\n```';
      const result = parseAIResponse(input);
      expect(result).toEqual({ key: 'value' });
    });
  });

  describe('when given JSON embedded in surrounding text', () => {
    it('should extract a JSON object from surrounding prose', () => {
      const input = 'Here is the result:\n{"key": "value"}\nThank you.';
      const result = parseAIResponse(input);
      expect(result).toEqual({ key: 'value' });
    });

    it('should extract a deeply nested JSON object', () => {
      const input = 'Analysis complete.\n{"pathways": [{"name": "CCS", "data": {"cost": 100}}]}\nEnd.';
      const result = parseAIResponse(input);
      expect(result).toEqual({
        pathways: [{ name: 'CCS', data: { cost: 100 } }],
      });
    });
  });

  describe('when given invalid input', () => {
    it('should throw an error for plain text without JSON', () => {
      const input = 'This is just plain text with no JSON content at all.';
      expect(() => parseAIResponse(input)).toThrow(
        'Failed to parse AI response as JSON'
      );
    });

    it('should throw an error for empty string', () => {
      expect(() => parseAIResponse('')).toThrow();
    });

    it('should throw an error for malformed JSON', () => {
      const input = '{"key": "value"';
      expect(() => parseAIResponse(input)).toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle JSON with unicode characters', () => {
      const input = '{"name": "R\u00e9sum\u00e9", "cost": "$180M\u2013$280M"}';
      const result = parseAIResponse(input);
      expect(result).toEqual({ name: 'R\u00e9sum\u00e9', cost: '$180M\u2013$280M' });
    });

    it('should handle JSON with newlines in strings', () => {
      const input = '{"text": "line1\\nline2"}';
      const result = parseAIResponse(input);
      expect(result).toEqual({ text: 'line1\nline2' });
    });

    it('should handle whitespace-only input', () => {
      expect(() => parseAIResponse('   \n\n  ')).toThrow();
    });
  });
});
