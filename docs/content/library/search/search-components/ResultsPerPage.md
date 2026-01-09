# Results Per Page Component

## Overview
A dropdown component that allows users to control how many search results are displayed per page. This component integrates with the Sitecore Search SDK to dynamically update the number of results shown.

## Reference
- **Storybook Documentation**: [Results Per Page Component](https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/story/widget-components-results-per-page--page)

## Component Location
- **File Path**: `headapps/nextjs-starter/src/core/atom/ResultsPerPage.tsx`

## Dependencies
- `@sitecore-search/react` - SDK hooks for actions and state
- React
- Tailwind CSS

## Implementation Type
This is a **custom component** (not from `@sitecore-search/ui` library). It uses SDK hooks to manage state and actions.

## Component Structure

### Props Interface
```typescript
type ResultsPerPageProps = {
  defaultItemsPerPage?: number;  // Default number of items (default: 24)
  options?: number[];            // Array of options to display (default: [12, 24, 48])
  className?: string;            // Optional custom CSS classes
};
```

### SDK Hooks Used
1. **useSearchResultsActions()**: Gets `onItemsPerPageChange` action
2. **useSearchResults()**: Gets current `itemsPerPage` from state

### UI Layout
The component renders as:
```
Show: [dropdown with options] per page
```

Example: **Show:** `[24 ▼]` **per page**

## Key Features

✅ **SDK Integration**: Uses Sitecore Search hooks for state management  
✅ **Controlled Component**: Select value synced with SDK state  
✅ **Dynamic Options**: Configurable options array  
✅ **Change Handler**: Calls `onItemsPerPageChange({ numItems: value })` on selection  
✅ **Accessible**: Includes proper label with `htmlFor` attribute  
✅ **Dark Mode**: Full dark mode support  
✅ **Responsive**: Flex layout with proper spacing  
✅ **TypeScript**: Fully typed with proper interfaces  

## Implementation Code

```typescript
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
```

## How It Works

1. **Component Mounts**: Reads current `itemsPerPage` from SDK state
2. **User Interaction**: User selects new value from dropdown
3. **Event Handler**: `handleChange` is triggered
4. **SDK Action**: Calls `onItemsPerPageChange({ numItems: value })`
5. **State Update**: SDK updates internal state
6. **Results Refetch**: SDK automatically refetches with new page size
7. **Re-render**: Component shows updated value

## Integration with SearchInput

The component is used in the SearchInput template:

```typescript
<div className="flex flex-col md:flex-row md:justify-between text-xs">
  <ResultsPerPage defaultItemsPerPage={defaultItemsPerPage} />
  <SearchPagination currentPage={page} totalPages={totalPages} />
</div>
```

## Styling Details

### Light Mode
- Label text: `text-gray-600`
- Select border: `border-gray-300`
- Select background: `bg-white`
- Select text: `text-gray-900`

### Dark Mode
- Label text: `dark:text-gray-300`
- Select border: `dark:border-gray-600`
- Select background: `dark:bg-gray-800`
- Select text: `dark:text-gray-100`

### Focus States
- Focus outline: `focus:outline-gray-700`
- Focus ring: `focus:ring-1 focus:ring-gray-700`

## Customization Examples

### Custom Options
```typescript
<ResultsPerPage options={[10, 20, 50, 100]} />
```

### Custom Default
```typescript
<ResultsPerPage defaultItemsPerPage={50} options={[25, 50, 75, 100]} />
```

### Custom Styling
```typescript
<ResultsPerPage className="my-custom-class" />
```

## Accessibility

✅ Semantic HTML with `<label>` and `<select>`  
✅ Proper `id` and `htmlFor` attribute linking  
✅ Keyboard navigable (standard select behavior)  
✅ Screen reader friendly (label announces purpose)  
✅ Sufficient color contrast ratios  

## Testing Checklist

- [ ] Default value displays correctly
- [ ] Dropdown shows all options
- [ ] Selecting option triggers results update
- [ ] State persists during navigation
- [ ] Dark mode colors work properly
- [ ] Keyboard navigation works
- [ ] Label is properly associated with select
- [ ] Component renders in SearchInput template

## Common Issues & Solutions

**Issue**: Select doesn't update results
- **Solution**: Ensure component is within a widget wrapped with `widget()` function and has access to SDK context

**Issue**: Wrong value displayed
- **Solution**: Make sure `itemsPerPage` from SDK state is being used, with fallback to `defaultItemsPerPage`

**Issue**: Options not showing
- **Solution**: Verify `options` array is properly passed and mapped in the JSX

## Related Components

- `SearchInput.tsx` - Parent component that uses ResultsPerPage
- `SearchPagination.tsx` - Sibling component for page navigation
- `QueryResultsSummary.tsx` - Shows current range affected by items per page

## Notes

- This is a **controlled component** - the value is controlled by SDK state
- When items per page changes, pagination resets to page 1
- SDK automatically handles the refetch and state updates
- Default export is used to match SearchInput import pattern
