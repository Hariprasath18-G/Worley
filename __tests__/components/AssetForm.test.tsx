import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AssetForm from '@/components/AssetForm';
import { mockAssetProfile } from '../helpers/testUtils';
import { ASSET_TYPES, LOCATION_OPTIONS, PRIMARY_PRODUCTS } from '@/lib/types';
import type { AssetProfile } from '@/lib/types';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronDown: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'chevron-icon' }),
}));

const EMPTY_PROFILE: AssetProfile = {
  assetName: '',
  assetType: '' as AssetProfile['assetType'],
  yearCommissioned: 0,
  location: '' as AssetProfile['location'],
  currentCapacity: '',
  capacityUnit: 'bpd',
  primaryProduct: '' as AssetProfile['primaryProduct'],
  annualEmissions: '',
  knownConstraints: '',
  netZeroTarget: null,
  remainingDesignLife: null,
};

describe('AssetForm', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  describe('rendering', () => {
    it('should render all required field labels', () => {
      render(<AssetForm value={EMPTY_PROFILE} onChange={mockOnChange} />);

      expect(screen.getByLabelText(/asset name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/asset type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/year commissioned/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/current capacity/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/primary product/i)).toBeInTheDocument();
    });

    it('should render optional field labels', () => {
      render(<AssetForm value={EMPTY_PROFILE} onChange={mockOnChange} />);

      expect(screen.getByLabelText(/annual emissions/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/net zero target/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/remaining design life/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/known constraints/i)).toBeInTheDocument();
    });

    it('should render all asset type options in the select', () => {
      render(<AssetForm value={EMPTY_PROFILE} onChange={mockOnChange} />);

      const select = screen.getByLabelText(/asset type/i);
      ASSET_TYPES.forEach((type) => {
        expect(select).toContainHTML(type);
      });
    });

    it('should render all location options in the select', () => {
      render(<AssetForm value={EMPTY_PROFILE} onChange={mockOnChange} />);

      const select = screen.getByLabelText(/location/i);
      LOCATION_OPTIONS.forEach((loc) => {
        expect(select).toContainHTML(loc);
      });
    });

    it('should render all primary product options', () => {
      render(<AssetForm value={EMPTY_PROFILE} onChange={mockOnChange} />);

      const select = screen.getByLabelText(/primary product/i);
      PRIMARY_PRODUCTS.forEach((product) => {
        expect(select).toContainHTML(product);
      });
    });
  });

  describe('pre-filled values', () => {
    it('should display pre-filled asset name', () => {
      render(<AssetForm value={mockAssetProfile} onChange={mockOnChange} />);

      const input = screen.getByLabelText(/asset name/i) as HTMLInputElement;
      expect(input.value).toBe('Test Refinery Alpha');
    });

    it('should display pre-filled year commissioned', () => {
      render(<AssetForm value={mockAssetProfile} onChange={mockOnChange} />);

      const input = screen.getByLabelText(/year commissioned/i) as HTMLInputElement;
      expect(input.value).toBe('1990');
    });

    it('should display pre-filled known constraints', () => {
      render(<AssetForm value={mockAssetProfile} onChange={mockOnChange} />);

      const textarea = screen.getByLabelText(/known constraints/i) as HTMLTextAreaElement;
      expect(textarea.value).toContain('Aging FCC unit');
    });
  });

  describe('user interactions', () => {
    it('should call onChange when asset name is typed', async () => {
      const user = userEvent.setup();
      render(<AssetForm value={EMPTY_PROFILE} onChange={mockOnChange} />);

      const input = screen.getByLabelText(/asset name/i);
      await user.type(input, 'N');

      expect(mockOnChange).toHaveBeenCalled();
      const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
      expect(lastCall.assetName).toBe('N');
    });

    it('should call onChange when asset type is selected', async () => {
      const user = userEvent.setup();
      render(<AssetForm value={EMPTY_PROFILE} onChange={mockOnChange} />);

      const select = screen.getByLabelText(/asset type/i);
      await user.selectOptions(select, 'Refinery');

      expect(mockOnChange).toHaveBeenCalled();
      const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
      expect(lastCall.assetType).toBe('Refinery');
    });

    it('should call onChange when location is selected', async () => {
      const user = userEvent.setup();
      render(<AssetForm value={EMPTY_PROFILE} onChange={mockOnChange} />);

      const select = screen.getByLabelText(/location/i);
      await user.selectOptions(select, 'Norway');

      expect(mockOnChange).toHaveBeenCalled();
      const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
      expect(lastCall.location).toBe('Norway');
    });

    it('should toggle emissions unknown checkbox', async () => {
      const user = userEvent.setup();
      const profileWithEmissions = { ...EMPTY_PROFILE, annualEmissions: '500000' };
      render(<AssetForm value={profileWithEmissions} onChange={mockOnChange} />);

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      expect(mockOnChange).toHaveBeenCalled();
      const lastCall = mockOnChange.mock.calls[mockOnChange.mock.calls.length - 1][0];
      expect(lastCall.annualEmissions).toBeNull();
    });
  });

  describe('disabled state', () => {
    it('should disable all inputs when disabled prop is true', () => {
      render(<AssetForm value={EMPTY_PROFILE} onChange={mockOnChange} disabled />);

      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input) => {
        expect(input).toBeDisabled();
      });

      const selects = screen.getAllByRole('combobox');
      selects.forEach((select) => {
        expect(select).toBeDisabled();
      });
    });

    it('should not call onChange when disabled input is clicked', async () => {
      const user = userEvent.setup();
      render(<AssetForm value={EMPTY_PROFILE} onChange={mockOnChange} disabled />);

      const input = screen.getByLabelText(/asset name/i);
      await user.click(input);

      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have aria-required on required fields', () => {
      render(<AssetForm value={EMPTY_PROFILE} onChange={mockOnChange} />);

      expect(screen.getByLabelText(/asset name/i)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(/asset type/i)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(/location/i)).toHaveAttribute('aria-required', 'true');
    });

    it('should have associated labels for all form fields', () => {
      render(<AssetForm value={EMPTY_PROFILE} onChange={mockOnChange} />);

      // Verify labels are associated with inputs via htmlFor/id
      expect(screen.getByLabelText(/asset name/i)).toHaveAttribute('id', 'assetName');
      expect(screen.getByLabelText(/asset type/i)).toHaveAttribute('id', 'assetType');
    });
  });
});
