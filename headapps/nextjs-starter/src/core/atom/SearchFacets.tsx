// Search facets component
import React from 'react';
import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { useSearchResultsActions } from '@sitecore-search/react';
import type { SearchResponseFacet } from '@sitecore-search/react';
import { SearchResultsAccordionFacets, AccordionFacets } from '@sitecore-search/ui';

type SearchFacetsProps = {
  facets: SearchResponseFacet[];
};

const SearchFacets = ({ facets }: SearchFacetsProps) => {
  const { onFacetClick } = useSearchResultsActions();

  if (!facets || facets.length === 0) {
    return null;
  }

  return (
    <SearchResultsAccordionFacets
      defaultFacetTypesExpandedList={[]}
      onFacetValueClick={onFacetClick}
      className="space-y-2"
    >
      {facets.map((facet) => (
        <AccordionFacets.Facet facetId={facet.name} key={facet.name}>
          <AccordionFacets.Header className="border-b border-gray-200 dark:border-gray-700 pb-2">
            <AccordionFacets.Trigger className="flex justify-between items-center w-full text-left py-2 hover:text-gray-700 dark:hover:text-gray-300 group">
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                {facet.label}
              </span>
              <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </AccordionFacets.Trigger>
          </AccordionFacets.Header>

          <AccordionFacets.Content className="pt-2 pb-4">
            <AccordionFacets.ValueList className="space-y-2">
              {facet.value.map((value) => (
                <AccordionFacets.Item
                  key={`${facet.name}-${value.id}`}
                  facetValueId={value.id}
                  className="flex items-center gap-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded px-2 cursor-pointer"
                >
                  <AccordionFacets.ItemCheckbox className="w-4 h-4 border border-gray-300 dark:border-gray-600 rounded flex items-center justify-center data-[state=checked]:bg-gray-800 dark:data-[state=checked]:bg-gray-300">
                    <AccordionFacets.ItemCheckboxIndicator>
                      <CheckIcon className="w-3 h-3 text-white dark:text-gray-800" />
                    </AccordionFacets.ItemCheckboxIndicator>
                  </AccordionFacets.ItemCheckbox>
                  <AccordionFacets.ItemLabel className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                    {value.text} ({value.count})
                  </AccordionFacets.ItemLabel>
                </AccordionFacets.Item>
              ))}
            </AccordionFacets.ValueList>
          </AccordionFacets.Content>
        </AccordionFacets.Facet>
      ))}
    </SearchResultsAccordionFacets>
  );
};

export default SearchFacets;
