import React, { useRef } from 'react';
import type { SearchResultsInitialState, SearchResultsStoreState } from '@sitecore-search/react';
import { WidgetDataType, useSearchResults, widget } from '@sitecore-search/react';

import ArticleHorizontalItemCard from '../atom/ArticleHorizontalCard';
import ArticleCard from '../atom/ArticleCard';
import CardViewSwitcherControl from '../atom/CardViewSwitcher';
import Filter from '../atom/Filter';
import QueryResultsSummary from '../atom/QueryResultsSummary';
import SearchFacets from '../atom/SearchFacets';
import SearchPagination from '../atom/SearchPagination';
import SortOrder from '../atom/SortOrder';
import Spinner from '../atom/Spinner';
import { Button } from '../ui/button';

export type ViewMode = 'grid' | 'list';

type ArticleModel = {
  id: string;
  type?: string;
  title?: string;
  name?: string;
  subtitle?: string;
  url?: string;
  description?: string;
  content_text?: string;
  image_url?: string;
  source_id?: string;
  author?: string;
  category?: string;
};
type ArticleSearchResultsProps = {
  defaultSortType?: SearchResultsStoreState['sortType'];
  defaultPage?: SearchResultsStoreState['page'];
  defaultItemsPerPage?: SearchResultsStoreState['itemsPerPage'];
  defaultKeyphrase?: SearchResultsStoreState['keyphrase'];
  viewMode?: ViewMode;
  sourceId?: string;
};
type InitialState = SearchResultsInitialState<'itemsPerPage' | 'keyphrase' | 'page' | 'sortType'>;

export const SearchResultsWithInputComponent = ({
  defaultSortType = 'featured_desc',
  defaultPage = 1,
  defaultKeyphrase = '',
  defaultItemsPerPage = 24,
  viewMode = 'grid',
  sourceId,
  onViewModeChange,
}: ArticleSearchResultsProps & { onViewModeChange?: (mode: ViewMode) => void }) => {
  const {
    widgetRef,
    actions: { onItemClick, onKeyphraseChange, onPageNumberChange },
    state: { sortType, page, itemsPerPage, keyphrase: currentKeyphrase },
    queryResult: {
      isLoading,
      isFetching,
      data: {
        total_item: totalItems = 0,
        sort: { choices: sortChoices = [] } = {},
        facet: facets = [],
        content: articles = [],
      } = {},
    },
  } = useSearchResults<ArticleModel, InitialState>({
    query: (query) => {
      // Set source ID to scope search to specific content source
      if (sourceId) {
        query.getRequest().setSources([sourceId]);
      }
    },
    state: {
      sortType: defaultSortType,
      page: defaultPage,
      itemsPerPage: defaultItemsPerPage,
      keyphrase: defaultKeyphrase,
    },
  });

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleSearchClick = () => {
    const raw = inputRef.current?.value?.trim() ?? '';
    const keyphrase = raw === '' ? '' : raw;
    // Reset to page 1 when searching
    if (onPageNumberChange) onPageNumberChange({ page: 1 });
    if (onKeyphraseChange) onKeyphraseChange({ keyphrase });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-white dark:bg-gray-800">
        <Spinner loading />
      </div>
    );
  }
  return (
    <div ref={widgetRef}>
      <div className="w-full px-4">
        <div className="py-6 md:py-12">
          <h2 className="text-base-foreground text-3xl md:text-4xl lg:text-5xl font-['Zodiak'] mb-3">
            Search results for <q>{currentKeyphrase}</q>
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                placeholder="Search FastLane"
                defaultValue={currentKeyphrase}
                onKeyDown={handleKeyDown}
                className="peer rounded-md w-full h-11 px-2 py-3 border border-gray-300 bg-white text-sm focus:outline-gray-700 shadow-sm dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleSearchClick}
              className="h-11 px-5 w-full sm:w-auto"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row relative w-full overflow-hidden px-4 text-black dark:text-gray-100 text-opacity-75">
        {isFetching && (
          <div className="w-full h-full fixed top-0 left-0 bottom-0 right-0 z-30 bg-white opacity-50">
            <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex flex-col justify-center items-center z-40">
              <Spinner loading />
            </div>
          </div>
        )}
        {totalItems > 0 && (
          <>
            {/* Mobile Filters - Shown on mobile/tablet, hidden on desktop */}
            <section className="flex lg:hidden flex-col w-full mb-6">
              <Filter />
              <SearchFacets facets={facets} />
            </section>

            {/* Desktop Filters - Hidden on mobile, shown on desktop */}
            <section className="hidden lg:flex flex-col flex-none relative mt-4 mr-8 w-[25%] min-w-0">
              <Filter />
              <SearchFacets facets={facets} />
            </section>
            <section className="flex flex-col flex-1 min-w-0 w-full">
              {/* Sort Select */}
              <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs mb-4 mt-4">
                {totalItems > 0 && (
                  <QueryResultsSummary
                    currentPage={page}
                    itemsPerPage={itemsPerPage}
                    totalItems={totalItems}
                    totalItemsReturned={articles.length}
                  />
                )}
                <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                  {onViewModeChange && (
                    <CardViewSwitcherControl value={viewMode} onChange={onViewModeChange} />
                  )}
                  <SortOrder options={sortChoices} selected={sortType} />
                </div>
              </section>

              {/* Results */}
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                    : 'flex flex-col w-full'
                }
              >
                {articles.map((a, index) =>
                  viewMode === 'grid' ? (
                    <ArticleCard
                      key={`${a.id}-${index}`}
                      article={a as ArticleModel}
                      index={index}
                      onItemClick={onItemClick}
                    />
                  ) : (
                    <ArticleHorizontalItemCard
                      key={`${a.id}-${index}`}
                      article={a as ArticleModel}
                      index={index}
                      onItemClick={onItemClick}
                      displayText={true}
                    />
                  )
                )}
              </div>
              <div className="flex flex-col md:flex-row md:justify-center text-xs mx-auto pb-12 pt-6 w-full">
                <SearchPagination currentPage={page} totalPages={totalPages} />
              </div>
            </section>
          </>
        )}
        {totalItems <= 0 && !isFetching && (
          <div className="w-full flex justify-center">
            <h3>0 Results</h3>
          </div>
        )}
      </div>
    </div>
  );
};
const SearchResultsWithInputWidget = widget(
  SearchResultsWithInputComponent,
  WidgetDataType.SEARCH_RESULTS,
  'content'
);
export default SearchResultsWithInputWidget;
