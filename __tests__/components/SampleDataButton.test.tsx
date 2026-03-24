import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SampleDataButton from '@/components/SampleDataButton';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  FlaskConical: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'flask-icon' }),
}));

describe('SampleDataButton', () => {
  const mockOnLoadSample = jest.fn();

  beforeEach(() => {
    mockOnLoadSample.mockClear();
  });

  it('should display "Try sample asset" text', () => {
    render(<SampleDataButton onLoadSample={mockOnLoadSample} />);
    expect(screen.getByText('Try sample asset')).toBeInTheDocument();
  });

  it('should render the flask icon', () => {
    render(<SampleDataButton onLoadSample={mockOnLoadSample} />);
    expect(screen.getByTestId('flask-icon')).toBeInTheDocument();
  });

  it('should call onLoadSample when clicked', async () => {
    const user = userEvent.setup();
    render(<SampleDataButton onLoadSample={mockOnLoadSample} />);

    await user.click(screen.getByText('Try sample asset'));
    expect(mockOnLoadSample).toHaveBeenCalledTimes(1);
  });

  it('should be a button element', () => {
    render(<SampleDataButton onLoadSample={mockOnLoadSample} />);
    expect(screen.getByRole('button', { name: /try sample asset/i })).toBeInTheDocument();
  });
});
