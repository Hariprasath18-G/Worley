import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PathwayCard from '@/components/PathwayCard';
import { mockPathways } from '../helpers/testUtils';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronDown: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'chevron-down' }),
  Sparkles: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'sparkles-icon' }),
}));

describe('PathwayCard', () => {
  const samplePathway = mockPathways[0]; // Optimize + CCS
  const sampleColor = '#025966';

  describe('rendering', () => {
    it('should display the pathway name as heading', () => {
      render(<PathwayCard pathway={samplePathway} accentColor={sampleColor} />);

      expect(screen.getByRole('heading', { name: /Optimize \+ CCS/i })).toBeInTheDocument();
    });

    it('should display the pathway subtitle', () => {
      render(<PathwayCard pathway={samplePathway} accentColor={sampleColor} />);

      expect(screen.getByText(samplePathway.subtitle)).toBeInTheDocument();
    });

    it('should display the CAPEX range metric', () => {
      render(<PathwayCard pathway={samplePathway} accentColor={sampleColor} />);

      expect(screen.getByText('Est. CAPEX')).toBeInTheDocument();
      expect(screen.getByText(samplePathway.capexRange)).toBeInTheDocument();
    });

    it('should display the emissions reduction metric', () => {
      render(<PathwayCard pathway={samplePathway} accentColor={sampleColor} />);

      expect(screen.getByText('Emissions reduction')).toBeInTheDocument();
      expect(screen.getByText(samplePathway.emissionsReduction)).toBeInTheDocument();
    });

    it('should display the timeline metric', () => {
      render(<PathwayCard pathway={samplePathway} accentColor={sampleColor} />);

      expect(screen.getByText('Timeline')).toBeInTheDocument();
      expect(screen.getByText(samplePathway.timeline)).toBeInTheDocument();
    });

    it('should display regulatory complexity as a badge', () => {
      render(<PathwayCard pathway={samplePathway} accentColor={sampleColor} />);

      expect(screen.getByText('Regulatory complexity')).toBeInTheDocument();
      // Both regulatoryComplexity and confidence may be "Medium", so use getAllByText
      const mediumBadges = screen.getAllByText(samplePathway.regulatoryComplexity);
      expect(mediumBadges.length).toBeGreaterThanOrEqual(1);
    });

    it('should display AI confidence badge', () => {
      render(<PathwayCard pathway={samplePathway} accentColor={sampleColor} />);

      expect(screen.getByText('AI Confidence')).toBeInTheDocument();
    });

    it('should display the AI generated badge', () => {
      render(<PathwayCard pathway={samplePathway} accentColor={sampleColor} />);

      expect(screen.getByText('AI generated')).toBeInTheDocument();
    });

    it('should render the accent color bar', () => {
      const { container } = render(
        <PathwayCard pathway={samplePathway} accentColor={sampleColor} />
      );

      const accentBar = container.querySelector('[aria-hidden="true"]');
      expect(accentBar).toHaveStyle({ backgroundColor: sampleColor });
    });
  });

  describe('expand/collapse behavior', () => {
    it('should show "View details" button initially', () => {
      render(<PathwayCard pathway={samplePathway} accentColor={sampleColor} />);

      expect(screen.getByText('View details')).toBeInTheDocument();
    });

    it('should not show detailed narrative initially', () => {
      render(<PathwayCard pathway={samplePathway} accentColor={sampleColor} />);

      // The detailed narrative region should have max-h-0 (collapsed)
      const detailId = `detail-${samplePathway.pathwayName.replace(/\s+/g, '-').toLowerCase()}`;
      const detailRegion = document.getElementById(detailId);
      expect(detailRegion).toHaveClass('max-h-0');
    });

    it('should expand to show details when View details is clicked', async () => {
      const user = userEvent.setup();
      render(<PathwayCard pathway={samplePathway} accentColor={sampleColor} />);

      await user.click(screen.getByText('View details'));

      expect(screen.getByText('Hide details')).toBeInTheDocument();
      const detailId = `detail-${samplePathway.pathwayName.replace(/\s+/g, '-').toLowerCase()}`;
      const detailRegion = document.getElementById(detailId);
      expect(detailRegion).not.toHaveClass('max-h-0');
    });

    it('should collapse when Hide details is clicked', async () => {
      const user = userEvent.setup();
      render(<PathwayCard pathway={samplePathway} accentColor={sampleColor} />);

      // Expand
      await user.click(screen.getByText('View details'));
      expect(screen.getByText('Hide details')).toBeInTheDocument();

      // Collapse
      await user.click(screen.getByText('Hide details'));
      expect(screen.getByText('View details')).toBeInTheDocument();
    });

    it('should display the detailed narrative text when expanded', async () => {
      const user = userEvent.setup();
      render(<PathwayCard pathway={samplePathway} accentColor={sampleColor} />);

      await user.click(screen.getByText('View details'));

      expect(screen.getByText(samplePathway.detailedNarrative)).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have aria-expanded attribute on the toggle button', () => {
      render(<PathwayCard pathway={samplePathway} accentColor={sampleColor} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('should update aria-expanded when toggled', async () => {
      const user = userEvent.setup();
      render(<PathwayCard pathway={samplePathway} accentColor={sampleColor} />);

      const button = screen.getByRole('button');
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('should have aria-controls referencing the detail region', () => {
      render(<PathwayCard pathway={samplePathway} accentColor={sampleColor} />);

      const button = screen.getByRole('button');
      const controlsId = button.getAttribute('aria-controls');
      expect(controlsId).toBeTruthy();
      expect(document.getElementById(controlsId!)).toBeInTheDocument();
    });

    it('should have a role=region with descriptive aria-label on the detail section', () => {
      render(<PathwayCard pathway={samplePathway} accentColor={sampleColor} />);

      const region = screen.getByRole('region');
      expect(region).toHaveAttribute('aria-label', `Detailed narrative for ${samplePathway.pathwayName}`);
    });
  });

  describe('stranded capital risk', () => {
    it('should display stranded capital risk badge', () => {
      render(<PathwayCard pathway={samplePathway} accentColor={sampleColor} />);

      expect(screen.getByText('Stranded capital risk')).toBeInTheDocument();
      expect(screen.getByTestId('stranded-capital-risk')).toBeInTheDocument();
    });
  });

  describe('emissions ring', () => {
    it('should render SVG elements for the emissions ring', () => {
      const { container } = render(
        <PathwayCard pathway={samplePathway} accentColor={sampleColor} />
      );

      const svgs = container.querySelectorAll('svg[aria-hidden="true"]');
      // At least the accent bar div + emissions ring SVG
      expect(svgs.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('with different pathways', () => {
    it('should render Full Decommission pathway with correct data', () => {
      const decommission = mockPathways[3];
      render(<PathwayCard pathway={decommission} accentColor="#8B8D8F" />);

      expect(screen.getByRole('heading', { name: /Full Decommission/i })).toBeInTheDocument();
      expect(screen.getByText(decommission.capexRange)).toBeInTheDocument();
      expect(screen.getByText('100%')).toBeInTheDocument();
    });

    it('should render Hydrogen pathway with High regulatory complexity', () => {
      const hydrogen = mockPathways[1];
      render(<PathwayCard pathway={hydrogen} accentColor="#2DB3C7" />);

      expect(screen.getByRole('heading', { name: /Green Hydrogen/i })).toBeInTheDocument();
      // Should have 'High' shown for regulatory complexity and stranded capital risk
      expect(screen.getAllByText('High').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('Low')).toBeInTheDocument();
    });
  });
});
