// Query results summary component
import React from 'react';

type QueryResultsSummaryProps = {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalItemsReturned: number;
  className?: string;
};

const QueryResultsSummary = ({
  currentPage,
  itemsPerPage,
  totalItems,
  totalItemsReturned,
  className = '',
}: QueryResultsSummaryProps) => {
  // Return null if no results
  if (totalItems <= 0) {
    return null;
  }

  // Calculate start position
  const start = (currentPage - 1) * itemsPerPage + 1;

  // Calculate end position, capped at totalItems
  const end = Math.min(start + totalItemsReturned - 1, totalItems);

  return (
    <p className={`text-sm text-gray-600 dark:text-gray-300 ${className}`}>
      Showing <span className="font-medium">{start}</span>–
      <span className="font-medium">{end}</span> of{' '}
      <span className="font-medium">{totalItems}</span> results
    </p>
  );
};

export default QueryResultsSummary;
