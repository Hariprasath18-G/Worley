import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AssetSummaryBar from '@/components/AssetSummaryBar';
import { mockAssetProfile } from '../helpers/testUtils';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Pencil: (props: React.SVGProps<SVGSVGElement>) =>
    React.createElement('svg', { ...props, 'data-testid': 'pencil-icon' }),
}));

describe('AssetSummaryBar', () => {
  const mockOnEditAsset = jest.fn();

  beforeEach(() => {
    mockOnEditAsset.mockClear();
  });

  describe('rendering', () => {
    it('should display the asset name', () => {
      render(<AssetSummaryBar asset={mockAssetProfile} onEditAsset={mockOnEditAsset} />);
      expect(screen.getByText('Test Refinery Alpha')).toBeInTheDocument();
    });

    it('should display the asset type', () => {
      render(<AssetSummaryBar asset={mockAssetProfile} onEditAsset={mockOnEditAsset} />);
      expect(screen.getByText('Refinery')).toBeInTheDocument();
    });

    it('should display the location', () => {
      render(<AssetSummaryBar asset={mockAssetProfile} onEditAsset={mockOnEditAsset} />);
      expect(screen.getByText('UK North Sea')).toBeInTheDocument();
    });

    it('should display the year commissioned', () => {
      render(<AssetSummaryBar asset={mockAssetProfile} onEditAsset={mockOnEditAsset} />);
      expect(screen.getByText('1990')).toBeInTheDocument();
    });

    it('should display the capacity with unit', () => {
      render(<AssetSummaryBar asset={mockAssetProfile} onEditAsset={mockOnEditAsset} />);
      expect(screen.getByText('50,000 bpd')).toBeInTheDocument();
    });

    it('should display field labels', () => {
      render(<AssetSummaryBar asset={mockAssetProfile} onEditAsset={mockOnEditAsset} />);
      expect(screen.getByText('ASSET')).toBeInTheDocument();
      expect(screen.getByText('TYPE')).toBeInTheDocument();
      expect(screen.getByText('LOCATION')).toBeInTheDocument();
      expect(screen.getByText('COMMISSIONED')).toBeInTheDocument();
      expect(screen.getByText('CAPACITY')).toBeInTheDocument();
    });

    it('should display the Edit asset button', () => {
      render(<AssetSummaryBar asset={mockAssetProfile} onEditAsset={mockOnEditAsset} />);
      expect(screen.getByText('Edit asset')).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('should call onEditAsset when Edit asset is clicked', async () => {
      const user = userEvent.setup();
      render(<AssetSummaryBar asset={mockAssetProfile} onEditAsset={mockOnEditAsset} />);

      await user.click(screen.getByText('Edit asset'));
      expect(mockOnEditAsset).toHaveBeenCalledTimes(1);
    });
  });

  describe('accessibility', () => {
    it('should have an accessible edit button with aria-label', () => {
      render(<AssetSummaryBar asset={mockAssetProfile} onEditAsset={mockOnEditAsset} />);
      expect(screen.getByRole('button', { name: /edit asset/i })).toBeInTheDocument();
    });
  });
});
