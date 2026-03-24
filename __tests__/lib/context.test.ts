import { renderHook } from '@testing-library/react';
import { useAppContext, AppContext } from '@/lib/context';
import React from 'react';

describe('useAppContext', () => {
  it('should throw an error when used outside of AppProvider', () => {
    // Suppress expected error output
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAppContext());
    }).toThrow('useAppContext must be used within AppProvider');

    spy.mockRestore();
  });

  it('should return context value when used within AppProvider', () => {
    const mockContextValue = {
      assetProfile: null,
      analysisResult: null,
      isAnalyzing: false,
      isHydrated: true,
      analysisError: null,
      setAssetProfile: jest.fn(),
      setAnalysisResult: jest.fn(),
      setIsAnalyzing: jest.fn(),
      setAnalysisError: jest.fn(),
      clearAll: jest.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) =>
      React.createElement(AppContext.Provider, { value: mockContextValue }, children);

    const { result } = renderHook(() => useAppContext(), { wrapper });

    expect(result.current).toBe(mockContextValue);
    expect(result.current.assetProfile).toBeNull();
    expect(result.current.isAnalyzing).toBe(false);
  });
});

describe('AppContext', () => {
  it('should be defined as a React context', () => {
    expect(AppContext).toBeDefined();
    expect(AppContext.Provider).toBeDefined();
  });
});
