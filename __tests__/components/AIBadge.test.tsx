import React from 'react';
import { render, screen } from '@testing-library/react';
import AIBadge from '@/components/AIBadge';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Sparkles: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'sparkles-icon' }),
}));

describe('AIBadge', () => {
  it('should display "AI generated" text', () => {
    render(<AIBadge />);
    expect(screen.getByText('AI generated')).toBeInTheDocument();
  });

  it('should render the sparkles icon', () => {
    render(<AIBadge />);
    expect(screen.getByTestId('sparkles-icon')).toBeInTheDocument();
  });

  it('should have aria-label for screen readers', () => {
    const { container } = render(<AIBadge />);
    const badge = container.querySelector('[aria-label]');
    expect(badge).toHaveAttribute('aria-label', 'This content is AI generated');
  });

  it('should render as a span element', () => {
    const { container } = render(<AIBadge />);
    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span?.textContent).toContain('AI generated');
  });
});
