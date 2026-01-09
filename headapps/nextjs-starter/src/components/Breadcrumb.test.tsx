import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import BreadCrumb from './Breadcrumb';
import type { Breadcrumb as BreadcrumbType } from 'src/types/Breadcrumb.types';
import type { CommonComponentProps } from 'src/types/common.types';
import React from 'react';

// Mock the Sitecore JSS hook
vi.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: vi.fn(),
}));

const mockUseSitecore = useSitecore as ReturnType<typeof vi.fn>;

// Mock lucide-react icons used by Breadcrumb components
vi.mock('lucide-react', async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    ChevronRight: (props: any) => <svg {...props} data-testid="chevron-right" />,
    MoreHorizontal: (props: any) => <svg {...props} data-testid="more-horizontal" />,
  };
});

// Type for mock sitecore context
type MockSitecoreContext = {
  page: {
    layout: {
      sitecore: {
        context: {
          breadCrumbsContext?: BreadcrumbType[];
        };
        route?: {
          templateName?: string;
        };
      };
    };
    mode: {
      isEditing: boolean;
    };
  };
};

describe('BreadCrumb', () => {
  const defaultProps: CommonComponentProps = {
    rendering: {
      componentName: 'Breadcrumb',
      params: {
        styles: 'test-styles',
      },
    } as CommonComponentProps['rendering'],
    params: {
      styles: 'test-styles',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render breadcrumbs when data is available', () => {
    const mockBreadcrumbs: BreadcrumbType[] = [
      { PageTitle: 'Home', Url: '/', HideInBreadcrumb: false },
      { PageTitle: 'Products', Url: '/products', HideInBreadcrumb: false },
      { PageTitle: 'Electronics', Url: '/products/electronics', HideInBreadcrumb: false },
    ];

    mockUseSitecore.mockReturnValue({
      page: {
        layout: {
          sitecore: {
            context: {
              breadCrumbsContext: mockBreadcrumbs,
            },
          },
        },
        mode: {
          isEditing: false,
        },
      },
    } as MockSitecoreContext);

    const { container } = render(<BreadCrumb {...defaultProps} />);

    // Check for nav with aria-label
    const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();
    // Check for list
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    // Check for list items (breadcrumb items only)
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3); // Only breadcrumb items
    // Check for separators (li with aria-hidden)
    const separators = container.querySelectorAll('li[role="presentation"]');
    expect(separators).toHaveLength(2); // Only separators
    // Check for links (all except last)
    const links = screen
      .getAllByRole('link', { hidden: true })
      .filter((el) => !el.hasAttribute('aria-current'));
    expect(links).toHaveLength(2); // Only first two are anchor links
    // Check for current page (last item)
    const currentPage = screen.getByText('Electronics');
    expect(currentPage).toHaveAttribute('aria-current', 'page');
  });

  it('should render fake breadcrumbs in page editing mode for Partial Design template', () => {
    mockUseSitecore.mockReturnValue({
      page: {
        layout: {
          sitecore: {
            context: {
              breadCrumbsContext: [],
            },
            route: {
              templateName: 'Partial Design',
            },
          },
        },
        mode: {
          isEditing: true,
        },
      },
    } as any);

    const { container } = render(<BreadCrumb {...defaultProps} />);

    const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(2); // Only breadcrumb items
    const separators = container.querySelectorAll('li[role="presentation"]');
    expect(separators.length).toBe(1); // Only separators
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Fake')).toBeInTheDocument();
  });

  it('should render fake breadcrumbs in Design Library mode', () => {
    mockUseSitecore.mockReturnValue({
      page: {
        layout: {
          sitecore: {
            context: {
              breadCrumbsContext: [],
            },
          },
        },
        mode: {
          isDesignLibrary: true,
        },
      },
    } as any);

    const { container } = render(<BreadCrumb {...defaultProps} />);

    const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(2); // Only breadcrumb items
    const separators = container.querySelectorAll('li[role="presentation"]');
    expect(separators.length).toBe(1); // Only separators
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Fake')).toBeInTheDocument();
  });

  it('should filter out hidden breadcrumbs', () => {
    const mockBreadcrumbs: BreadcrumbType[] = [
      { PageTitle: 'Home', Url: '/', HideInBreadcrumb: false },
      { PageTitle: 'Hidden Page', Url: '/hidden', HideInBreadcrumb: true },
      { PageTitle: 'Visible Page', Url: '/visible', HideInBreadcrumb: false },
      { PageTitle: '', Url: '/empty-title', HideInBreadcrumb: false }, // Should be filtered out
    ];

    mockUseSitecore.mockReturnValue({
      page: {
        layout: {
          sitecore: {
            context: {
              breadCrumbsContext: mockBreadcrumbs,
            },
          },
        },
        mode: {
          isEditing: false,
        },
      },
    } as any);

    const { container } = render(<BreadCrumb {...defaultProps} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Visible Page')).toBeInTheDocument();
    expect(screen.queryByText('Hidden Page')).not.toBeInTheDocument();
    // Only 2 visible items, so 2 items + 1 separator
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(2); // Only breadcrumb items
    const separators = container.querySelectorAll('li[role="presentation"]');
    expect(separators.length).toBe(1); // Only separators
  });

  it('should render empty fragment when no visible breadcrumbs', () => {
    const mockBreadcrumbs: BreadcrumbType[] = [
      { PageTitle: 'Hidden Page', Url: '/hidden', HideInBreadcrumb: true },
      { PageTitle: '', Url: '/empty-title', HideInBreadcrumb: false },
    ];

    mockUseSitecore.mockReturnValue({
      page: {
        layout: {
          sitecore: {
            context: {
              breadCrumbsContext: mockBreadcrumbs,
            },
          },
        },
        mode: {
          isEditing: false,
        },
      },
    } as any);

    const { container } = render(<BreadCrumb {...defaultProps} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render empty fragment when breadcrumbs array is empty', () => {
    mockUseSitecore.mockReturnValue({
      page: {
        layout: {
          sitecore: {
            context: {
              breadCrumbsContext: [],
            },
          },
        },
        mode: {
          isEditing: false,
        },
      },
    } as any);

    const { container } = render(<BreadCrumb {...defaultProps} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render empty fragment when breadcrumbs context is undefined', () => {
    mockUseSitecore.mockReturnValue({
      page: {
        layout: {
          sitecore: {
            context: {
              breadCrumbsContext: undefined,
            },
          },
        },
        mode: {
          isEditing: false,
        },
      },
    } as any);

    const { container } = render(<BreadCrumb {...defaultProps} />);
    expect(container.firstChild).toBeNull();
  });

  it('should apply custom styles from props', () => {
    const mockBreadcrumbs: BreadcrumbType[] = [
      { PageTitle: 'Home', Url: '/', HideInBreadcrumb: false },
    ];

    mockUseSitecore.mockReturnValue({
      page: {
        layout: {
          sitecore: {
            context: {
              breadCrumbsContext: mockBreadcrumbs,
            },
          },
        },
        mode: {
          isEditing: false,
        },
      },
    } as any);

    render(<BreadCrumb {...defaultProps} />);

    // The outermost div should have the custom class
    const outerDiv = screen.getByRole('navigation', { name: /breadcrumb/i }).parentElement;
    expect(outerDiv).toHaveClass('test-styles');
  });

  it('should render last item as page (not link)', () => {
    const mockBreadcrumbs: BreadcrumbType[] = [
      { PageTitle: 'Home', Url: '/', HideInBreadcrumb: false },
      { PageTitle: 'Current Page', Url: '/current', HideInBreadcrumb: false },
    ];

    mockUseSitecore.mockReturnValue({
      page: {
        layout: {
          sitecore: {
            context: {
              breadCrumbsContext: mockBreadcrumbs,
            },
          },
        },
        mode: {
          isEditing: false,
        },
      },
    } as any);

    render(<BreadCrumb {...defaultProps} />);

    // First is a link
    const links = screen.getAllByRole('link', { hidden: true });
    expect(links[0]).toHaveTextContent('Home');
    // Last is a span with aria-current
    const currentPage = screen.getByText('Current Page');
    expect(currentPage).toHaveAttribute('aria-current', 'page');
  });

  it('should convert URLs to lowercase', () => {
    const mockBreadcrumbs: BreadcrumbType[] = [
      { PageTitle: 'Home', Url: '/HOME', HideInBreadcrumb: false },
      { PageTitle: 'Products', Url: '/PRODUCTS', HideInBreadcrumb: false },
    ];

    mockUseSitecore.mockReturnValue({
      page: {
        layout: {
          sitecore: {
            context: {
              breadCrumbsContext: mockBreadcrumbs,
            },
          },
        },
        mode: {
          isEditing: false,
        },
      },
    } as any);

    const { container } = render(<BreadCrumb {...defaultProps} />);

    const anchorLinks = Array.from(container.querySelectorAll('a[href]'));
    expect(anchorLinks).toHaveLength(1);
    expect(anchorLinks[0]).toHaveAttribute('href', '/home');

    const currentPage = screen.getByText('Products');
    expect(currentPage).toHaveAttribute('aria-current', 'page');
  });

  it('should use fallback href when URL is empty', () => {
    const mockBreadcrumbs: BreadcrumbType[] = [
      { PageTitle: 'Home', Url: '', HideInBreadcrumb: false },
      { PageTitle: 'Another', Url: '', HideInBreadcrumb: false },
    ];

    mockUseSitecore.mockReturnValue({
      page: {
        layout: {
          sitecore: {
            context: {
              breadCrumbsContext: mockBreadcrumbs,
            },
          },
        },
        mode: {
          isEditing: false,
        },
      },
    } as any);

    render(<BreadCrumb {...defaultProps} />);

    const links = screen.getAllByRole('link', { hidden: true });
    expect(links[0]).toHaveAttribute('href', '#');
  });

  it('should generate unique keys for breadcrumb items', () => {
    const mockBreadcrumbs: BreadcrumbType[] = [
      { PageTitle: 'Home', Url: '/', HideInBreadcrumb: false },
      { PageTitle: 'Products', Url: '/products', HideInBreadcrumb: false },
    ];

    mockUseSitecore.mockReturnValue({
      page: {
        layout: {
          sitecore: {
            context: {
              breadCrumbsContext: mockBreadcrumbs,
            },
          },
        },
        mode: {
          isEditing: false,
        },
      },
    } as any);

    render(<BreadCrumb {...defaultProps} />);

    // The component should render without React key warnings
    const nav = screen.getByRole('navigation', { name: /breadcrumb/i });
    expect(nav).toBeInTheDocument();
  });

  it('should handle single breadcrumb item without separator', () => {
    const mockBreadcrumbs: BreadcrumbType[] = [
      { PageTitle: 'Home', Url: '/', HideInBreadcrumb: false },
    ];

    mockUseSitecore.mockReturnValue({
      page: {
        layout: {
          sitecore: {
            context: {
              breadCrumbsContext: mockBreadcrumbs,
            },
          },
        },
        mode: {
          isEditing: false,
        },
      },
    } as any);

    const { container } = render(<BreadCrumb {...defaultProps} />);

    // Only one item, so no separator
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBe(1);
    expect(screen.getByText('Home')).toHaveAttribute('aria-current', 'page');
    // No separator (no element with role presentation)
    expect(container.querySelector('li[role="presentation"]')).not.toBeInTheDocument();
  });
});
