import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavTabs } from './NavTabs';
import type {
  ComponentParams,
  ComponentRendering,
  ComponentFields,
  Field,
} from '@sitecore-content-sdk/nextjs';

// Mock utils module
vi.mock('src/core/lib/utils', () => ({
  cn: vi.fn((...args: unknown[]) => args.filter(Boolean).join(' ')),
}));

// Mock Sitecore JSS components
vi.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: vi.fn(({ field, className }: { field: Field<string>; className?: string }) => (
    <span data-testid="navtab-title" className={className}>
      {field?.value}
    </span>
  )),
  Placeholder: vi.fn(({ name, rendering }: { name: string; rendering: any }) => (
    <div
      data-testid="navtab-placeholder"
      data-name={name}
      data-rendering={JSON.stringify(rendering)}
    />
  )),
  withDatasourceCheck: () => (Component: any) => Component,
}));

// No mock for Tabs, TabsList, TabsTrigger: use the real components as per requirement #9

interface Fields {
  id: string;
}

type NavTabsProps = {
  params: { [key: string]: string };
  fields: Fields;
  rendering: ComponentRendering & { params: ComponentParams };
};

const createMockTab = (uid: string, title: string): ComponentRendering<ComponentFields> => ({
  uid,
  fields: { NavTabTitle: { value: title } as Field<string> },
  componentName: 'NavTab',
  placeholders: {},
});

const createMockProps = (
  dynamicPlaceholderId: string = 'test-123',
  tabs: ComponentRendering<ComponentFields>[] = [],
  styles: string = ''
): NavTabsProps => ({
  params: { DynamicPlaceholderId: dynamicPlaceholderId, styles },
  fields: { id: 'navtabs-1' },
  rendering: {
    componentName: 'NavTabs',
    params: { DynamicPlaceholderId: dynamicPlaceholderId },
    placeholders: {
      'navtab-{*}': tabs,
    },
  },
});

