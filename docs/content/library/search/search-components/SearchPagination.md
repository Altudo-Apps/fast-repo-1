# Search Pagination Component

## Overview
A pagination component for navigating through search results pages with Previous/Next buttons and numbered page buttons, built using Sitecore Search UI components.

## Goal
Implement a clean, accessible pagination component that allows users to navigate through multiple pages of search results, matching the Figma design specifications.

## Figma Design Reference
- **Desktop**: [Figma Design - Desktop](https://www.figma.com/design/M37xh0dT7qtPPiEDIRuA4X/XMC-Fastlane---Official-Altudo-Version?node-id=17922-3429&m=dev)
- **Active Page**: [Figma Design - Active State](https://www.figma.com/design/M37xh0dT7qtPPiEDIRuA4X/XMC-Fastlane---Official-Altudo-Version?node-id=17922-3419&m=dev)

## Storybook Reference
- [Sitecore Search UI - Pagination](https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/docs/widget-components-pagination--docs)

## Component Location
- **File Path**: `headapps/nextjs-starter/src/core/atom/SearchPagination.tsx`

## Dependencies
- Import `ChevronLeftIcon` and `ChevronRightIcon` from `@radix-ui/react-icons`
- Import `useSearchResultsActions` from `@sitecore-search/react`
- Import `Pagination` from `@sitecore-search/ui`

## Component Structure

### Use Sitecore Pagination Component
- Use `Pagination.Root` as the main container
- Pass `currentPage`, `defaultCurrentPage` (set to 1), and `totalPages` props
- Wire `onPageChange` event to call `onPageNumberChange` from `useSearchResultsActions`

### Previous Button
- Use `Pagination.PrevPage` component
- Add `onClick` handler with `preventDefault()`
- Display `ChevronLeftIcon` inside

### Page Numbers Section
- Use `Pagination.Pages` component with render prop
- Call `Pagination.paginationLayout` with `boundaryCount: 1` and `siblingCount: 1`
- Map through returned array checking type
- For `type === 'page'`: render `Pagination.Page` with page number
- For other types: render ellipsis span with "..."
- Apply conditional styling based on active page

### Next Button
- Use `Pagination.NextPage` component
- Add `onClick` handler with `preventDefault()`
- Display `ChevronRightIcon` inside

## Key Styling Requirements
- **All buttons**: Transparent background, no borders
- **Active page button**: Bottom border only (2px solid), no rounded corners
- **Disabled buttons**: 30% opacity

## Props Interface
- `currentPage` (number) - the current active page
- `totalPages` (number) - total number of pages available

## Integration with Search SDK
- Call `useSearchResultsActions` to get `onPageNumberChange` action
- When page changes, call `onPageNumberChange` with object containing page number

## Smart Pagination Layout
- Configure `boundaryCount: 1` - shows 1 page at start and end
- Configure `siblingCount: 1` - shows 1 page before and after current
- Layout automatically shows ellipsis for skipped pages

## Key Behaviors
1. Component hides automatically when totalPages is 1 or less
2. Previous button disabled on first page
3. Next button disabled on last page
4. Active page highlighted with bottom border only
5. Ellipsis shown for non-consecutive pages
6. Page changes trigger search results update
7. No page reloads on navigation

## Testing Checklist
- [ ] Previous button disabled on page 1
- [ ] Next button disabled on last page
- [ ] Clicking page numbers navigates correctly
- [ ] Active page shows straight bottom border (no rounded corners)
- [ ] No borders on inactive page buttons
- [ ] Ellipsis displayed for non-consecutive pages
- [ ] Keyboard navigation works
- [ ] Dark mode works correctly

## Acceptance Criteria
✅ Uses Sitecore Search UI Pagination component
✅ Previous/Next are icon buttons without borders
✅ Active page has straight bottom border only (2px solid)
✅ Smart pagination with ellipsis for skipped pages
✅ Disabled states at boundaries (30% opacity)
✅ Integrates with useSearchResultsActions
✅ Keyboard accessible with ARIA attributes
✅ Responsive and mobile-friendly
✅ Dark mode support

## Related Components
- `searchInput.tsx` - Main search results component using pagination
- `QueryResultsSummary.tsx` - Result count display

## Implementation Code

```typescript
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
      className="flex items-center gap-1"
    >
      <Pagination.PrevPage
        onClick={(e) => e.preventDefault()}
        className="flex items-center justify-center w-8 h-8 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </Pagination.PrevPage>

      <Pagination.Pages>
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
                    flex items-center justify-center min-w-[32px] h-8 px-2 text-sm
                    text-gray-700 dark:text-gray-300
                    hover:text-gray-900 dark:hover:text-gray-100
                    transition-colors
                    ${
                      page === currentPage
                        ? 'border-b-2 border-gray-900 dark:border-gray-100 font-semibold'
                        : 'border-b-2 border-transparent'
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
                className="flex items-center justify-center w-8 h-8 text-gray-500 dark:text-gray-400"
              >
                ...
              </span>
            );
          })
        }
      </Pagination.Pages>

      <Pagination.NextPage
        onClick={(e) => e.preventDefault()}
        className="flex items-center justify-center w-8 h-8 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </Pagination.NextPage>
    </Pagination.Root>
  );
};

export default SearchPagination;
```

## How It Works

1. **Props Received**: Component gets `currentPage` and `totalPages` from SearchInput
2. **Conditional Render**: Returns `null` if `totalPages <= 1`
3. **SDK Hook**: Calls `useSearchResultsActions()` to get `onPageNumberChange`
4. **Pagination Layout**: Uses `Pagination.paginationLayout()` with smart configuration
5. **User Clicks Page**: Fires `handlePageChange(page)`
6. **SDK Action**: Calls `onPageNumberChange({ page })`
7. **Results Update**: SDK refetches results for new page
8. **Component Re-renders**: Shows new active page state

## Pagination Layout Examples

### Configuration
```typescript
Pagination.paginationLayout(pagination, {
  boundaryCount: 1,  // Always show first and last page
  siblingCount: 1,   // Show 1 page before/after current
})
```

### Layout Examples

**Total 5 pages, current page 3:**
```
< 1 2 [3] 4 5 >
```

**Total 10 pages, current page 5:**
```
< 1 ... 4 [5] 6 ... 10 >
```

**Total 10 pages, current page 2:**
```
< 1 [2] 3 ... 10 >
```

**Total 10 pages, current page 9:**
```
< 1 ... 8 [9] 10 >
```

## Styling Breakdown

### Prev/Next Buttons
```css
/* Base styles */
w-8 h-8                          /* 32x32px size */
text-gray-700 dark:text-gray-300 /* Default color */

/* Hover state */
hover:text-gray-900 dark:hover:text-gray-100

/* Disabled state */
disabled:opacity-30              /* 30% opacity */
disabled:cursor-not-allowed      /* No pointer cursor */

/* Icon */
ChevronIcon w-5 h-5             /* 20x20px icon */
```

### Page Buttons
```css
/* Base styles */
min-w-[32px] h-8 px-2 text-sm
text-gray-700 dark:text-gray-300
border-b-2 border-transparent     /* Invisible border for spacing */

/* Hover */
hover:text-gray-900 dark:hover:text-gray-100

/* Active page */
border-b-2 border-gray-900 dark:border-gray-100  /* Straight bottom border */
font-semibold                                     /* Bold text */
```

**Key: Active page uses STRAIGHT bottom border, NOT rounded corners**

### Ellipsis
```css
w-8 h-8                          /* Consistent sizing */
text-gray-500 dark:text-gray-400 /* Muted color */
```

## Integration with SearchInput

The component is used in the SearchInput template:

```typescript
const totalPages = Math.ceil(totalItems / itemsPerPage);

// Inside render
<div className="flex flex-col md:flex-row md:justify-between text-xs">
  <ResultsPerPage defaultItemsPerPage={defaultItemsPerPage} />
  <SearchPagination currentPage={page} totalPages={totalPages} />
</div>
```

**Data Sources:**
- `currentPage`: From `useSearchResults().state.page`
- `totalPages`: Calculated from `totalItems / itemsPerPage`

## Render Prop Pattern

`Pagination.Pages` uses a render prop that receives the full pagination object:

```typescript
<Pagination.Pages>
  {(pagination) => {
    // pagination object contains:
    // - totalPages
    // - currentPage
    // - pages array
    // - hasPrev, hasNext
    // - and more...
    
    return Pagination.paginationLayout(pagination, config).map(...)
  }}
</Pagination.Pages>
```

**Important:** Pass the entire `pagination` object to `paginationLayout()`, not just `pages` array.

## Accessibility Features

✅ **ARIA Labels**: Each page button has `aria-label="Page X"`  
✅ **Keyboard Navigation**: Full keyboard support via Sitecore UI  
✅ **Disabled States**: Prev/Next auto-disable at boundaries  
✅ **Focus Indicators**: Browser default focus styles work  
✅ **Screen Readers**: Announces page numbers and navigation  

## Common Issues & Solutions

**Issue**: TypeScript error "Type 'Page[]' is not assignable"
- **Solution**: Pass full `pagination` object to `paginationLayout()`, not just `pages` array

**Issue**: Pagination shows on single page
- **Solution**: Add `if (totalPages <= 1) return null;` check

**Issue**: Active page has rounded border
- **Solution**: Use `border-b-2` (bottom only), not `border-2` (all sides). No `rounded` classes.

**Issue**: Disabled buttons still clickable
- **Solution**: Sitecore UI handles this automatically. Ensure `disabled:opacity-30` and `disabled:cursor-not-allowed` classes are present.

**Issue**: Page numbers not responsive
- **Solution**: Use `min-w-[32px]` instead of fixed width to allow numbers like "10", "99" to fit.

## Performance Notes

- Pagination is hidden when `totalPages <= 1` to reduce DOM nodes
- `preventDefault()` on clicks prevents page reloads
- SDK handles all state management efficiently
- Re-renders only when `currentPage` or `totalPages` change

## Testing Guide

### Manual Testing
1. Navigate to first page → Prev button should be disabled (30% opacity)
2. Navigate to last page → Next button should be disabled (30% opacity)
3. Click page numbers → Results update without page reload
4. Check active page → Should have straight bottom border (2px solid)
5. Count pages → Should show ellipsis when appropriate
6. Toggle dark mode → All colors should adjust
7. Keyboard navigate → Tab should move through buttons
8. Resize window → Pagination should remain functional

### Edge Cases
- 1 page → Component hidden
- 2 pages → `< 1 2 >`
- 3 pages → `< 1 2 3 >`
- Many pages → Ellipsis shown correctly

## Notes

- This is a **custom implementation** using Sitecore UI components
- Uses **render prop pattern** with `Pagination.Pages`
- **Smart layout algorithm** automatically shows/hides ellipsis
- **No page reloads** - all navigation via SDK
- **Transparent buttons** - matches Figma design exactly
- **Default export** to match SearchInput import pattern