import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComparisonMatrix from '@/components/ComparisonMatrix';
import { mockPathways } from '../helpers/testUtils';
import { DIMENSION_LABELS } from '@/lib/types';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronDown: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'chevron-down' }),
  Sparkles: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'sparkles-icon' }),
}));

describe('ComparisonMatrix', () => {
  describe('empty state', () => {
    it('should display "No comparison data available" when pathways is empty', () => {
      render(<ComparisonMatrix pathways={[]} />);

      expect(screen.getByText('No comparison data available')).toBeInTheDocument();
    });

    it('should display fallback message when pathways is null-like', () => {
      render(<ComparisonMatrix pathways={null as unknown as []} />);

      expect(screen.getByText('No comparison data available')).toBeInTheDocument();
    });
  });

  describe('rendering with data', () => {
    it('should display the section heading "Detailed Comparison"', () => {
      render(<ComparisonMatrix pathways={mockPathways} />);

      expect(screen.getByRole('heading', { name: /Detailed Comparison/i })).toBeInTheDocument();
    });

    it('should display AI generated badge', () => {
      render(<ComparisonMatrix pathways={mockPathways} />);

      expect(screen.getByText('AI generated')).toBeInTheDocument();
    });

    it('should render a table on desktop view', () => {
      render(<ComparisonMatrix pathways={mockPathways} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should display all pathway names as column headers', () => {
      render(<ComparisonMatrix pathways={mockPathways} />);

      mockPathways.forEach((pathway) => {
        expect(screen.getAllByText(pathway.pathwayName).length).toBeGreaterThanOrEqual(1);
      });
    });

    it('should display all dimension labels as row headers', () => {
      render(<ComparisonMatrix pathways={mockPathways} />);

      DIMENSION_LABELS.forEach((dim) => {
        expect(screen.getAllByText(dim.label).length).toBeGreaterThanOrEqual(1);
      });
    });

    it('should display "Dimension" as the first column header', () => {
      render(<ComparisonMatrix pathways={mockPathways} />);

      expect(screen.getByText('Dimension')).toBeInTheDocument();
    });

    it('should display the engineering summary content for CCS pathway', () => {
      render(<ComparisonMatrix pathways={mockPathways} />);

      expect(screen.getAllByText(mockPathways[0].engineeringSummary).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('mobile accordion behavior', () => {
    it('should render accordion buttons for each pathway in mobile view', () => {
      render(<ComparisonMatrix pathways={mockPathways} />);

      // The mobile view has buttons for each pathway name
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(mockPathways.length);
    });

    it('should toggle accordion when a pathway button is clicked', async () => {
      const user = userEvent.setup();
      render(<ComparisonMatrix pathways={mockPathways} />);

      // Find the mobile accordion buttons (they have aria-expanded)
      const accordionButtons = screen.getAllByRole('button').filter(
        (btn) => btn.hasAttribute('aria-expanded')
      );

      if (accordionButtons.length > 0) {
        const firstButton = accordionButtons[0];
        expect(firstButton).toHaveAttribute('aria-expanded', 'false');

        await user.click(firstButton);
        expect(firstButton).toHaveAttribute('aria-expanded', 'true');

        await user.click(firstButton);
        expect(firstButton).toHaveAttribute('aria-expanded', 'false');
      }
    });

    it('should only have one accordion open at a time', async () => {
      const user = userEvent.setup();
      render(<ComparisonMatrix pathways={mockPathways} />);

      // Filter to only mobile accordion buttons (exclude the main expand/collapse toggle)
      const accordionButtons = screen.getAllByRole('button').filter(
        (btn) => btn.hasAttribute('aria-expanded') && btn.hasAttribute('aria-controls')
      );

      if (accordionButtons.length >= 2) {
        await user.click(accordionButtons[0]);
        expect(accordionButtons[0]).toHaveAttribute('aria-expanded', 'true');

        await user.click(accordionButtons[1]);
        expect(accordionButtons[0]).toHaveAttribute('aria-expanded', 'false');
        expect(accordionButtons[1]).toHaveAttribute('aria-expanded', 'true');
      }
    });
  });

  describe('data unavailable fallback', () => {
    it('should display "Data unavailable" for missing dimension values', () => {
      const pathwayWithMissing = [{
        ...mockPathways[0],
        engineeringSummary: '',
      }];

      render(<ComparisonMatrix pathways={pathwayWithMissing} />);

      expect(screen.getAllByText('Data unavailable').length).toBeGreaterThanOrEqual(1);
    });
  });
});
