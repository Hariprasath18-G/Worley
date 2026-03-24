import React from 'react';
import { render, screen } from '@testing-library/react';
import DecisionFlowDiagram from '@/components/DecisionFlowDiagram';

describe('DecisionFlowDiagram', () => {
  it('should render the section with accessible role and label', () => {
    render(<DecisionFlowDiagram />);
    expect(screen.getByRole('img', { name: /decision flow diagram/i })).toBeInTheDocument();
  });

  it('should render the heading "Transition Decision Framework"', () => {
    render(<DecisionFlowDiagram />);
    expect(screen.getByText('Transition Decision Framework')).toBeInTheDocument();
  });

  it('should contain SVG element', () => {
    const { container } = render(<DecisionFlowDiagram />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should show all pathway labels in the SVG', () => {
    render(<DecisionFlowDiagram />);
    expect(screen.getByText('Optimize + CCS')).toBeInTheDocument();
    expect(screen.getByText('Repurpose')).toBeInTheDocument();
    expect(screen.getByText('Green Hydrogen')).toBeInTheDocument();
    expect(screen.getByText('Biofuels')).toBeInTheDocument();
    expect(screen.getByText('Full Decommission')).toBeInTheDocument();
  });

  it('should display Stranded Capital Risk Window', () => {
    render(<DecisionFlowDiagram />);
    expect(screen.getByText('Stranded')).toBeInTheDocument();
    expect(screen.getByText('Capital')).toBeInTheDocument();
    expect(screen.getByText('Risk Window')).toBeInTheDocument();
  });

  it('should show Ageing Asset as the starting point', () => {
    render(<DecisionFlowDiagram />);
    expect(screen.getByText('Asset')).toBeInTheDocument();
  });
});
