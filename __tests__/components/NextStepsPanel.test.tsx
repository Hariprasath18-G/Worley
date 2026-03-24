import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NextStepsPanel from '@/components/NextStepsPanel';
import { mockPathways } from '../helpers/testUtils';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronDown: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'chevron-icon' }),
  Sparkles: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'sparkles-icon' }),
}));

describe('NextStepsPanel', () => {
  it('should render the Recommended Next Steps heading', () => {
    render(<NextStepsPanel pathways={mockPathways} />);
    expect(screen.getByText('Recommended Next Steps')).toBeInTheDocument();
  });

  it('should render with accessible region role', () => {
    render(<NextStepsPanel pathways={mockPathways} />);
    expect(screen.getByRole('region', { name: /Recommended Next Steps/i })).toBeInTheDocument();
  });

  it('should display all 4 pathway names as accordion headers', () => {
    render(<NextStepsPanel pathways={mockPathways} />);
    // Each pathway name appears as an accordion button
    const buttons = screen.getAllByRole('button');
    const pathwayButtons = buttons.filter((btn) => btn.getAttribute('aria-expanded') !== null);
    expect(pathwayButtons.length).toBe(4);
  });

  it('should show timeframe badges', () => {
    render(<NextStepsPanel pathways={mockPathways} />);
    const timeframes = screen.getAllByText(/0–6 months/);
    expect(timeframes.length).toBeGreaterThanOrEqual(1);
  });

  it('should expand the first pathway by default', () => {
    render(<NextStepsPanel pathways={mockPathways} />);
    const firstButton = screen.getAllByRole('button').find(
      (btn) => btn.getAttribute('aria-expanded') === 'true'
    );
    expect(firstButton).toBeInTheDocument();
    expect(firstButton?.textContent).toContain('Optimize + CCS');
  });

  it('should show default next steps for Optimize + CCS', () => {
    render(<NextStepsPanel pathways={mockPathways} />);
    expect(screen.getByText(/Commission pre-FEED study/i)).toBeInTheDocument();
  });

  it('should toggle pathway accordion on click', async () => {
    const user = userEvent.setup();
    render(<NextStepsPanel pathways={mockPathways} />);

    // Click on Green Hydrogen to expand it
    const h2Button = screen.getByText('Repurpose to Green Hydrogen').closest('button')!;
    await user.click(h2Button);
    expect(h2Button.getAttribute('aria-expanded')).toBe('true');
  });

  it('should display the disclaimer footer', () => {
    render(<NextStepsPanel pathways={mockPathways} />);
    expect(screen.getByText(/indicative recommendations for further assessment/i)).toBeInTheDocument();
  });

  it('should use AI-provided nextSteps when available', () => {
    const pathwaysWithNextSteps = mockPathways.map((pw, i) =>
      i === 0 ? { ...pw, nextSteps: ['Custom AI step 1', 'Custom AI step 2'] } : pw
    );
    render(<NextStepsPanel pathways={pathwaysWithNextSteps} />);
    expect(screen.getByText('Custom AI step 1')).toBeInTheDocument();
    expect(screen.getByText('Custom AI step 2')).toBeInTheDocument();
  });
});
