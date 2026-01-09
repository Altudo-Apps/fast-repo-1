import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockCn } from 'src/test-utils';
import type { ComponentParams, ComponentRendering } from '@sitecore-content-sdk/nextjs';

// Explicitly mock lucide-react icons
vi.mock('lucide-react', () => ({
  Sun: (props: any) => <svg data-testid="icon-sun" {...props} />,
  Moon: (props: any) => <svg data-testid="icon-moon" {...props} />,
}));

// Mock useTheme at the top level, before importing ThemeSelector
let themeValue: 'light' | 'dark' = 'light';
let toggleThemeMock: ((...args: any[]) => any) | undefined = vi.fn();
vi.mock('src/core/context/ThemeContext', () => ({
  useTheme: () => ({ theme: themeValue, toggleTheme: toggleThemeMock }),
}));

import * as ThemeSelector from './ThemeSelector';

describe('ThemeSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCn();
    themeValue = 'light';
    toggleThemeMock = vi.fn();
  });

  it('renders with required props and light theme', () => {
    themeValue = 'light';
    toggleThemeMock = vi.fn();
    const props = {
      rendering: { componentName: 'ThemeSelector', params: {} } as ComponentRendering & {
        params: ComponentParams;
      },
      params: {},
    };
    render(<ThemeSelector.Default {...props} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('icon-moon')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-sun')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('renders with dark theme', () => {
    themeValue = 'dark';
    toggleThemeMock = vi.fn();
    const props = {
      rendering: { componentName: 'ThemeSelector', params: {} } as ComponentRendering & {
        params: ComponentParams;
      },
      params: {},
    };
    render(<ThemeSelector.Default {...props} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('icon-sun')).toBeInTheDocument();
    expect(screen.queryByTestId('icon-moon')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to light mode');
  });

  it('calls toggleTheme on button click', async () => {
    themeValue = 'light';
    toggleThemeMock = vi.fn();
    const props = {
      rendering: { componentName: 'ThemeSelector', params: {} } as ComponentRendering & {
        params: ComponentParams;
      },
      params: {},
    };
    render(<ThemeSelector.Default {...props} />);
    await userEvent.click(screen.getByRole('button'));
    expect(toggleThemeMock).toHaveBeenCalled();
  });

  it('applies custom className if provided', () => {
    themeValue = 'dark';
    toggleThemeMock = vi.fn();
    const props = {
      rendering: { componentName: 'ThemeSelector', params: {} } as ComponentRendering & {
        params: ComponentParams;
      },
      params: {},
      className: 'custom-class',
    };
    render(<ThemeSelector.Default {...props} />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('handles missing optional className gracefully', () => {
    themeValue = 'light';
    toggleThemeMock = vi.fn();
    const props = {
      rendering: { componentName: 'ThemeSelector', params: {} } as ComponentRendering & {
        params: ComponentParams;
      },
      params: {},
    };
    render(<ThemeSelector.Default {...props} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles different prop combinations', () => {
    themeValue = 'dark';
    toggleThemeMock = vi.fn();
    const props = {
      rendering: {
        componentName: 'ThemeSelector',
        params: { foo: 'bar' },
      } as ComponentRendering & { params: ComponentParams },
      params: { foo: 'bar' },
      className: 'another-class',
    };
    render(<ThemeSelector.Default {...props} />);
    expect(screen.getByRole('button')).toHaveClass('another-class');
  });

  it('handles edge case: missing rendering and params', () => {
    themeValue = 'light';
    toggleThemeMock = vi.fn();
    // @ts-expect-error intentionally missing props
    render(<ThemeSelector.Default />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles edge case: toggleTheme is undefined', async () => {
    themeValue = 'light';
    toggleThemeMock = undefined;
    const props = {
      rendering: { componentName: 'ThemeSelector', params: {} } as ComponentRendering & {
        params: ComponentParams;
      },
      params: {},
    };
    render(<ThemeSelector.Default {...props} />);
    await userEvent.click(screen.getByRole('button'));
    // Should not throw
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
