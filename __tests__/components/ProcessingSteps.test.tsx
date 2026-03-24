import React from 'react';
import { render, screen } from '@testing-library/react';
import ProcessingSteps from '@/components/ProcessingSteps';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Check: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'check-icon' }),
}));

describe('ProcessingSteps', () => {
  describe('initial state (step 1, no completions)', () => {
    it('should display all three step labels', () => {
      render(<ProcessingSteps currentStep={1} completedSteps={[]} />);

      expect(screen.getByText('Reading asset profile')).toBeInTheDocument();
      expect(screen.getByText('Generating pathway scenarios')).toBeInTheDocument();
      expect(screen.getByText('Finding relevant precedent')).toBeInTheDocument();
    });

    it('should display all three step descriptions', () => {
      render(<ProcessingSteps currentStep={1} completedSteps={[]} />);

      expect(screen.getByText('Structuring your asset data')).toBeInTheDocument();
      expect(screen.getByText('Analysing four transition pathways')).toBeInTheDocument();
      expect(screen.getByText('Searching for similar prior studies')).toBeInTheDocument();
    });

    it('should mark step 1 as in progress via aria-label', () => {
      render(<ProcessingSteps currentStep={1} completedSteps={[]} />);

      expect(screen.getByLabelText(/Step 1.*in progress/i)).toBeInTheDocument();
    });

    it('should mark steps 2 and 3 as pending', () => {
      render(<ProcessingSteps currentStep={1} completedSteps={[]} />);

      expect(screen.getByLabelText(/Step 2.*pending/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Step 3.*pending/i)).toBeInTheDocument();
    });
  });

  describe('step 2 with step 1 completed', () => {
    it('should mark step 1 as complete', () => {
      render(<ProcessingSteps currentStep={2} completedSteps={[1]} />);

      expect(screen.getByLabelText(/Step 1.*complete/i)).toBeInTheDocument();
    });

    it('should mark step 2 as in progress', () => {
      render(<ProcessingSteps currentStep={2} completedSteps={[1]} />);

      expect(screen.getByLabelText(/Step 2.*in progress/i)).toBeInTheDocument();
    });

    it('should render a check icon for completed step', () => {
      render(<ProcessingSteps currentStep={2} completedSteps={[1]} />);

      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
    });
  });

  describe('all steps completed', () => {
    it('should mark all steps as complete', () => {
      render(<ProcessingSteps currentStep={3} completedSteps={[1, 2, 3]} />);

      expect(screen.getByLabelText(/Step 1.*complete/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Step 2.*complete/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Step 3.*complete/i)).toBeInTheDocument();
    });

    it('should render three check icons for all completed steps', () => {
      render(<ProcessingSteps currentStep={3} completedSteps={[1, 2, 3]} />);

      expect(screen.getAllByTestId('check-icon')).toHaveLength(3);
    });
  });
});
