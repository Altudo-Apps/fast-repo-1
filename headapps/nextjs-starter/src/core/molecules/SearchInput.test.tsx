import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @sitecore-search/react FIRST
vi.mock('@sitecore-search/react', () => ({
  useSearchResults: vi.fn(),
  widget: vi.fn((component) => component),
  WidgetDataType: {
    SEARCH_RESULTS: 'SEARCH_RESULTS',
  },
  PageController: {
    getContext: vi.fn(() => ({
      setLocaleLanguage: vi.fn(),
      setLocaleCountry: vi.fn(),
    })),
  },
}));

// Import after mocking
import { useSearchResults } from '@sitecore-search/react';

// Get the mocked function
const mockUseSearchResults = vi.mocked(useSearchResults);

// Mock all the atom components - MUST BE BEFORE IMPORTS
vi.mock('../atom/ArticleHorizontalCard', () => ({
  default: ({ article }: any) => (
    <div data-testid={`article-horizontal-${article.id}`}>{article.title || article.name}</div>
  ),
}));

vi.mock('../atom/ArticleCard', () => ({
  default: ({ article }: any) => (
    <div data-testid={`article-card-${article.id}`}>{article.title || article.name}</div>
  ),
}));

vi.mock('../atom/CardViewSwitcher', () => ({
  default: ({ value, onChange }: any) => (
    <div data-testid="card-view-switcher">
      <button onClick={() => onChange('grid')}>Grid</button>
      <button onClick={() => onChange('list')}>List</button>
      <span data-testid="current-view">{value}</span>
    </div>
  ),
}));

vi.mock('../atom/Filter', () => ({
  default: () => <div data-testid="filter">Filter</div>,
}));

vi.mock('../atom/QueryResultsSummary', () => ({
  default: ({ currentPage, itemsPerPage, totalItems }: any) => (
    <div data-testid="query-results-summary">
      {currentPage} - {itemsPerPage} - {totalItems}
    </div>
  ),
}));

vi.mock('../atom/SearchFacets', () => ({
  default: ({ facets }: any) => <div data-testid="search-facets">Facets: {facets.length}</div>,
}));

vi.mock('../atom/SearchPagination', () => ({
  default: ({ currentPage, totalPages }: any) => (
    <div data-testid="search-pagination">
      Page {currentPage} of {totalPages}
    </div>
  ),
}));

vi.mock('../atom/SortOrder', () => ({
  default: ({ options, selected }: any) => (
    <div data-testid="sort-order">
      Sort: {selected} ({options.length} options)
    </div>
  ),
}));

vi.mock('../atom/Spinner', () => ({
  default: ({ loading }: any) => (loading ? <div data-testid="spinner">Loading...</div> : null),
}));

vi.mock('../ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

// NOW import React and other dependencies
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchResultsWithInputComponent } from './SearchInput';

