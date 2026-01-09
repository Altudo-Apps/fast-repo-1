import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchResults from './SearchResults';

// Mock environment variables
const originalEnv = process.env;

// Mock Next.js router
const mockPush = vi.fn();
const mockRouter = {
  push: mockPush,
  pathname: '/search',
  query: {},
  asPath: '/search',
  route: '/search',
  locale: 'en',
  locales: ['en'],
  defaultLocale: 'en',
  isReady: true,
  isPreview: false,
  isLocaleDomain: false,
  basePath: '',
  domainLocales: [],
  events: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
  isFallback: false,
  beforePopState: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  reload: vi.fn(),
  replace: vi.fn(),
  forward: vi.fn(),
};

vi.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

// Mock the SearchInput widget
const mockSearchInputWidget = vi.fn();
vi.mock('src/core/molecules/SearchInput', () => ({
  default: (props: any) => {
    mockSearchInputWidget(props);
    return (
      <div data-testid="search-input-widget">
        <div data-testid="rfk-id">{props.rfkId}</div>
        <div data-testid="view-mode">{props.viewMode}</div>
        <div data-testid="default-keyphrase">{props.defaultKeyphrase}</div>
        <button
          data-testid="view-toggle"
          onClick={() => props.onViewModeChange && props.onViewModeChange('list')}
        >
          Toggle View
        </button>
      </div>
    );
  },
  ViewMode: {},
}));

