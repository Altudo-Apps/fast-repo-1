import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockCn } from 'src/test-utils';
import MegaNav from './MegaNav';
import * as SitecoreContentSdk from '@sitecore-content-sdk/nextjs';

// Global mocks
const pushMock = vi.fn();
const events = { on: vi.fn(), off: vi.fn() };

vi.mock('next/router', () => ({
  useRouter: () => ({ push: pushMock, events }),
}));

vi.mock('@sitecore-content-sdk/nextjs', () => ({
  Placeholder: vi.fn(({ name, rendering, children, ...rest }: any) => (
    <div
      data-testid="placeholder"
      data-name={name}
      data-rendering={JSON.stringify(rendering)}
      {...rest}
    >
      {children}
    </div>
  )),
  Text: vi.fn(({ field, className }: any) => (
    <span data-testid="text-component" className={className}>
      {field?.value}
    </span>
  )),
  withDatasourceCheck: () => (Component: any) => Component,
  useSitecore: vi.fn(() => ({
    page: {
      mode: {
        isEditing: false,
        name: 'normal',
        isPreview: false,
        isDesignLibrary: false,
        isNormal: true,
        designLibrary: undefined,
      },
    },
  })),
}));

vi.mock('lucide-react', () => ({
  Menu: () => <svg data-testid="icon-menu" />,
  ChevronLeft: () => <svg data-testid="icon-chevron-left" />,
  ChevronDown: (props: any) => <svg data-testid="icon-chevron-down" {...props} />,
  X: () => <svg data-testid="icon-x" />, // Added X icon for close buttons
}));

let localStorageStore: Record<string, string> = {};