describe('NavTabs', () => {
  beforeEach(() => {
    // Mock localStorage
    let store: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    });

    // Mock window to ensure it's available in tests
    Object.defineProperty(window, 'window', {
      value: window,
      writable: true,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with required props and multiple tabs', async () => {
      const tabs = [
        createMockTab('tab1', 'First Tab'),
        createMockTab('tab2', 'Second Tab'),
        createMockTab('tab3', 'Third Tab'),
      ];
      const props = createMockProps('test-123', tabs, 'custom-style');

      render(<NavTabs {...props} />);

      // Wait for component to mount (isMounted becomes true)
      await waitFor(() => {
        expect(screen.getAllByRole('tab')).toHaveLength(3);
      });

      // Check tab triggers are rendered
      const tabTriggers = screen.getAllByRole('tab');
      expect(tabTriggers).toHaveLength(3);

      // Check tab titles are displayed
      expect(screen.getByText('First Tab')).toBeInTheDocument();
      expect(screen.getByText('Second Tab')).toBeInTheDocument();
      expect(screen.getByText('Third Tab')).toBeInTheDocument();

      // Check placeholder is rendered with correct name
      const placeholder = screen.getByTestId('navtab-placeholder');
      expect(placeholder).toHaveAttribute('data-name', 'navtab-test-123');

      // Check wrapper has custom styles
      const wrapper = tabTriggers[0].closest('div.border-2');
      expect(wrapper).toHaveClass('custom-style');
    });

    it('renders with single tab', async () => {
      const tabs = [createMockTab('tab1', 'Single Tab')];
      const props = createMockProps('single-tab', tabs);

      render(<NavTabs {...props} />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getAllByRole('tab')).toHaveLength(1);
      });

      const tabTriggers = screen.getAllByRole('tab');
      expect(tabTriggers).toHaveLength(1);
      expect(screen.getByText('Single Tab')).toBeInTheDocument();
    });

    it('renders with no tabs', async () => {
      const props = createMockProps('empty-tabs', []);

      render(<NavTabs {...props} />);

      // Wait a bit to ensure React has finished rendering
      await waitFor(() => {
        // Component returns empty fragment when no tabs, so nothing should render
        const tabTriggers = screen.queryAllByRole('tab');
        expect(tabTriggers).toHaveLength(0);
      });

      // Placeholder should not be rendered when no tabs
      const placeholder = screen.queryByTestId('navtab-placeholder');
      expect(placeholder).not.toBeInTheDocument();
    });
  });

  describe('Optional Field Handling', () => {
    it('handles missing DynamicPlaceholderId', async () => {
      const tabs = [createMockTab('tab1', 'Test Tab')];
      const props = createMockProps(undefined, tabs);
      delete props.params.DynamicPlaceholderId;

      render(<NavTabs {...props} />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getByTestId('navtab-placeholder')).toBeInTheDocument();
      });

      const placeholder = screen.getByTestId('navtab-placeholder');
      expect(placeholder).toHaveAttribute('data-name', 'navtab-undefined');
    });

    it('handles missing styles parameter', async () => {
      const tabs = [createMockTab('tab1', 'Test Tab')];
      const props = createMockProps('test-123', tabs);
      delete props.params.styles;

      render(<NavTabs {...props} />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getAllByRole('tab')).toHaveLength(1);
      });

      const tabTriggers = screen.getAllByRole('tab');
      const wrapper = tabTriggers[0].closest('div.border-2');
      expect(wrapper).toHaveClass('border-2', 'bg-background', 'border-muted', 'rounded-sm');
    });

    it('handles missing placeholders in rendering', async () => {
      const props = createMockProps('test-123', []);
      delete props.rendering.placeholders;

      render(<NavTabs {...props} />);

      // Component returns empty fragment when no tabs
      const tabTriggers = screen.queryAllByRole('tab');
      expect(tabTriggers).toHaveLength(0);
    });

    it('handles missing navtab-{*} placeholder', async () => {
      const props = createMockProps('test-123', []);
      props.rendering.placeholders = {};

      render(<NavTabs {...props} />);

      // Component returns empty fragment when no tabs
      const tabTriggers = screen.queryAllByRole('tab');
      expect(tabTriggers).toHaveLength(0);
    });
  });

  describe('Edge Cases and Error Conditions', () => {
    it('handles null tab items', async () => {
      const props = createMockProps('test-123', []);
      props.rendering.placeholders = {
        'navtab-{*}': [null, createMockTab('tab1', 'Valid Tab'), null] as any,
      };

      render(<NavTabs {...props} />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getAllByRole('tab')).toHaveLength(1);
      });

      // Only valid tabs should render
      const tabTriggers = screen.getAllByRole('tab');
      expect(tabTriggers).toHaveLength(1);
      expect(screen.getByText('Valid Tab')).toBeInTheDocument();
    });

    it('handles tabs without uid', async () => {
      const tabWithoutUid = {
        ...createMockTab('', 'Tab Without UID'),
        uid: undefined,
      };
      const props = createMockProps('test-123', [tabWithoutUid]);

      render(<NavTabs {...props} />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getAllByRole('tab')).toHaveLength(1);
      });

      const tabTriggers = screen.getAllByRole('tab');
      expect(tabTriggers).toHaveLength(1);
      // When uid is undefined, the component uses empty string as value
      expect(tabTriggers[0].getAttribute('value') ?? '').toBe('');
    });

    it('handles tabs without NavTabTitle field', async () => {
      const tabWithoutTitle = {
        ...createMockTab('tab1', ''),
        fields: {},
      };
      const props = createMockProps('test-123', [tabWithoutTitle]);

      render(<NavTabs {...props} />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getAllByRole('tab')).toHaveLength(1);
      });

      const tabTriggers = screen.getAllByRole('tab');
      expect(tabTriggers).toHaveLength(1);
      expect(screen.getByTestId('navtab-title')).toHaveTextContent('');
    });

    it('handles malformed tab structure', async () => {
      const malformedTab = {
        componentName: 'NavTab',
        uid: 'tab1',
        fields: null,
        placeholders: {},
      };
      const props = createMockProps('test-123', [malformedTab as any]);

      render(<NavTabs {...props} />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getAllByRole('tab')).toHaveLength(1);
      });

      const tabTriggers = screen.getAllByRole('tab');
      expect(tabTriggers).toHaveLength(1);
    });
  });

  describe('State Management and localStorage', () => {
    it('initializes with default tab when no localStorage value exists', async () => {
      const tabs = [createMockTab('tab1', 'First Tab'), createMockTab('tab2', 'Second Tab')];
      const props = createMockProps('test-123', tabs);

      render(<NavTabs {...props} />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getAllByRole('tab')).toHaveLength(2);
      });

      // The component uses '0' as default value, but the actual tab values are UIDs
      // Since '0' doesn't match any tab UID, no tab will be selected initially
      const tabTriggers = screen.getAllByRole('tab');
      await waitFor(() => {
        expect(tabTriggers[0]).toHaveAttribute('aria-selected', 'false');
        expect(tabTriggers[1]).toHaveAttribute('aria-selected', 'false');
      });
    });

    it('initializes with stored tab from localStorage', async () => {
      const tabs = [createMockTab('tab1', 'First Tab'), createMockTab('tab2', 'Second Tab')];
      const props = createMockProps('test-123', tabs);

      // Mock localStorage to return a stored tab
      (localStorage.getItem as any).mockImplementation((key: string) =>
        key === 'active-tab' ? 'tab2' : null
      );

      render(<NavTabs {...props} />);

      // Wait for component to mount and localStorage to be read
      await waitFor(() => {
        const tabTriggers = screen.getAllByRole('tab');
        expect(tabTriggers[1]).toHaveAttribute('aria-selected', 'true');
      });

      // Second tab should be selected
      const tabTriggers = screen.getAllByRole('tab');
      expect(tabTriggers[0]).toHaveAttribute('aria-selected', 'false');
      expect(tabTriggers[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('sets localStorage value when no active-tab exists and tabs are present', async () => {
      const tabs = [createMockTab('tab1', 'First Tab')];
      const props = createMockProps('test-123', tabs);

      render(<NavTabs {...props} />);

      // Wait for component to mount and localStorage to be set
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('active-tab', '0');
      });
    });

    it('does not set localStorage when active-tab already exists', async () => {
      const tabs = [createMockTab('tab1', 'First Tab')];
      const props = createMockProps('test-123', tabs);

      // Mock localStorage to return an existing value
      (localStorage.getItem as any).mockImplementation((key: string) =>
        key === 'active-tab' ? 'tab1' : null
      );

      render(<NavTabs {...props} />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getAllByRole('tab')).toHaveLength(1);
      });

      // Should not call setItem for active-tab when value already exists
      // The component only sets if storedValue is falsy
      expect(localStorage.setItem).not.toHaveBeenCalledWith('active-tab', '0');
    });
  });

  describe('User Interactions', () => {
    it('handles tab selection and updates localStorage', async () => {
      const user = userEvent.setup();
      const tabs = [
        createMockTab('tab1', 'First Tab'),
        createMockTab('tab2', 'Second Tab'),
        createMockTab('tab3', 'Third Tab'),
      ];
      const props = createMockProps('test-123', tabs);

      render(<NavTabs {...props} />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getAllByRole('tab')).toHaveLength(3);
      });

      const tabTriggers = screen.getAllByRole('tab');

      // Click on second tab
      await user.click(tabTriggers[1]);

      // Check that localStorage was updated
      expect(localStorage.setItem).toHaveBeenCalledWith('active-tab', 'tab2');

      // Check that second tab is now selected
      await waitFor(() => {
        expect(tabTriggers[1]).toHaveAttribute('aria-selected', 'true');
      });
      expect(tabTriggers[0]).toHaveAttribute('aria-selected', 'false');
      expect(tabTriggers[2]).toHaveAttribute('aria-selected', 'false');
    });

    it('handles multiple tab selections', async () => {
      const user = userEvent.setup();
      const tabs = [
        createMockTab('tab1', 'First Tab'),
        createMockTab('tab2', 'Second Tab'),
        createMockTab('tab3', 'Third Tab'),
      ];
      const props = createMockProps('test-123', tabs);

      render(<NavTabs {...props} />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getAllByRole('tab')).toHaveLength(3);
      });

      const tabTriggers = screen.getAllByRole('tab');

      // Click on third tab
      await user.click(tabTriggers[2]);
      expect(localStorage.setItem).toHaveBeenCalledWith('active-tab', 'tab3');

      // Click on first tab
      await user.click(tabTriggers[0]);
      expect(localStorage.setItem).toHaveBeenCalledWith('active-tab', 'tab1');

      // Verify final state
      await waitFor(() => {
        expect(tabTriggers[0]).toHaveAttribute('aria-selected', 'true');
      });
      expect(tabTriggers[1]).toHaveAttribute('aria-selected', 'false');
      expect(tabTriggers[2]).toHaveAttribute('aria-selected', 'false');
    });

    it('maintains selection state across re-renders', async () => {
      const user = userEvent.setup();
      const tabs = [createMockTab('tab1', 'First Tab'), createMockTab('tab2', 'Second Tab')];
      const props = createMockProps('test-123', tabs);

      const { rerender } = render(<NavTabs {...props} />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getAllByRole('tab')).toHaveLength(2);
      });

      const tabTriggers = screen.getAllByRole('tab');

      // Select second tab
      await user.click(tabTriggers[1]);

      // Re-render component
      rerender(<NavTabs {...props} />);

      // Wait for component to mount again
      await waitFor(() => {
        const newTabTriggers = screen.getAllByRole('tab');
        expect(newTabTriggers[1]).toHaveAttribute('aria-selected', 'true');
      });
    });
  });

  describe('Component Interactions and Prop Passing', () => {
    it('passes correct props to Text component', async () => {
      const tabs = [createMockTab('tab1', 'Test Title')];
      const props = createMockProps('test-123', tabs);

      render(<NavTabs {...props} />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getByTestId('navtab-title')).toBeInTheDocument();
      });

      const textComponent = screen.getByTestId('navtab-title');
      expect(textComponent).toHaveTextContent('Test Title');
      expect(textComponent).toHaveClass('font-bold');
    });

    it('passes correct props to Placeholder component', async () => {
      const tabs = [createMockTab('tab1', 'Test Tab')];
      const props = createMockProps('test-123', tabs);

      render(<NavTabs {...props} />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getByTestId('navtab-placeholder')).toBeInTheDocument();
      });

      const placeholder = screen.getByTestId('navtab-placeholder');
      expect(placeholder).toHaveAttribute('data-name', 'navtab-test-123');

      // Check that rendering prop is passed correctly
      const renderingData = JSON.parse(placeholder.getAttribute('data-rendering') || '{}');
      expect(renderingData).toEqual(props.rendering);
    });

    it('applies correct CSS classes to tab triggers', async () => {
      const tabs = [createMockTab('tab1', 'Test Tab')];
      const props = createMockProps('test-123', tabs);

      render(<NavTabs {...props} />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getByRole('tab')).toBeInTheDocument();
      });

      const tabTrigger = screen.getByRole('tab');
      expect(tabTrigger).toHaveClass(
        'flex-1',
        'data-[state=active]:bg-background',
        'data-[state=active]:rounded-sm',
        'data-[state=active]:text-foreground',
        'data-[state=inactive]:bg-muted',
        'data-[state=inactive]:text-muted-foreground',
        'rounded-sm',
        'border-none'
      );
    });

    it('applies correct CSS classes to wrapper elements', async () => {
      const tabs = [createMockTab('tab1', 'Test Tab')];
      const props = createMockProps('test-123', tabs);

      render(<NavTabs {...props} />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getByRole('tab')).toBeInTheDocument();
      });

      const wrapper = screen.getByRole('tab').closest('div.border-2');
      expect(wrapper).toHaveClass('border-2', 'bg-background', 'border-muted', 'rounded-sm');

      const tabsList = screen.getByRole('tablist');
      expect(tabsList).toHaveClass('flex', 'w-full', 'bg-muted', 'py-2');

      // The content area div should have the correct classes
      const contentArea = screen.getByTestId('navtab-placeholder').parentElement;
      expect(contentArea).toHaveClass('rounded-b-md', 'border-muted', 'p-2');
    });
  });

  describe('Different Prop Combinations', () => {
    it('handles empty params object', async () => {
      const tabs = [createMockTab('tab1', 'Test Tab')];
      const props = createMockProps('test-123', tabs);
      props.params = {};

      render(<NavTabs {...props} />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getAllByRole('tab')).toHaveLength(1);
      });

      const tabTriggers = screen.getAllByRole('tab');
      expect(tabTriggers).toHaveLength(1);
    });

    it('handles params with only styles', async () => {
      const tabs = [createMockTab('tab1', 'Test Tab')];
      const props = createMockProps('test-123', tabs);
      props.params = { styles: 'my-custom-style' };

      render(<NavTabs {...props} />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getByRole('tab')).toBeInTheDocument();
      });

      const wrapper = screen.getByRole('tab').closest('div.border-2');
      expect(wrapper).toHaveClass('my-custom-style');
    });

    it('handles params with only DynamicPlaceholderId', async () => {
      const tabs = [createMockTab('tab1', 'Test Tab')];
      const props = createMockProps('test-123', tabs);
      props.params = { DynamicPlaceholderId: 'custom-id' };

      render(<NavTabs {...props} />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getByTestId('navtab-placeholder')).toBeInTheDocument();
      });

      const placeholder = screen.getByTestId('navtab-placeholder');
      expect(placeholder).toHaveAttribute('data-name', 'navtab-custom-id');
    });

    it('handles large number of tabs', async () => {
      const tabs = Array.from({ length: 10 }, (_, i) =>
        createMockTab(`tab${i + 1}`, `Tab ${i + 1}`)
      );
      const props = createMockProps('test-123', tabs);

      render(<NavTabs {...props} />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getAllByRole('tab')).toHaveLength(10);
      });

      const tabTriggers = screen.getAllByRole('tab');
      expect(tabTriggers).toHaveLength(10);

      // Check that all tab titles are rendered
      for (let i = 1; i <= 10; i++) {
        expect(screen.getByText(`Tab ${i}`)).toBeInTheDocument();
      }
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes for tabs', async () => {
      const tabs = [createMockTab('tab1', 'First Tab'), createMockTab('tab2', 'Second Tab')];
      const props = createMockProps('test-123', tabs);

      render(<NavTabs {...props} />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getAllByRole('tab')).toHaveLength(2);
      });

      const tabTriggers = screen.getAllByRole('tab');
      const tabsList = screen.getByRole('tablist');

      // Check tablist has proper role
      expect(tabsList).toBeInTheDocument();

      // Check tabs have proper roles and states
      expect(tabTriggers[0]).toHaveAttribute('role', 'tab');
      expect(tabTriggers[1]).toHaveAttribute('role', 'tab');

      // Since default value '0' doesn't match any tab UID, no tab is selected initially
      // But after localStorage is read, it will be set to '0' which doesn't match, so still false
      await waitFor(() => {
        expect(tabTriggers[0]).toHaveAttribute('aria-selected', 'false');
        expect(tabTriggers[1]).toHaveAttribute('aria-selected', 'false');
      });
    });

    it('updates ARIA attributes on tab selection', async () => {
      const user = userEvent.setup();
      const tabs = [createMockTab('tab1', 'First Tab'), createMockTab('tab2', 'Second Tab')];
      const props = createMockProps('test-123', tabs);

      render(<NavTabs {...props} />);

      // Wait for component to mount
      await waitFor(() => {
        expect(screen.getAllByRole('tab')).toHaveLength(2);
      });

      const tabTriggers = screen.getAllByRole('tab');

      // Initially no tab is selected (default value '0' doesn't match any tab UID)
      await waitFor(() => {
        expect(tabTriggers[0]).toHaveAttribute('aria-selected', 'false');
        expect(tabTriggers[1]).toHaveAttribute('aria-selected', 'false');
      });

      // Click second tab
      await user.click(tabTriggers[1]);

      // Check ARIA attributes are updated
      await waitFor(() => {
        expect(tabTriggers[1]).toHaveAttribute('aria-selected', 'true');
      });
      expect(tabTriggers[0]).toHaveAttribute('aria-selected', 'false');
    });
  });
});
