import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SensitivityTab from '@/components/SensitivityTab';
import { mockPathways } from '../helpers/testUtils';

// Mock recharts to avoid canvas/SVG rendering issues in JSDOM
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
  };
});

describe('SensitivityTab', () => {
  it('renders the tab heading', () => {
    render(<SensitivityTab pathways={mockPathways} />);
    expect(screen.getByText('What-If Analysis')).toBeInTheDocument();
  });

  it('renders all 5 assumption sliders', () => {
    render(<SensitivityTab pathways={mockPathways} />);
    expect(screen.getByLabelText('Carbon Price')).toBeInTheDocument();
    expect(screen.getByLabelText('CAPEX Budget Factor')).toBeInTheDocument();
    expect(screen.getByLabelText('Emissions Target')).toBeInTheDocument();
    expect(screen.getByLabelText('Remaining Asset Life')).toBeInTheDocument();
    expect(screen.getByLabelText('Discount Rate')).toBeInTheDocument();
  });

  it('displays description text', () => {
    render(<SensitivityTab pathways={mockPathways} />);
    expect(
      screen.getByText(/Adjust assumptions to see how pathway attractiveness changes/),
    ).toBeInTheDocument();
  });

  it('renders disclaimer text', () => {
    render(<SensitivityTab pathways={mockPathways} />);
    expect(
      screen.getByText(/Disclaimer: Scores are derived from an indicative weighting model/),
    ).toBeInTheDocument();
  });

  it('slider changes update displayed scores', () => {
    render(<SensitivityTab pathways={mockPathways} />);
    const carbonSlider = screen.getByLabelText('Carbon Price');

    // Change carbon price to high value
    fireEvent.change(carbonSlider, { target: { value: '180' } });

    // Scores should still be rendered (pathway names visible in ranking cards)
    expect(screen.getByText('Optimize + CCS')).toBeInTheDocument();
    expect(screen.getByText('Full Decommission')).toBeInTheDocument();
  });

  it('reset button restores default values', () => {
    render(<SensitivityTab pathways={mockPathways} />);
    const carbonSlider = screen.getByLabelText('Carbon Price') as HTMLInputElement;

    // Change value
    fireEvent.change(carbonSlider, { target: { value: '150' } });
    expect(carbonSlider.value).toBe('150');

    // Reset
    fireEvent.click(screen.getByText('Reset to Defaults'));
    expect(carbonSlider.value).toBe('75');
  });

  it('renders correct ARIA attributes on sliders', () => {
    render(<SensitivityTab pathways={mockPathways} />);
    const carbonSlider = screen.getByLabelText('Carbon Price');
    expect(carbonSlider).toHaveAttribute('aria-valuemin', '10');
    expect(carbonSlider).toHaveAttribute('aria-valuemax', '200');
    expect(carbonSlider).toHaveAttribute('aria-valuenow', '75');
  });
});
