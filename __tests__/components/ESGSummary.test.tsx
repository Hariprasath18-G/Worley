import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ESGSummary from '@/components/ESGSummary';
import { mockPathways } from '../helpers/testUtils';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronDown: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'chevron-icon' }),
  Sparkles: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'sparkles-icon' }),
}));

describe('ESGSummary', () => {
  it('should render the ESG Impact Assessment heading', () => {
    render(<ESGSummary pathways={mockPathways} />);
    expect(screen.getByText('ESG Impact Assessment')).toBeInTheDocument();
  });

  it('should render with accessible region role', () => {
    render(<ESGSummary pathways={mockPathways} />);
    expect(screen.getByRole('region', { name: /ESG Impact Assessment/i })).toBeInTheDocument();
  });

  it('should display all 4 pathway names', () => {
    render(<ESGSummary pathways={mockPathways} />);
    expect(screen.getAllByText('Optimize + CCS').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Repurpose to Green Hydrogen').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Repurpose to Biofuels').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Full Decommission').length).toBeGreaterThanOrEqual(1);
  });

  it('should display ESG grade badges for each pathway', () => {
    render(<ESGSummary pathways={mockPathways} />);
    const gradeBadges = screen.getAllByText(/^Grade [A-E]$/);
    expect(gradeBadges.length).toBe(4);
  });

  it('should show Env and Social score bars', () => {
    render(<ESGSummary pathways={mockPathways} />);
    const envLabels = screen.getAllByText('Env');
    const socialLabels = screen.getAllByText('Social');
    expect(envLabels.length).toBe(4);
    expect(socialLabels.length).toBe(4);
  });

  it('should display the disclaimer about ESG scores', () => {
    render(<ESGSummary pathways={mockPathways} />);
    expect(screen.getByText(/ESG scores are indicative benchmarks/i)).toBeInTheDocument();
  });

  it('should collapse and expand when toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(<ESGSummary pathways={mockPathways} />);

    const toggle = screen.getByText('Collapse');
    await user.click(toggle);
    expect(screen.getByText('Expand')).toBeInTheDocument();

    await user.click(screen.getByText('Expand'));
    expect(screen.getByText('Collapse')).toBeInTheDocument();
  });

  it('should identify the highest ESG scoring pathway in the summary', () => {
    render(<ESGSummary pathways={mockPathways} />);
    // Full Decommission has 100% emissions reduction = highest env score
    expect(screen.getByText(/scores highest overall ESG rating/i)).toBeInTheDocument();
  });
});
