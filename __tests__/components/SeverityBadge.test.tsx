import React from 'react';
import { render, screen } from '@testing-library/react';
import SeverityBadge from '@/components/SeverityBadge';

describe('SeverityBadge', () => {
  describe('rendering levels', () => {
    it('should display "Low" text for Low level', () => {
      render(<SeverityBadge level="Low" />);
      expect(screen.getByText('Low')).toBeInTheDocument();
    });

    it('should display "Medium" text for Medium level', () => {
      render(<SeverityBadge level="Medium" />);
      expect(screen.getByText('Medium')).toBeInTheDocument();
    });

    it('should display "High" text for High level', () => {
      render(<SeverityBadge level="High" />);
      expect(screen.getByText('High')).toBeInTheDocument();
    });
  });

  describe('color classes', () => {
    it('should apply teal background for Low level', () => {
      const { container } = render(<SeverityBadge level="Low" />);
      const badge = container.querySelector('span');
      expect(badge?.className).toContain('bg-worley-teal');
    });

    it('should apply amber background for Medium level', () => {
      const { container } = render(<SeverityBadge level="Medium" />);
      const badge = container.querySelector('span');
      expect(badge?.className).toContain('bg-worley-amber');
    });

    it('should apply red background for High level', () => {
      const { container } = render(<SeverityBadge level="High" />);
      const badge = container.querySelector('span');
      expect(badge?.className).toContain('bg-worley-red');
    });
  });

  describe('with label prop', () => {
    it('should display label followed by level when label is provided', () => {
      render(<SeverityBadge level="Medium" label="Risk" />);
      expect(screen.getByText('Risk: Medium')).toBeInTheDocument();
    });

    it('should display just the level when no label is provided', () => {
      render(<SeverityBadge level="High" />);
      expect(screen.getByText('High')).toBeInTheDocument();
    });
  });
});
