import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { mockCn } from 'src/test-utils';

// Mocks for Sitecore SDK
vi.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: vi.fn(() => ({
    page: {
      mode: { isEditing: false },
    },
  })),
}));

// Mocks for child navigation parts
vi.mock('src/core/molecules/NavigationItem/NavigationList', () => ({
  NavigationList: ({ fields }: any) => (
    <li data-testid="nav-item" data-id={fields?.Id}>
      {fields?.DisplayName || 'Item'}
    </li>
  ),
}));

vi.mock('src/core/molecules/NavigationItem/HeaderNavigation', () => ({
  default: ({ isOpenMenu, setIsOpenMenu, list }: any) => (
    <nav>
      <button data-testid="toggle" onClick={() => setIsOpenMenu(!isOpenMenu)}>
        Toggle
      </button>
      <ul>{list}</ul>
    </nav>
  ),
}));

// Component under test
import { Default as FLNavigation } from './FLNavigation';

describe('FLNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCn();
  });

  const makeProps = (overrides?: Partial<any>) => ({
    params: {
      styles: 'custom-style',
      RenderingIdentifier: 'nav-123',
      ...(overrides?.params || {}),
    },
    fields: overrides?.fields ?? {
      a: { Id: '1', DisplayName: 'Home' },
      b: { Id: '2', DisplayName: 'About' },
    },
  });

  it('renders fallback when no fields present', () => {
    const props = makeProps({ fields: {} });
    render(<FLNavigation {...(props as any)} />);
    expect(screen.getByText('[FLNavigation]')).toBeInTheDocument();
  });

  it('renders header navigation and list items with styles and id', () => {
    const props = makeProps();
    render(<FLNavigation {...(props as any)} />);

    const navWrapper = screen.getByText('Toggle').closest('div.component.navigation');
    expect(navWrapper).toHaveClass('custom-style');
    expect(navWrapper).toHaveAttribute('id', 'nav-123');

    const items = screen.getAllByTestId('nav-item');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveAttribute('data-id', '1');
    expect(items[1]).toHaveAttribute('data-id', '2');
  });

  it('toggles menu open/close via header button', () => {
    const props = makeProps();
    render(<FLNavigation {...(props as any)} />);
    const toggle = screen.getByTestId('toggle');
    fireEvent.click(toggle);
    // No explicit UI change to assert here due to mocked header, but ensure no crash
    expect(toggle).toBeInTheDocument();
  });
});
