import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PrecedentPanel from '@/components/PrecedentPanel';
import { mockPrecedentStudies } from '../helpers/testUtils';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  BookOpen: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'book-icon' }),
  ChevronDown: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'chevron-icon' }),
  Sparkles: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'sparkles-icon' }),
}));

describe('PrecedentPanel', () => {
  describe('empty state', () => {
    it('should render nothing when precedentStudies is empty', () => {
      const { container } = render(<PrecedentPanel precedentStudies={[]} />);
      expect(container.innerHTML).toBe('');
    });

    it('should render nothing when precedentStudies is null-like', () => {
      const { container } = render(
        <PrecedentPanel precedentStudies={null as unknown as []} />
      );
      expect(container.innerHTML).toBe('');
    });
  });

  describe('collapsed state (default)', () => {
    it('should display the section header text', () => {
      render(<PrecedentPanel precedentStudies={mockPrecedentStudies} />);

      expect(screen.getByText('Relevant precedent from prior studies')).toBeInTheDocument();
    });

    it('should have aria-expanded=false initially', () => {
      render(<PrecedentPanel precedentStudies={mockPrecedentStudies} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('should not display study details while collapsed', () => {
      render(<PrecedentPanel precedentStudies={mockPrecedentStudies} />);

      const contentRegion = document.getElementById('precedent-content');
      expect(contentRegion).toHaveClass('max-h-0');
    });
  });

  describe('expanded state', () => {
    it('should expand when the header is clicked', async () => {
      const user = userEvent.setup();
      render(<PrecedentPanel precedentStudies={mockPrecedentStudies} />);

      await user.click(screen.getByRole('button'));

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('should display all study references when expanded', async () => {
      const user = userEvent.setup();
      render(<PrecedentPanel precedentStudies={mockPrecedentStudies} />);

      await user.click(screen.getByRole('button'));

      mockPrecedentStudies.forEach((study) => {
        expect(screen.getByText(study.reference)).toBeInTheDocument();
      });
    });

    it('should display finding summaries when expanded', async () => {
      const user = userEvent.setup();
      render(<PrecedentPanel precedentStudies={mockPrecedentStudies} />);

      await user.click(screen.getByRole('button'));

      mockPrecedentStudies.forEach((study) => {
        expect(screen.getByText(study.findingSummary)).toBeInTheDocument();
      });
    });

    it('should display "Key assumptions" section headers', async () => {
      const user = userEvent.setup();
      render(<PrecedentPanel precedentStudies={mockPrecedentStudies} />);

      await user.click(screen.getByRole('button'));

      expect(screen.getAllByText('Key assumptions')).toHaveLength(mockPrecedentStudies.length);
    });

    it('should display "Relevance to current asset" section headers', async () => {
      const user = userEvent.setup();
      render(<PrecedentPanel precedentStudies={mockPrecedentStudies} />);

      await user.click(screen.getByRole('button'));

      expect(screen.getAllByText('Relevance to current asset')).toHaveLength(mockPrecedentStudies.length);
    });

    it('should display disclaimer note for each study', async () => {
      const user = userEvent.setup();
      render(<PrecedentPanel precedentStudies={mockPrecedentStudies} />);

      await user.click(screen.getByRole('button'));

      const disclaimers = screen.getAllByText('Note: Generated from sample knowledge base');
      expect(disclaimers).toHaveLength(mockPrecedentStudies.length);
    });

    it('should collapse when header is clicked again', async () => {
      const user = userEvent.setup();
      render(<PrecedentPanel precedentStudies={mockPrecedentStudies} />);

      await user.click(screen.getByRole('button'));
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');

      await user.click(screen.getByRole('button'));
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('accessibility', () => {
    it('should have aria-controls pointing to precedent-content', () => {
      render(<PrecedentPanel precedentStudies={mockPrecedentStudies} />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-controls', 'precedent-content');
    });

    it('should have a content region with appropriate aria-label', () => {
      render(<PrecedentPanel precedentStudies={mockPrecedentStudies} />);

      const region = screen.getByRole('region', { name: /precedent study details/i });
      expect(region).toBeInTheDocument();
    });
  });
});
