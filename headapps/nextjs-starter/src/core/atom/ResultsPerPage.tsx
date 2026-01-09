// Results per page component
import React from 'react';
import { useSearchResultsActions, useSearchResults } from '@sitecore-search/react';

type ResultsPerPageProps = {
  defaultItemsPerPage?: number;
  options?: number[];
  className?: string;
};

const ResultsPerPage = ({
  defaultItemsPerPage = 24,
  options = [12, 24, 48],
  className = '',
}: ResultsPerPageProps) => {
  const { onItemsPerPageChange } = useSearchResultsActions();
  const {
    state: { itemsPerPage },
  } = useSearchResults();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(event.target.value);
    onItemsPerPageChange({ numItems: value });
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label htmlFor="items-per-page" className="text-sm text-gray-600 dark:text-gray-300">
        Show:
      </label>
      <select
        id="items-per-page"
        value={itemsPerPage || defaultItemsPerPage}
        onChange={handleChange}
        className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-gray-700 focus:ring-1 focus:ring-gray-700"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-600 dark:text-gray-300">per page</span>
    </div>
  );
};

export default ResultsPerPage;
