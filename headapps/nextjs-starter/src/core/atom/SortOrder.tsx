// Sort order component
import React from 'react';
import { useSearchResultsActions } from '@sitecore-search/react';
import type { SearchResponseSortChoice } from '@sitecore-search/react';
import { SortSelect } from '@sitecore-search/ui';

type SortOrderProps = {
  options: SearchResponseSortChoice[];
  selected: string;
};

// Custom chevron icon as per Figma design
const ChevronIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="ml-1"
  >
    <path
      d="M6 8L10 12L14 8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SortOrder = ({ options, selected }: SortOrderProps) => {
  const { onSortChange } = useSearchResultsActions();
  const selectedSortIndex = options.findIndex((s) => s.name === selected);

  // Find the label for the selected option
  const selectedLabel = selectedSortIndex > -1 ? options[selectedSortIndex].label : '';

  if (!options || options.length === 0) {
    return null;
  }

  return (
    <SortSelect.Root defaultValue={options[selectedSortIndex]?.name} onValueChange={onSortChange}>
      <SortSelect.Trigger className="inline-flex items-center text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors focus:outline-none">
        <span className="font-normal">Sort by:</span>
        <SortSelect.SelectValue className="font-medium ml-1">
          {selectedLabel}
        </SortSelect.SelectValue>
        <ChevronIcon />
      </SortSelect.Trigger>

      <SortSelect.Content className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg overflow-hidden z-50">
        <SortSelect.Viewport className="p-1">
          {options.map((option) => (
            <SortSelect.Option
              key={option.name}
              value={option}
              className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer outline-none focus:bg-gray-100 dark:focus:bg-gray-700 data-[state=checked]:bg-gray-100 dark:data-[state=checked]:bg-gray-700 data-[state=checked]:font-medium"
            >
              <SortSelect.OptionText>{option.label}</SortSelect.OptionText>
            </SortSelect.Option>
          ))}
        </SortSelect.Viewport>
      </SortSelect.Content>
    </SortSelect.Root>
  );
};

export default SortOrder;
