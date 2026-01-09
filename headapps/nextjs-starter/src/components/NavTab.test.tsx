import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { mockCn } from 'src/test-utils';
import React from 'react';
import { Tabs } from 'src/core/ui/tabs';
import { NavTab } from './NavTab';

// Explicitly mock Sitecore JSS components used by NavTab
vi.mock('@sitecore-content-sdk/nextjs', () => ({
  Placeholder: vi.fn(({ name }: any) => <div data-testid="navtab-placeholder">{name}</div>),
  withDatasourceCheck: () => (Component: any) => Component,
}));

// Use the real TabsContent implementation (do not mock)

type Field<T> = { value: T };

type Fields = {
  id: string;
  NavTabTitle: Field<string>;
};

type ComponentParams = { [key: string]: string };
type ComponentRendering = { uid?: string; params: ComponentParams } & { componentName: string };

type NavTabProps = {
  params: ComponentParams;
  fields: Fields;
  rendering: ComponentRendering & { params: ComponentParams };
};

// Helper to render NavTab within Tabs context
const renderWithTabs = (props: NavTabProps) => {
  return render(
    <Tabs value={props.rendering.uid || ''} defaultValue={props.rendering.uid || ''}>
      <NavTab {...props} />
    </Tabs>
  );
};

describe('NavTab', () => {
  beforeEach(() => {
    mockCn();
    vi.clearAllMocks();
    cleanup();
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('renders with required props', () => {
    const props: NavTabProps = {
      params: { DynamicPlaceholderId: 'abc' },
      fields: { id: 'tab-1', NavTabTitle: { value: 'Tab Title' } },
      rendering: {
        uid: 'tab-uid',
        params: { DynamicPlaceholderId: 'abc' },
        componentName: 'NavTab',
      },
    };
    renderWithTabs(props);
    expect(screen.getByTestId('navtab-placeholder')).toHaveTextContent('navtabcontent-abc');
  });

  it('passes the correct value to TabsContent', () => {
    const props: NavTabProps = {
      params: { DynamicPlaceholderId: 'xyz' },
      fields: { id: 'tab-2', NavTabTitle: { value: 'Tab 2' } },
      rendering: {
        uid: 'unique-id',
        params: { DynamicPlaceholderId: 'xyz' },
        componentName: 'NavTab',
      },
    };
    renderWithTabs(props);
    expect(screen.getByTestId('navtab-placeholder')).toHaveTextContent('navtabcontent-xyz');
  });

  it('handles missing DynamicPlaceholderId gracefully', () => {
    const props: NavTabProps = {
      params: {},
      fields: { id: 'tab-3', NavTabTitle: { value: 'Tab 3' } },
      rendering: { uid: 'tab-3-uid', params: {}, componentName: 'NavTab' },
    };
    renderWithTabs(props);
    expect(screen.getByTestId('navtab-placeholder')).toHaveTextContent('navtabcontent-undefined');
  });

  it('handles missing uid (value="") gracefully', () => {
    const props: NavTabProps = {
      params: { DynamicPlaceholderId: 'no-uid' },
      fields: { id: 'tab-4', NavTabTitle: { value: 'Tab 4' } },
      rendering: { params: { DynamicPlaceholderId: 'no-uid' }, componentName: 'NavTab' },
    };
    renderWithTabs(props);
    expect(screen.getByTestId('navtab-placeholder')).toHaveTextContent('navtabcontent-no-uid');
  });

  it('handles missing fields gracefully', () => {
    const props = {
      params: { DynamicPlaceholderId: 'missing-fields' },
      fields: { id: 'tab-5', NavTabTitle: { value: '' } },
      rendering: {
        uid: 'tab-5-uid',
        params: { DynamicPlaceholderId: 'missing-fields' },
        componentName: 'NavTab',
      },
    };
    renderWithTabs(props as NavTabProps);
    expect(screen.getByTestId('navtab-placeholder')).toHaveTextContent(
      'navtabcontent-missing-fields'
    );
  });

  it('handles empty params gracefully', () => {
    const props: NavTabProps = {
      params: {},
      fields: { id: 'tab-6', NavTabTitle: { value: 'Tab 6' } },
      rendering: { uid: 'tab-6-uid', params: {}, componentName: 'NavTab' },
    };
    renderWithTabs(props);
    expect(screen.getByTestId('navtab-placeholder')).toHaveTextContent('navtabcontent-undefined');
  });

  it('passes rendering prop to Placeholder', () => {
    const props: NavTabProps = {
      params: { DynamicPlaceholderId: 'pass-rendering' },
      fields: { id: 'tab-7', NavTabTitle: { value: 'Tab 7' } },
      rendering: {
        uid: 'tab-7-uid',
        params: { DynamicPlaceholderId: 'pass-rendering' },
        componentName: 'NavTab',
      },
    };
    renderWithTabs(props);
    expect(screen.getByTestId('navtab-placeholder')).toBeInTheDocument();
  });

  it('renders with no props (edge case)', () => {
    renderWithTabs({
      params: {} as any,
      fields: { id: 'tab-8', NavTabTitle: { value: '' } } as any,
      rendering: { params: {}, componentName: 'NavTab' } as any,
    });
    expect(screen.getByTestId('navtab-placeholder')).toHaveTextContent('navtabcontent-undefined');
  });

  it('renders children inside TabsContent (interaction)', () => {
    const props: NavTabProps = {
      params: { DynamicPlaceholderId: 'child-test' },
      fields: { id: 'tab-9', NavTabTitle: { value: 'Tab 9' } },
      rendering: {
        uid: 'tab-9-uid',
        params: { DynamicPlaceholderId: 'child-test' },
        componentName: 'NavTab',
      },
    };
    renderWithTabs(props);
    expect(screen.getByTestId('navtab-placeholder')).toBeInTheDocument();
  });

  it('TabsContent is focusable and has correct class', () => {
    const props: NavTabProps = {
      params: { DynamicPlaceholderId: 'focusable' },
      fields: { id: 'tab-10', NavTabTitle: { value: 'Tab 10' } },
      rendering: {
        uid: 'tab-10-uid',
        params: { DynamicPlaceholderId: 'focusable' },
        componentName: 'NavTab',
      },
    };
    renderWithTabs(props);
    const placeholder = screen.getByTestId('navtab-placeholder');
    expect(placeholder.parentElement).toHaveClass(
      'ring-offset-background',
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring',
      'focus-visible:ring-offset-2'
    );
  });
});
