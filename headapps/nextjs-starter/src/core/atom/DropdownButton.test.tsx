import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import DropdownButton from './DropdownButton';

// Mock lucide-react
vi.mock('lucide-react', () => ({
  ChevronDown: ({ className }: { className: string }) => (
    <span data-testid="chevron-icon" className={className}>
      ▼
    </span>
  ),
}));

describe('DropdownButton', () => {
  it('renders with title', () => {
    render(<DropdownButton title="Select Language" />);
    expect(screen.getByText('Select Language')).toBeDefined();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<DropdownButton title="Select" onClick={handleClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with icon', () => {
    const icon = <span data-testid="custom-icon">🌐</span>;
    render(<DropdownButton title="Select" icon={icon} />);
    expect(screen.getByTestId('custom-icon')).toBeDefined();
  });

  it('shows chevron icon', () => {
    render(<DropdownButton title="Select" />);
    expect(screen.getByTestId('chevron-icon')).toBeDefined();
  });

  it('rotates chevron when isOpen is true', () => {
    render(<DropdownButton title="Select" isOpen={true} />);
    const chevron = screen.getByTestId('chevron-icon');
    expect(chevron.className).toContain('rotate-180');
  });

  it('does not rotate chevron when isOpen is false', () => {
    render(<DropdownButton title="Select" isOpen={false} />);
    const chevron = screen.getByTestId('chevron-icon');
    expect(chevron.className).not.toContain('rotate-180');
  });

  it('disables button when disabled prop is true', () => {
    render(<DropdownButton title="Select" disabled={true} />);
    const button = screen.getByRole('button');
    expect(button.hasAttribute('disabled')).toBe(true);
  });

  it('sets aria-controls attribute', () => {
    render(<DropdownButton title="Select" ariaControls="dropdown-menu" />);
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-controls')).toBe('dropdown-menu');
  });

  it('sets aria-expanded attribute', () => {
    render(<DropdownButton title="Select" isOpen={true} />);
    const button = screen.getByRole('button');
    expect(button.getAttribute('aria-expanded')).toBe('true');
  });

  it('applies custom className', () => {
    render(<DropdownButton title="Select" className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button.className).toContain('custom-class');
  });
});
