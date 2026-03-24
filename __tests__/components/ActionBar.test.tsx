import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ActionBar from '@/components/ActionBar';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Download: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'download-icon' }),
  Plus: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'plus-icon' }),
  FileText: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'file-text-icon' }),
  FileJson: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'file-json-icon' }),
  ChevronDown: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'chevron-down' }),
}));

describe('ActionBar', () => {
  const mockOnStartNew = jest.fn();
  const mockOnExportPDF = jest.fn();
  const mockOnExportJSON = jest.fn();

  beforeEach(() => {
    mockOnStartNew.mockClear();
    mockOnExportPDF.mockClear();
    mockOnExportJSON.mockClear();
  });

  describe('rendering', () => {
    it('should display "Export report" button', () => {
      render(<ActionBar onStartNew={mockOnStartNew} onExportPDF={mockOnExportPDF} onExportJSON={mockOnExportJSON} />);
      expect(screen.getByText('Export report')).toBeInTheDocument();
    });

    it('should display "Start new assessment" button', () => {
      render(<ActionBar onStartNew={mockOnStartNew} onExportPDF={mockOnExportPDF} onExportJSON={mockOnExportJSON} />);
      expect(screen.getByText('Start new assessment')).toBeInTheDocument();
    });

    it('should render as a nav element with role=navigation', () => {
      render(<ActionBar onStartNew={mockOnStartNew} onExportPDF={mockOnExportPDF} onExportJSON={mockOnExportJSON} />);
      expect(screen.getByRole('navigation', { name: /Results actions/i })).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should call onStartNew when Start new assessment is clicked', async () => {
      const user = userEvent.setup();
      render(<ActionBar onStartNew={mockOnStartNew} onExportPDF={mockOnExportPDF} onExportJSON={mockOnExportJSON} />);

      await user.click(screen.getByText('Start new assessment'));
      expect(mockOnStartNew).toHaveBeenCalledTimes(1);
    });

    it('should show export dropdown when Export report is clicked', async () => {
      const user = userEvent.setup();
      render(<ActionBar onStartNew={mockOnStartNew} onExportPDF={mockOnExportPDF} onExportJSON={mockOnExportJSON} />);

      await user.click(screen.getByText('Export report'));
      expect(screen.getByText('Print / Save as PDF')).toBeInTheDocument();
      expect(screen.getByText('Download JSON')).toBeInTheDocument();
    });

    it('should call onExportPDF when Print/PDF option is clicked', async () => {
      const user = userEvent.setup();
      render(<ActionBar onStartNew={mockOnStartNew} onExportPDF={mockOnExportPDF} onExportJSON={mockOnExportJSON} />);

      await user.click(screen.getByText('Export report'));
      await user.click(screen.getByText('Print / Save as PDF'));
      expect(mockOnExportPDF).toHaveBeenCalledTimes(1);
    });

    it('should call onExportJSON when Download JSON option is clicked', async () => {
      const user = userEvent.setup();
      render(<ActionBar onStartNew={mockOnStartNew} onExportPDF={mockOnExportPDF} onExportJSON={mockOnExportJSON} />);

      await user.click(screen.getByText('Export report'));
      await user.click(screen.getByText('Download JSON'));
      expect(mockOnExportJSON).toHaveBeenCalledTimes(1);
    });
  });
});
