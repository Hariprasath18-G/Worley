import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResultsTabs from '@/components/ResultsTabs';
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

describe('ResultsTabs', () => {
  const childContent = <div data-testid="scenario-content">Scenario Results Content</div>;

  it('renders both tab buttons', () => {
    render(<ResultsTabs pathways={mockPathways}>{childContent}</ResultsTabs>);
    expect(screen.getByRole('tab', { name: 'Scenario Results' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'What-If Analysis' })).toBeInTheDocument();
  });

  it('shows scenario content by default (Tab 1 active)', () => {
    render(<ResultsTabs pathways={mockPathways}>{childContent}</ResultsTabs>);
    expect(screen.getByTestId('scenario-content')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Scenario Results' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: 'What-If Analysis' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('switches to What-If panel on Tab 2 click', () => {
    render(<ResultsTabs pathways={mockPathways}>{childContent}</ResultsTabs>);
    fireEvent.click(screen.getByRole('tab', { name: 'What-If Analysis' }));

    // Scenario content should be hidden
    expect(screen.queryByTestId('scenario-content')).not.toBeInTheDocument();
    // What-If content should show (heading + tab button both have text)
    expect(screen.getByText('Adjust assumptions to see how pathway attractiveness changes in real-time.')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'What-If Analysis' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('switches back to scenario results on Tab 1 click', () => {
    render(<ResultsTabs pathways={mockPathways}>{childContent}</ResultsTabs>);
    // Go to tab 2
    fireEvent.click(screen.getByRole('tab', { name: 'What-If Analysis' }));
    // Go back to tab 1
    fireEvent.click(screen.getByRole('tab', { name: 'Scenario Results' }));
    expect(screen.getByTestId('scenario-content')).toBeInTheDocument();
  });

  it('has correct ARIA roles (tablist, tab, tabpanel)', () => {
    render(<ResultsTabs pathways={mockPathways}>{childContent}</ResultsTabs>);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(2);
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
  });

  it('tab buttons have aria-controls matching tabpanel id', () => {
    render(<ResultsTabs pathways={mockPathways}>{childContent}</ResultsTabs>);
    const tab0 = screen.getByRole('tab', { name: 'Scenario Results' });
    expect(tab0).toHaveAttribute('aria-controls', 'tabpanel-0');
    expect(tab0).toHaveAttribute('id', 'tab-0');

    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('id', 'tabpanel-0');
    expect(panel).toHaveAttribute('aria-labelledby', 'tab-0');
  });
});