beforeEach(() => {
  mockCn();
  localStorageStore = {};
  vi.stubGlobal('localStorage', {
    getItem: vi.fn((key: string) => localStorageStore[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      localStorageStore[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete localStorageStore[key];
    }),
    clear: vi.fn(() => {
      localStorageStore = {};
    }),
  });
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: query.includes('min-width'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
  pushMock.mockClear();
  events.on.mockClear();
  events.off.mockClear();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

const getMockMegaNavItem = (uid: string, title: string) => ({
  uid,
  fields: { MegaNavTitle: { value: title } },
  componentName: 'MegaNav',
});

describe('MegaNav', () => {
  const baseParams = { DynamicPlaceholderId: '123', styles: 'custom-style' };
  const baseFields = { id: 'meganav-1', MegaNavTitle: { value: 'Main Nav' } };
  const baseNavItems = [getMockMegaNavItem('item1', 'Nav 1'), getMockMegaNavItem('item2', 'Nav 2')];
  const baseRendering = {
    componentName: 'MegaNav',
    params: baseParams,
    placeholders: { 'meganav-123': baseNavItems },
  };

  it('renders with required props and menu items', () => {
    render(<MegaNav fields={baseFields} params={baseParams} rendering={baseRendering} />);
    expect(screen.getByText('Nav 1')).toBeInTheDocument();
    expect(screen.getByText('Nav 2')).toBeInTheDocument();
    expect(screen.getByTestId('icon-menu')).toBeInTheDocument();
  });

  it('renders with empty menu items', () => {
    const rendering = { ...baseRendering, placeholders: { 'meganav-123': [] } };
    render(<MegaNav fields={baseFields} params={baseParams} rendering={rendering} />);
    expect(screen.queryByText('Nav 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Nav 2')).not.toBeInTheDocument();
  });

  it('handles missing DynamicPlaceholderId gracefully', () => {
    const params = { styles: 'custom-style' };
    render(<MegaNav fields={baseFields} params={params as any} rendering={baseRendering} />);
    const placeholders = screen.getAllByTestId('placeholder');
    expect(placeholders.length).toBeGreaterThan(0);
    expect(placeholders[0]).toHaveAttribute('data-name', 'meganav-undefined');
  });

  it('handles missing rendering prop gracefully', () => {
    render(<MegaNav fields={baseFields} params={baseParams} rendering={undefined as any} />);
    expect(screen.getAllByTestId('placeholder').length).toBeGreaterThan(0);
  });

  it('handles missing fields gracefully', () => {
    render(<MegaNav fields={{} as any} params={baseParams} rendering={baseRendering} />);
    expect(screen.getAllByTestId('placeholder').length).toBeGreaterThan(0);
  });

  it('handles different prop combinations', () => {
    const params = { DynamicPlaceholderId: 'abc', styles: 'another-style' };
    const rendering = {
      ...baseRendering,
      params,
      placeholders: { 'meganav-abc': [getMockMegaNavItem('itemA', 'Nav A')] },
    };
    render(<MegaNav fields={baseFields} params={params} rendering={rendering} />);
    expect(screen.getByText('Nav A')).toBeInTheDocument();
  });

  it('opens and closes desktop submenu on trigger click', async () => {
    render(<MegaNav fields={baseFields} params={baseParams} rendering={baseRendering} />);
    await userEvent.click(screen.getByText('Nav 1'));
    let allPlaceholders = screen.getAllByTestId('placeholder');
    let submenuPlaceholder = allPlaceholders.find((el) => el.closest('.mega-menu-overlay'));
    expect(submenuPlaceholder).toBeInTheDocument();
    await userEvent.click(screen.getByText('Nav 1'));
    allPlaceholders = screen.getAllByTestId('placeholder');
    submenuPlaceholder = allPlaceholders.find((el) => el.closest('.mega-menu-overlay'));
    expect(submenuPlaceholder).toBeUndefined();
  });

  it('opens and closes mobile menu and submenu', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query.includes('max-width'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    render(<MegaNav fields={baseFields} params={baseParams} rendering={baseRendering} />);
    await userEvent.click(screen.getByTestId('icon-menu'));
    const mobileMenu = screen.getByRole('dialog', { hidden: true });
    const { getByText, queryAllByTestId } = within(mobileMenu);
    await userEvent.click(getByText('Nav 1'));
    const countWithSubmenu = queryAllByTestId('placeholder').length;
    expect(countWithSubmenu).toBeGreaterThan(0);
    await userEvent.click(screen.getByTestId('icon-chevron-left').closest('button')!);
    const countWithoutSubmenu = queryAllByTestId('placeholder').length;
    expect(countWithoutSubmenu).toBeLessThan(countWithSubmenu);
  });

  it('closes submenu on outside click', async () => {
    render(<MegaNav fields={baseFields} params={baseParams} rendering={baseRendering} />);
    await userEvent.click(screen.getByText('Nav 1'));
    let allPlaceholders = screen.getAllByTestId('placeholder');
    let submenuPlaceholder = allPlaceholders.find((el) => el.closest('.mega-menu-overlay'));
    expect(submenuPlaceholder).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    allPlaceholders = screen.getAllByTestId('placeholder');
    submenuPlaceholder = allPlaceholders.find((el) => el.closest('.mega-menu-overlay'));
    expect(submenuPlaceholder).toBeUndefined();
  });

  it('closes submenu on Escape key', async () => {
    render(<MegaNav fields={baseFields} params={baseParams} rendering={baseRendering} />);
    await userEvent.click(screen.getByText('Nav 1'));
    let allPlaceholders = screen.getAllByTestId('placeholder');
    let submenuPlaceholder = allPlaceholders.find((el) => el.closest('.mega-menu-overlay'));
    expect(submenuPlaceholder).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    allPlaceholders = screen.getAllByTestId('placeholder');
    submenuPlaceholder = allPlaceholders.find((el) => el.closest('.mega-menu-overlay'));
    expect(submenuPlaceholder).toBeUndefined();
  });

  it('closes all menus on route change', async () => {
    render(<MegaNav fields={baseFields} params={baseParams} rendering={baseRendering} />);
    await userEvent.click(screen.getByText('Nav 1'));
    let allPlaceholders = screen.getAllByTestId('placeholder');
    let submenuPlaceholder = allPlaceholders.find((el) => el.closest('.mega-menu-overlay'));
    expect(submenuPlaceholder).toBeInTheDocument();
    events.on.mock.calls[0][1]();
    await waitFor(() => {
      allPlaceholders = screen.getAllByTestId('placeholder');
      submenuPlaceholder = allPlaceholders.find((el) => el.closest('.mega-menu-overlay'));
      expect(submenuPlaceholder).toBeUndefined();
    });
  });

  it('sets and gets active menu item from localStorage', async () => {
    localStorageStore['active-menu-item'] = 'item2';
    render(<MegaNav fields={baseFields} params={baseParams} rendering={baseRendering} />);
    await userEvent.click(screen.getByText('Nav 2'));
    expect(localStorage.setItem).toHaveBeenLastCalledWith('active-menu-item', 'item2');
    await userEvent.click(screen.getByText('Nav 2'));
    expect(localStorage.removeItem).toHaveBeenLastCalledWith('active-menu-item');
  });

  it('renders in editing mode', () => {
    (SitecoreContentSdk.useSitecore as any).mockReturnValue({
      page: {
        mode: {
          isEditing: true,
          name: 'editing',
          isPreview: false,
          isDesignLibrary: false,
          isNormal: false,
          designLibrary: undefined,
        },
      },
    });
    render(<MegaNav fields={baseFields} params={baseParams} rendering={baseRendering} />);
    expect(screen.getAllByTestId('placeholder').length).toBeGreaterThan(0);
    (SitecoreContentSdk.useSitecore as any).mockReturnValue({
      page: {
        mode: {
          isEditing: false,
          name: 'normal',
          isPreview: false,
          isDesignLibrary: false,
          isNormal: true,
          designLibrary: undefined,
        },
      },
    }); // reset for other tests
  });

  it('passes correct props to Placeholder and Text', async () => {
    render(<MegaNav fields={baseFields} params={baseParams} rendering={baseRendering} />);
    // Find the button whose textContent includes 'Nav 1'
    const nav1Button = screen
      .getAllByRole('button')
      .find((btn) => btn.textContent?.includes('Nav 1'));
    expect(nav1Button).toBeTruthy();
    await userEvent.click(nav1Button!);
    // Placeholder receives correct rendering prop
    const placeholders = screen.getAllByTestId('placeholder');
    expect(placeholders.length).toBeGreaterThan(0);
    expect(placeholders[0]).toHaveAttribute('data-rendering', JSON.stringify(baseRendering));
    // Text receives correct field values
    expect(screen.getAllByTestId('text-component')[0]).toHaveTextContent('Nav 1');
  });

  it('handles edge case: no props', () => {
    render(<MegaNav fields={baseFields} params={baseParams} rendering={baseRendering} />);
    expect(screen.getAllByTestId('placeholder').length).toBeGreaterThan(0);
  });
});
