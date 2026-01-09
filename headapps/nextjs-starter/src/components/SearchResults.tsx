import { JSX, useState } from 'react';
import { useRouter } from 'next/router';
import { ComponentProps } from 'src/lib/component-props';
import SearchInputWidget, { ViewMode } from 'src/core/molecules/SearchInput';

interface SearchResultsProps extends ComponentProps {
  params: ComponentProps['params'] & {
    RenderingIdentifier?: string;
    styles?: string;
  };
}

const SearchResults = (props: SearchResultsProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const styles = props.params.styles || '';
  const rfkId = process.env.NEXT_PUBLIC_SEARCH_RFKID || '';
  const sourceId = process.env.NEXT_PUBLIC_SEARCH_SOURCE_ID || '';
  const [view, setView] = useState<ViewMode>('grid');
  const router = useRouter();

  // Read the 'q' query parameter from the URL
  const searchQuery = (router.query.q as string) || '';

  return (
    <div className={`search-results-page ${styles}`} id={id}>
      <SearchInputWidget
        rfkId={rfkId}
        viewMode={view}
        onViewModeChange={setView}
        defaultKeyphrase={searchQuery}
        sourceId={sourceId}
      />
    </div>
  );
};

export default SearchResults;
