// Search pagination component
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { useSearchResultsActions } from '@sitecore-search/react';
import { Pagination } from '@sitecore-search/ui';

type SearchPaginationProps = {
  currentPage: number;
  totalPages: number;
};

const SearchPagination = ({ currentPage, totalPages }: SearchPaginationProps) => {
  const { onPageNumberChange } = useSearchResultsActions();

  // Hide pagination if only 1 page or less
  if (totalPages <= 1) {
    return null;
  }

  const handlePageChange = (page: number) => {
    onPageNumberChange({ page });
  };

  return (
    <Pagination.Root
      currentPage={currentPage}
      defaultCurrentPage={1}
      totalPages={totalPages}
      onPageChange={(page) => handlePageChange(page)}
      className="flex items-center gap-3"
    >
      <Pagination.PrevPage
        onClick={(e) => e.preventDefault()}
        className="flex items-center justify-center w-6 h-6 text-[#18181b] dark:text-white hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </Pagination.PrevPage>

      <Pagination.Pages className="flex gap-4">
        {(pagination) =>
          Pagination.paginationLayout(pagination, {
            boundaryCount: 1,
            siblingCount: 1,
          }).map(({ page, type }, index) => {
            if (type === 'page') {
              return (
                <Pagination.Page
                  key={`${page}-${index}`}
                  aria-label={`Page ${page}`}
                  page={page as number}
                  onClick={(e) => e.preventDefault()}
                  className={`
                    font-['Satoshi'] text-base leading-6 font-normal !bg-transparent
                    transition-colors cursor-pointer
                    ${
                      page === currentPage
                        ? 'text-[#0c4a6e] dark:text-[#0c4a6e] underline decoration-solid underline-offset-4'
                        : 'text-[#0c4a6e] dark:text-[#0c4a6e] hover:opacity-70'
                    }
                  `}
                >
                  {page}
                </Pagination.Page>
              );
            }
            return (
              <span
                key={`ellipsis-${index}`}
                className="text-[#0c4a6e] dark:text-[#0c4a6e] font-['Satoshi'] text-base"
              >
                ...
              </span>
            );
          })
        }
      </Pagination.Pages>

      <Pagination.NextPage
        onClick={(e) => e.preventDefault()}
        className="flex items-center justify-center w-6 h-6 text-[#18181b] dark:text-white hover:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </Pagination.NextPage>
    </Pagination.Root>
  );
};

export default SearchPagination;