describe('SearchResultsWithInputComponent', () => {
  const mockArticles = [
    {
      id: '1',
      title: 'Article 1',
      name: 'Article Name 1',
      description: 'Description 1',
      url: '/article-1',
      image_url: '/image1.jpg',
      source_id: 'source-1',
    },
    {
      id: '2',
      title: 'Article 2',
      name: 'Article Name 2',
      description: 'Description 2',
      url: '/article-2',
      image_url: '/image2.jpg',
      source_id: 'source-2',
    },
  ];

  const mockFacets = [
    { name: 'category', values: ['Tech', 'Science'] },
    { name: 'author', values: ['John Doe', 'Jane Smith'] },
  ];

  const mockSortChoices = [
    { name: 'featured_desc', label: 'Featured' },
    { name: 'date_desc', label: 'Newest' },
  ];

  const defaultMockReturn = {
    widgetRef: { current: null },
    actions: {
      onItemClick: vi.fn(),
      onKeyphraseChange: vi.fn(),
      onPageNumberChange: vi.fn(),
      onClearFilters: vi.fn(),
      onResultsPerPageChange: vi.fn(),
      onSortChange: vi.fn(),
      onFacetClick: vi.fn(),
      onFilterClick: vi.fn(),
      onSortResultsChange: vi.fn(),
    },
    state: {
      sortType: 'featured_desc',
      page: 1,
      itemsPerPage: 24,
      keyphrase: 'innovation',
      selectedFacets: [],
    },
    queryResult: {
      isLoading: false,
      isFetching: false,
      data: {
        total_item: 50,
        sort: { choices: mockSortChoices },
        facet: mockFacets,
        content: mockArticles,
        rfk_id: 'test-rfk-id',
        type: 'SEARCH_RESULTS',
        entity: 'content',
        limit: 24,
        offset: 0,
        question: '',
        spell_corrected_query: '',
      },
      error: null,
      isError: false,
      isLoadingError: false,
      isRefetchError: false,
      status: 'success' as const,
    },
    rfkId: 'test-rfk-id',
    options: {},
    dispatch: vi.fn(),
    query: vi.fn(),
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearchResults.mockReturnValue(defaultMockReturn);
  });

  describe('Loading States', () => {
    it('renders loading spinner when isLoading is true', () => {
      mockUseSearchResults.mockReturnValue({
        ...defaultMockReturn,
        queryResult: {
          ...defaultMockReturn.queryResult,
          isLoading: true,
        },
      });

      render(<SearchResultsWithInputComponent />);

      expect(screen.getByTestId('spinner')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders fetching overlay when isFetching is true', () => {
      mockUseSearchResults.mockReturnValue({
        ...defaultMockReturn,
        queryResult: {
          ...defaultMockReturn.queryResult,
          isFetching: true,
        },
      });

      render(<SearchResultsWithInputComponent />);

      // The spinner should appear in the fetching overlay
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });

  describe('Search Input', () => {
    it('renders search input with default keyphrase', () => {
      mockUseSearchResults.mockReturnValue({
        ...defaultMockReturn,
        state: {
          ...defaultMockReturn.state,
          keyphrase: 'test query',
        },
      });

      render(<SearchResultsWithInputComponent defaultKeyphrase="test query" />);

      const input = screen.getByPlaceholderText('Search FastLane');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('test query');
    });

    it('renders search button', () => {
      render(<SearchResultsWithInputComponent />);

      const button = screen.getByRole('button', { name: /search/i });
      expect(button).toBeInTheDocument();
    });

    it('triggers search on button click', async () => {
      const mockOnKeyphraseChange = vi.fn();
      const mockOnPageNumberChange = vi.fn();

      mockUseSearchResults.mockReturnValue({
        ...defaultMockReturn,
        actions: {
          ...defaultMockReturn.actions,
          onKeyphraseChange: mockOnKeyphraseChange,
          onPageNumberChange: mockOnPageNumberChange,
        },
      });

      render(<SearchResultsWithInputComponent />);

      const input = screen.getByPlaceholderText('Search FastLane');
      const button = screen.getByRole('button', { name: /search/i });

      fireEvent.change(input, { target: { value: 'new search term' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockOnPageNumberChange).toHaveBeenCalledWith({ page: 1 });
        expect(mockOnKeyphraseChange).toHaveBeenCalledWith({ keyphrase: 'new search term' });
      });
    });

    it('triggers search on Enter key press', async () => {
      const mockOnKeyphraseChange = vi.fn();

      mockUseSearchResults.mockReturnValue({
        ...defaultMockReturn,
        actions: {
          ...defaultMockReturn.actions,
          onKeyphraseChange: mockOnKeyphraseChange,
        },
      });

      render(<SearchResultsWithInputComponent />);

      const input = screen.getByPlaceholderText('Search FastLane');

      fireEvent.change(input, { target: { value: 'keyboard search' } });
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      await waitFor(() => {
        expect(mockOnKeyphraseChange).toHaveBeenCalledWith({ keyphrase: 'keyboard search' });
      });
    });

    it('uses empty keyphrase when input is empty', async () => {
      const mockOnKeyphraseChange = vi.fn();

      mockUseSearchResults.mockReturnValue({
        ...defaultMockReturn,
        actions: {
          ...defaultMockReturn.actions,
          onKeyphraseChange: mockOnKeyphraseChange,
        },
      });

      render(<SearchResultsWithInputComponent />);

      const input = screen.getByPlaceholderText('Search FastLane') as HTMLInputElement;
      const button = screen.getByRole('button', { name: /search/i });

      // Clear the input (it's an uncontrolled input with defaultValue)
      input.value = '';
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.click(button);

      // The component reads from inputRef.current?.value and when empty, it passes empty string
      await waitFor(() => {
        expect(mockOnKeyphraseChange).toHaveBeenCalledWith({ keyphrase: '' });
      });
    });
  });

  describe('Search Results Display', () => {
    it('renders search results header with keyphrase', () => {
      render(<SearchResultsWithInputComponent />);

      expect(screen.getByText(/Search results for/i)).toBeInTheDocument();
      expect(screen.getByText('innovation')).toBeInTheDocument();
    });

    it('renders filter components when results exist', () => {
      render(<SearchResultsWithInputComponent />);

      // Component renders both mobile and desktop versions
      expect(screen.getAllByTestId('filter').length).toBeGreaterThan(0);
      expect(screen.getAllByTestId('search-facets').length).toBeGreaterThan(0);
    });

    it('renders query results summary', () => {
      render(<SearchResultsWithInputComponent />);

      expect(screen.getByTestId('query-results-summary')).toBeInTheDocument();
    });

    it('renders sort order dropdown', () => {
      render(<SearchResultsWithInputComponent />);

      expect(screen.getByTestId('sort-order')).toBeInTheDocument();
    });

    it('renders pagination', () => {
      render(<SearchResultsWithInputComponent />);

      expect(screen.getByTestId('search-pagination')).toBeInTheDocument();
      expect(screen.getByText(/Page 1 of 3/i)).toBeInTheDocument(); // 50 items / 24 per page ≈ 3 pages
    });

    it('displays "0 Results" when no articles found', () => {
      mockUseSearchResults.mockReturnValue({
        ...defaultMockReturn,
        queryResult: {
          ...defaultMockReturn.queryResult,
          data: {
            ...defaultMockReturn.queryResult.data,
            total_item: 0,
            content: [],
          },
        },
      });

      render(<SearchResultsWithInputComponent />);

      expect(screen.getByText('0 Results')).toBeInTheDocument();
    });
  });

  describe('Grid View Mode', () => {
    it('renders articles in grid view by default', () => {
      render(<SearchResultsWithInputComponent viewMode="grid" />);

      expect(screen.getByTestId('article-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('article-card-2')).toBeInTheDocument();
    });

    it('displays view mode switcher in grid mode', () => {
      const onViewModeChange = vi.fn();
      render(
        <SearchResultsWithInputComponent viewMode="grid" onViewModeChange={onViewModeChange} />
      );

      expect(screen.getByTestId('card-view-switcher')).toBeInTheDocument();
      expect(screen.getByTestId('current-view')).toHaveTextContent('grid');
    });
  });

  describe('List View Mode', () => {
    it('renders articles in list view', () => {
      render(<SearchResultsWithInputComponent viewMode="list" />);

      expect(screen.getByTestId('article-horizontal-1')).toBeInTheDocument();
      expect(screen.getByTestId('article-horizontal-2')).toBeInTheDocument();
    });

    it('displays view mode switcher in list mode', () => {
      const onViewModeChange = vi.fn();
      render(
        <SearchResultsWithInputComponent viewMode="list" onViewModeChange={onViewModeChange} />
      );

      expect(screen.getByTestId('card-view-switcher')).toBeInTheDocument();
      expect(screen.getByTestId('current-view')).toHaveTextContent('list');
    });

    it('calls onViewModeChange when switching views', async () => {
      const onViewModeChange = vi.fn();
      render(
        <SearchResultsWithInputComponent viewMode="grid" onViewModeChange={onViewModeChange} />
      );

      const listButton = screen.getByRole('button', { name: /list/i });
      fireEvent.click(listButton);

      expect(onViewModeChange).toHaveBeenCalledWith('list');
    });
  });

  describe('Default Props', () => {
    it('uses default sort type', () => {
      mockUseSearchResults.mockReturnValue({
        ...defaultMockReturn,
        state: {
          ...defaultMockReturn.state,
          sortType: 'featured_desc',
        },
      });

      render(<SearchResultsWithInputComponent />);

      expect(mockUseSearchResults).toHaveBeenCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            sortType: 'featured_desc',
          }),
        })
      );
    });

    it('uses default items per page', () => {
      render(<SearchResultsWithInputComponent />);

      expect(mockUseSearchResults).toHaveBeenCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({
            itemsPerPage: 24,
          }),
        })
      );
    });

    it('accepts custom default values', () => {
      render(
        <SearchResultsWithInputComponent
          defaultSortType="date_desc"
          defaultPage={2}
          defaultKeyphrase="custom search"
          defaultItemsPerPage={12}
        />
      );

      expect(mockUseSearchResults).toHaveBeenCalledWith(
        expect.objectContaining({
          state: {
            sortType: 'date_desc',
            page: 2,
            itemsPerPage: 12,
            keyphrase: 'custom search',
          },
        })
      );
    });
  });

  describe('Responsive Behavior', () => {
    it('renders mobile and desktop filter sections', () => {
      render(<SearchResultsWithInputComponent />);

      // Both mobile and desktop filters should be rendered (visibility controlled by CSS)
      const filters = screen.getAllByTestId('filter');
      const facets = screen.getAllByTestId('search-facets');

      expect(filters.length).toBeGreaterThanOrEqual(1);
      expect(facets.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Edge Cases', () => {
    it('handles missing facets gracefully', () => {
      mockUseSearchResults.mockReturnValue({
        ...defaultMockReturn,
        queryResult: {
          ...defaultMockReturn.queryResult,
          data: {
            ...defaultMockReturn.queryResult.data,
            facet: [],
          },
        },
      });

      render(<SearchResultsWithInputComponent />);

      // Component renders both mobile and desktop versions
      expect(screen.getAllByTestId('search-facets').length).toBeGreaterThan(0);
    });

    it('handles missing sort choices gracefully', () => {
      mockUseSearchResults.mockReturnValue({
        ...defaultMockReturn,
        queryResult: {
          ...defaultMockReturn.queryResult,
          data: {
            ...defaultMockReturn.queryResult.data,
            sort: { choices: [] },
          },
        },
      });

      render(<SearchResultsWithInputComponent />);

      expect(screen.getByTestId('sort-order')).toBeInTheDocument();
    });

    it('handles undefined data object', () => {
      mockUseSearchResults.mockReturnValue({
        ...defaultMockReturn,
        queryResult: {
          isLoading: false,
          isFetching: false,
          data: undefined,
        },
      });

      render(<SearchResultsWithInputComponent />);

      expect(screen.getByText('0 Results')).toBeInTheDocument();
    });

    it('does not render view switcher when onViewModeChange is not provided', () => {
      render(<SearchResultsWithInputComponent viewMode="grid" />);

      expect(screen.queryByTestId('card-view-switcher')).not.toBeInTheDocument();
    });
  });
});
