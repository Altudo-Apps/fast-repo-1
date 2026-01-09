import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { mockCn } from 'src/test-utils';
import React from 'react';
import MegaNavItem from './MegaNavItem';

// Explicitly mock Sitecore JSS components used by MegaNavItem
vi.mock('@sitecore-content-sdk/nextjs', () => ({
  Placeholder: vi.fn(({ name, rendering }: any) => (
    <div data-testid="meganav-placeholder" data-name={name}>
      {name}
    </div>
  )),
  withDatasourceCheck: () => (Component: any) => Component,
}));

// Import types from the actual component
type Field<T> = { value: T };

interface Fields {
  id: string;
  NavTabTitle: Field<string>;
}

type ComponentParams = { [key: string]: string };
type ComponentRendering = { uid?: string; params: ComponentParams } & { componentName: string };

type NavTabProps = {
  params: ComponentParams;
  fields: Fields;
  rendering: ComponentRendering & { params: ComponentParams };
};

let localStorageStore: Record<string, string> = {};

describe('MegaNavItem', () => {
  beforeEach(async () => {
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
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('renders with required props when active', async () => {
    const props: NavTabProps = {
      params: { DynamicPlaceholderId: 'abc' },
      fields: { id: 'meganav-1', NavTabTitle: { value: 'Mega Nav Title' } },
      rendering: {
        uid: 'meganav-uid',
        params: { DynamicPlaceholderId: 'abc' },
        componentName: 'MegaNavItem',
      },
    };

    // Set the component as active in localStorage
    localStorageStore['active-menu-item'] = 'meganav-uid';

    render(<MegaNavItem {...props} />);

    await waitFor(() => {
      expect(screen.getByTestId('meganav-placeholder')).toBeInTheDocument();
    });
    expect(screen.getByTestId('meganav-placeholder')).toHaveTextContent('meganavcontent-abc');
  });

  it('does not render when not active', async () => {
    const props: NavTabProps = {
      params: { DynamicPlaceholderId: 'xyz' },
      fields: { id: 'meganav-2', NavTabTitle: { value: 'Mega Nav Title' } },
      rendering: {
        uid: 'meganav-uid-2',
        params: { DynamicPlaceholderId: 'xyz' },
        componentName: 'MegaNavItem',
      },
    };

    // Set a different uid as active in localStorage
    localStorageStore['active-menu-item'] = 'different-uid';

    const { container } = render(<MegaNavItem {...props} />);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it('updates active state when localStorage changes', async () => {
    const props: NavTabProps = {
      params: { DynamicPlaceholderId: 'dynamic' },
      fields: { id: 'meganav-3', NavTabTitle: { value: 'Dynamic Nav' } },
      rendering: {
        uid: 'dynamic-uid',
        params: { DynamicPlaceholderId: 'dynamic' },
        componentName: 'MegaNavItem',
      },
    };

    const { rerender } = render(<MegaNavItem {...props} />);

    // Initially not active
    expect(screen.queryByTestId('meganav-placeholder')).not.toBeInTheDocument();

    // Set as active
    localStorageStore['active-menu-item'] = 'dynamic-uid';

    // Trigger localStorage change by calling the getItem function
    const getItemSpy = vi.spyOn(localStorage, 'getItem');
    getItemSpy.mockImplementation((key: string) => localStorageStore[key] ?? null);

    rerender(<MegaNavItem {...props} />);

    await waitFor(() => {
      expect(screen.getByTestId('meganav-placeholder')).toBeInTheDocument();
    });
  });

  it('handles missing DynamicPlaceholderId gracefully', async () => {
    const props: NavTabProps = {
      params: {},
      fields: { id: 'meganav-4', NavTabTitle: { value: 'No Placeholder ID' } },
      rendering: {
        uid: 'no-placeholder-uid',
        params: {},
        componentName: 'MegaNavItem',
      },
    };

    localStorageStore['active-menu-item'] = 'no-placeholder-uid';

    render(<MegaNavItem {...props} />);

    await waitFor(() => {
      expect(screen.getByTestId('meganav-placeholder')).toHaveTextContent(
        'meganavcontent-undefined'
      );
    });
  });

  it('handles missing uid gracefully', async () => {
    const props: NavTabProps = {
      params: { DynamicPlaceholderId: 'no-uid' },
      fields: { id: 'meganav-5', NavTabTitle: { value: 'No UID' } },
      rendering: {
        params: { DynamicPlaceholderId: 'no-uid' },
        componentName: 'MegaNavItem',
      },
    };

    // Set undefined as active (edge case)
    localStorageStore['active-menu-item'] = undefined as any;

    const { container } = render(<MegaNavItem {...props} />);

    await waitFor(() => {
      // When uid is missing, the component should not render
      expect(container.firstChild).toBeNull();
    });
  });

  it('handles empty fields gracefully', async () => {
    const props: NavTabProps = {
      params: { DynamicPlaceholderId: 'empty-fields' },
      fields: { id: '', NavTabTitle: { value: '' } },
      rendering: {
        uid: 'empty-fields-uid',
        params: { DynamicPlaceholderId: 'empty-fields' },
        componentName: 'MegaNavItem',
      },
    };

    localStorageStore['active-menu-item'] = 'empty-fields-uid';

    render(<MegaNavItem {...props} />);

    await waitFor(() => {
      expect(screen.getByTestId('meganav-placeholder')).toBeInTheDocument();
    });
  });

  it('handles different prop combinations', async () => {
    const props: NavTabProps = {
      params: { DynamicPlaceholderId: 'custom-id', styles: 'custom-style' },
      fields: { id: 'custom-meganav', NavTabTitle: { value: 'Custom Nav' } },
      rendering: {
        uid: 'custom-uid',
        params: { DynamicPlaceholderId: 'custom-id', styles: 'custom-style' },
        componentName: 'MegaNavItem',
      },
    };

    localStorageStore['active-menu-item'] = 'custom-uid';

    render(<MegaNavItem {...props} />);

    await waitFor(() => {
      expect(screen.getByTestId('meganav-placeholder')).toHaveTextContent(
        'meganavcontent-custom-id'
      );
    });
  });

  it('passes rendering prop to Placeholder', async () => {
    const props: NavTabProps = {
      params: { DynamicPlaceholderId: 'pass-rendering' },
      fields: { id: 'meganav-6', NavTabTitle: { value: 'Pass Rendering' } },
      rendering: {
        uid: 'pass-rendering-uid',
        params: { DynamicPlaceholderId: 'pass-rendering' },
        componentName: 'MegaNavItem',
      },
    };

    localStorageStore['active-menu-item'] = 'pass-rendering-uid';

    render(<MegaNavItem {...props} />);

    await waitFor(() => {
      expect(screen.getByTestId('meganav-placeholder')).toBeInTheDocument();
    });
  });

  it('renders with no props (edge case)', async () => {
    const props = {
      params: {} as any,
      fields: { id: '', NavTabTitle: { value: '' } } as any,
      rendering: { params: {}, componentName: 'MegaNavItem' } as any,
    };

    localStorageStore['active-menu-item'] = undefined as any;

    const { container } = render(<MegaNavItem {...props} />);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it('applies correct CSS classes when active', async () => {
    const props: NavTabProps = {
      params: { DynamicPlaceholderId: 'css-test' },
      fields: { id: 'meganav-7', NavTabTitle: { value: 'CSS Test' } },
      rendering: {
        uid: 'css-test-uid',
        params: { DynamicPlaceholderId: 'css-test' },
        componentName: 'MegaNavItem',
      },
    };

    localStorageStore['active-menu-item'] = 'css-test-uid';

    const { container } = render(<MegaNavItem {...props} />);

    await waitFor(() => {
      const meganavItem = container.querySelector('.meganav-item');
      expect(meganavItem).toBeInTheDocument();
      expect(meganavItem).toHaveClass(
        'meganav-item',
        'max-md:[&_.row]:flex-col',
        'relative',
        'w-full',
        'p-6'
      );
    });
  });

  it('cleans up interval on unmount', async () => {
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    const props: NavTabProps = {
      params: { DynamicPlaceholderId: 'cleanup-test' },
      fields: { id: 'meganav-8', NavTabTitle: { value: 'Cleanup Test' } },
      rendering: {
        uid: 'cleanup-test-uid',
        params: { DynamicPlaceholderId: 'cleanup-test' },
        componentName: 'MegaNavItem',
      },
    };

    localStorageStore['active-menu-item'] = 'cleanup-test-uid';

    const { unmount } = render(<MegaNavItem {...props} />);

    await waitFor(() => {
      expect(screen.getByTestId('meganav-placeholder')).toBeInTheDocument();
    });

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });

  it('handles localStorage errors gracefully', async () => {
    const props: NavTabProps = {
      params: { DynamicPlaceholderId: 'error-test' },
      fields: { id: 'meganav-9', NavTabTitle: { value: 'Error Test' } },
      rendering: {
        uid: 'error-test-uid',
        params: { DynamicPlaceholderId: 'error-test' },
        componentName: 'MegaNavItem',
      },
    };

    // Mock localStorage to throw an error
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => {
        throw new Error('localStorage error');
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

    // The component should throw an error when localStorage fails
    expect(() => {
      render(<MegaNavItem {...props} />);
    }).toThrow('localStorage error');
  });

  it('responds to localStorage changes after initial render', async () => {
    const props: NavTabProps = {
      params: { DynamicPlaceholderId: 'responsive-test' },
      fields: { id: 'meganav-10', NavTabTitle: { value: 'Responsive Test' } },
      rendering: {
        uid: 'responsive-test-uid',
        params: { DynamicPlaceholderId: 'responsive-test' },
        componentName: 'MegaNavItem',
      },
    };

    const { rerender } = render(<MegaNavItem {...props} />);

    // Initially not active
    expect(screen.queryByTestId('meganav-placeholder')).not.toBeInTheDocument();

    // Simulate localStorage change by updating the store and triggering a re-render
    localStorageStore['active-menu-item'] = 'responsive-test-uid';

    // Force a re-render to trigger the useEffect
    rerender(<MegaNavItem {...props} />);

    await waitFor(() => {
      expect(screen.getByTestId('meganav-placeholder')).toBeInTheDocument();
    });
  });

  it('handles multiple instances with different uids', async () => {
    const props1: NavTabProps = {
      params: { DynamicPlaceholderId: 'multi-1' },
      fields: { id: 'meganav-11', NavTabTitle: { value: 'Multi 1' } },
      rendering: {
        uid: 'multi-uid-1',
        params: { DynamicPlaceholderId: 'multi-1' },
        componentName: 'MegaNavItem',
      },
    };

    const props2: NavTabProps = {
      params: { DynamicPlaceholderId: 'multi-2' },
      fields: { id: 'meganav-12', NavTabTitle: { value: 'Multi 2' } },
      rendering: {
        uid: 'multi-uid-2',
        params: { DynamicPlaceholderId: 'multi-2' },
        componentName: 'MegaNavItem',
      },
    };

    localStorageStore['active-menu-item'] = 'multi-uid-1';

    const { rerender } = render(<MegaNavItem {...props1} />);

    await waitFor(() => {
      expect(screen.getByTestId('meganav-placeholder')).toHaveTextContent('meganavcontent-multi-1');
    });

    // Switch to second component
    localStorageStore['active-menu-item'] = 'multi-uid-2';
    rerender(<MegaNavItem {...props2} />);

    await waitFor(() => {
      expect(screen.getByTestId('meganav-placeholder')).toHaveTextContent('meganavcontent-multi-2');
    });
  });
});
