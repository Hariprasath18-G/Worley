import React from 'react';
import { render, screen } from '@testing-library/react';
import RecommendationPanel from '@/components/RecommendationPanel';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Info: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'info-icon' }),
  Sparkles: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'sparkles-icon' }),
}));

describe('RecommendationPanel', () => {
  const sampleRecommendation =
    'Based on the assessment, the Biofuels pathway appears to offer the most balanced risk-reward profile.';

  describe('rendering with valid recommendation', () => {
    it('should display the recommendation heading', () => {
      render(<RecommendationPanel recommendation={sampleRecommendation} />);

      expect(screen.getByRole('heading', { name: /Recommendation/i })).toBeInTheDocument();
    });

    it('should display the recommendation text', () => {
      render(<RecommendationPanel recommendation={sampleRecommendation} />);

      expect(screen.getByText(sampleRecommendation)).toBeInTheDocument();
    });

    it('should display the "AI-generated preliminary assessment" banner', () => {
      render(<RecommendationPanel recommendation={sampleRecommendation} />);

      expect(screen.getByText('AI-generated preliminary assessment')).toBeInTheDocument();
    });

    it('should display the "Requires consultant validation" badge', () => {
      render(<RecommendationPanel recommendation={sampleRecommendation} />);

      expect(screen.getByText('Requires consultant validation')).toBeInTheDocument();
    });

    it('should display the AI generated badge', () => {
      render(<RecommendationPanel recommendation={sampleRecommendation} />);

      expect(screen.getByText('AI generated')).toBeInTheDocument();
    });

    it('should render the info icon', () => {
      render(<RecommendationPanel recommendation={sampleRecommendation} />);

      expect(screen.getByTestId('info-icon')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('should display "No recommendation available" when recommendation is empty', () => {
      render(<RecommendationPanel recommendation="" />);

      expect(screen.getByText('No recommendation available')).toBeInTheDocument();
    });

    it('should not display the heading when recommendation is empty', () => {
      render(<RecommendationPanel recommendation="" />);

      expect(screen.queryByRole('heading', { name: /Recommendation/i })).not.toBeInTheDocument();
    });

    it('should not display the consultant validation badge when empty', () => {
      render(<RecommendationPanel recommendation="" />);

      expect(screen.queryByText('Requires consultant validation')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have a role=region with aria-label "AI Recommendation"', () => {
      render(<RecommendationPanel recommendation={sampleRecommendation} />);

      const region = screen.getByRole('region', { name: /AI Recommendation/i });
      expect(region).toBeInTheDocument();
    });
  });

  describe('long recommendation text', () => {
    it('should render long recommendation text without truncation', () => {
      const longText = 'A'.repeat(1000);
      render(<RecommendationPanel recommendation={longText} />);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });
  });
});