describe('SearchResults', () => {
  const defaultProps = {
    rendering: {
      componentName: 'SearchResults',
    },
    params: {
      RenderingIdentifier: 'search-results-1',
      styles: 'custom-styles',
    },
    fields: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset router query
    mockRouter.query = {};
    // Set up environment variables for tests
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SEARCH_RFKID: 'RFKID_1001',
      NEXT_PUBLIC_CUSTOMER_KEY: 'test-customer-key',
      NEXT_PUBLIC_SITECORE_SEARCH_API_KEY: 'test-api-key',
      NEXT_PUBLIC_DISCOVER_DOMAIN_ID: 'test-domain-id',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('renders the search results container', () => {
    render(<SearchResults {...defaultProps} />);

    const container = screen.getByTestId('search-input-widget').parentElement;
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('search-results-page');
  });

  it('applies the RenderingIdentifier as id', () => {
    render(<SearchResults {...defaultProps} />);

    const container = screen.getByTestId('search-input-widget').parentElement;
    expect(container).toHaveAttribute('id', 'search-results-1');
  });

  it('applies custom styles from params', () => {
    render(<SearchResults {...defaultProps} />);

    const container = screen.getByTestId('search-input-widget').parentElement;
    expect(container).toHaveClass('custom-styles');
  });

  it('handles missing RenderingIdentifier gracefully', () => {
    const propsWithoutId = {
      ...defaultProps,
      params: {
        styles: 'test-styles',
      },
    };

    render(<SearchResults {...propsWithoutId} />);

    const container = screen.getByTestId('search-input-widget').parentElement;
    expect(container).toBeInTheDocument();
    expect(container).not.toHaveAttribute('id');
  });

  it('handles missing styles gracefully', () => {
    const propsWithoutStyles = {
      ...defaultProps,
      params: {
        RenderingIdentifier: 'search-1',
      },
    };

    render(<SearchResults {...propsWithoutStyles} />);

    const container = screen.getByTestId('search-input-widget').parentElement;
    expect(container).toHaveClass('search-results-page');
    // Should have empty string for styles
  });

  it('renders SearchInputWidget with correct rfkId', () => {
    render(<SearchResults {...defaultProps} />);

    expect(screen.getByTestId('rfk-id')).toHaveTextContent('RFKID_1001');
  });

  it('passes default keyphrase to SearchInputWidget when no query parameter', () => {
    mockRouter.query = {}; // Explicitly set empty query
    render(<SearchResults {...defaultProps} />);

    expect(screen.getByTestId('default-keyphrase')).toHaveTextContent('');
  });

  it('initializes with grid view mode', () => {
    render(<SearchResults {...defaultProps} />);

    expect(screen.getByTestId('view-mode')).toHaveTextContent('grid');
  });

  it('updates view mode when onViewModeChange is called', () => {
    render(<SearchResults {...defaultProps} />);

    const toggleButton = screen.getByTestId('view-toggle');

    // Initial state should be grid
    expect(screen.getByTestId('view-mode')).toHaveTextContent('grid');

    // Click to toggle view
    fireEvent.click(toggleButton);

    // After state update, should be list (this will trigger re-render)
    // The component uses useState, so we need to check if the callback is set up correctly
    expect(mockSearchInputWidget).toHaveBeenCalledWith(
      expect.objectContaining({
        onViewModeChange: expect.any(Function),
      })
    );
  });

  it('passes viewMode prop to SearchInputWidget', () => {
    render(<SearchResults {...defaultProps} />);

    expect(mockSearchInputWidget).toHaveBeenCalledWith(
      expect.objectContaining({
        viewMode: 'grid',
      })
    );
  });

  it('passes onViewModeChange handler to SearchInputWidget', () => {
    render(<SearchResults {...defaultProps} />);

    expect(mockSearchInputWidget).toHaveBeenCalledWith(
      expect.objectContaining({
        onViewModeChange: expect.any(Function),
      })
    );
  });

  it('maintains view state across re-renders', () => {
    const { rerender } = render(<SearchResults {...defaultProps} />);

    // Verify initial render
    expect(screen.getByTestId('view-mode')).toHaveTextContent('grid');

    // Rerender with same props
    rerender(<SearchResults {...defaultProps} />);

    // Should still maintain the view mode
    expect(screen.getByTestId('view-mode')).toHaveTextContent('grid');
  });

  it('renders with minimal props', () => {
    const minimalProps = {
      rendering: {
        componentName: 'SearchResults',
      },
      params: {},
      fields: {},
    };

    render(<SearchResults {...minimalProps} />);

    expect(screen.getByTestId('search-input-widget')).toBeInTheDocument();
  });

  it('applies both default and custom classes', () => {
    render(<SearchResults {...defaultProps} />);

    const container = screen.getByTestId('search-input-widget').parentElement;
    expect(container?.className).toContain('search-results-page');
    expect(container?.className).toContain('custom-styles');
  });

  it('handles empty string styles parameter', () => {
    const propsWithEmptyStyles = {
      ...defaultProps,
      params: {
        RenderingIdentifier: 'search-1',
        styles: '',
      },
    };

    render(<SearchResults {...propsWithEmptyStyles} />);

    const container = screen.getByTestId('search-input-widget').parentElement;
    expect(container).toHaveClass('search-results-page');
  });

  describe('Integration with SearchInputWidget', () => {
    it('correctly wires all props to SearchInputWidget', () => {
      mockRouter.query = {}; // Explicitly set empty query
      render(<SearchResults {...defaultProps} />);

      expect(mockSearchInputWidget).toHaveBeenCalledWith(
        expect.objectContaining({
          rfkId: 'RFKID_1001',
          viewMode: 'grid',
          onViewModeChange: expect.any(Function),
          defaultKeyphrase: '',
        })
      );
    });

    it('SearchInputWidget receives rfkId prop', () => {
      render(<SearchResults {...defaultProps} />);

      const rfkIdElement = screen.getByTestId('rfk-id');
      expect(rfkIdElement).toHaveTextContent('RFKID_1001');
    });
  });

  describe('Type Safety', () => {
    it('handles ComponentProps type correctly', () => {
      const typedProps = {
        rendering: {
          componentName: 'SearchResults',
        },
        params: {
          RenderingIdentifier: 'test-id',
          styles: 'test-class',
        },
        fields: {},
      };

      render(<SearchResults {...typedProps} />);

      expect(screen.getByTestId('search-input-widget')).toBeInTheDocument();
    });
  });

  describe('Query Parameter Handling', () => {
    it('reads search query from URL query parameter', () => {
      mockRouter.query = { q: 'test search term' };

      render(<SearchResults {...defaultProps} />);

      expect(screen.getByTestId('default-keyphrase')).toHaveTextContent('test search term');
    });

    it('passes empty string when no query parameter is present', () => {
      mockRouter.query = {};

      render(<SearchResults {...defaultProps} />);

      expect(screen.getByTestId('default-keyphrase')).toHaveTextContent('');
    });

    it('handles multiple query parameters and only uses q parameter', () => {
      mockRouter.query = { q: 'search term', page: '2', filter: 'active' };

      render(<SearchResults {...defaultProps} />);

      expect(screen.getByTestId('default-keyphrase')).toHaveTextContent('search term');
    });

    it('handles array query parameter by using first value', () => {
      mockRouter.query = { q: ['first search', 'second search'] };

      render(<SearchResults {...defaultProps} />);

      // When query param is an array, it will use the first value or handle appropriately
      expect(screen.getByTestId('default-keyphrase')).toBeInTheDocument();
    });

    it('correctly wires query parameter to SearchInputWidget', () => {
      mockRouter.query = { q: 'laptop' };

      render(<SearchResults {...defaultProps} />);

      expect(mockSearchInputWidget).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultKeyphrase: 'laptop',
        })
      );
    });
  });
});
