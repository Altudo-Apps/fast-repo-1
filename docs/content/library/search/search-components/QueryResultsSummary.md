# Query Results Summary Component

## Overview
A text component that displays the current range of search results being viewed and the total number of results available.

## Goal
Implement a results summary display that shows "Showing X–Y of Z results" to help users understand their position in the search results.

## References

### Storybook Documentation
- **Component Reference**: [Sitecore Search - Query Results Summary](https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/story/widget-components-query-results-summary--page)
- Review the Storybook documentation for implementation details and examples

### Figma Design
- **Design Link**: [Figma - Search Results Toolbar](https://www.figma.com/design/M37xh0dT7qtPPiEDIRuA4X/XMC-Fastlane---Official-Altudo-Version?node-id=17811-6189&m=dev)

## Component Location
- **File Path**: `headapps/nextjs-starter/src/core/atom/QueryResultsSummary.tsx`

## Dependencies
- React only (no external dependencies)
- Pure presentational component

## Component Structure

### Display Format
- Text format: "Showing [start]–[end] of [total] results"
- Numbers displayed with medium font weight
- En-dash (–) separator between start and end

### Calculation Logic
- **Start**: `(currentPage - 1) × itemsPerPage + 1`
- **End**: `start + totalItemsReturned - 1`
- Both values capped at `totalItems` using `Math.min()`

### Conditional Rendering
- Component returns `null` if `totalItems` is 0 or less
- Only displays when results exist

## Props Interface

### Required Props
- `currentPage` (number) - Current active page number (1-based)
- `itemsPerPage` (number) - Number of items per page (e.g., 24)
- `totalItems` (number) - Total number of results available
- `totalItemsReturned` (number) - Number of items returned on current page

### Optional Props
- `className` (string) - Additional CSS classes for customization

## Key Styling Requirements
- Text color: Gray (gray-600 in light mode, gray-300 in dark mode)
- Numbers: Medium font weight for emphasis
- En-dash separator (–) not hyphen (-)

## Integration with Search Results

### Usage Context
- Displayed in search results toolbar
- Positioned on left side of toolbar (before CardViewSwitcher and SortOrder)
- Updated automatically when page changes or results update
- Receives props from search results state

### Data Source
- `currentPage`: From `useSearchResults` state
- `itemsPerPage`: From `useSearchResults` state
- `totalItems`: From `queryResult.data.total_item`
- `totalItemsReturned`: From `queryResult.data.content.length`

## Example Scenarios

### Full Page of Results
- Page 1, 24 items per page, 100 total items, 24 returned
- Displays: "Showing 1–24 of 100 results"

### Partial Last Page
- Page 5, 24 items per page, 100 total items, 4 returned
- Displays: "Showing 97–100 of 100 results"

### Single Page
- Page 1, 24 items per page, 10 total items, 10 returned
- Displays: "Showing 1–10 of 10 results"

### No Results
- 0 total items
- Component renders nothing (returns null)

## Key Behaviors
1. Automatically calculates start and end range
2. Handles edge cases (last page with fewer items)
3. Hides completely when no results
4. Updates on page navigation
5. Caps values at total to prevent overflow
6. Uses en-dash for professional typography

## Accessibility Requirements
- Use semantic paragraph element
- Ensure sufficient color contrast
- Numbers emphasized with font weight (not color alone)
- Screen readers announce full text

## Responsive Design
- Text size adjusts with parent container
- Works on mobile, tablet, and desktop
- Part of responsive toolbar layout
- May wrap on very small screens

## Testing Checklist
- [ ] Displays correct range on first page
- [ ] Displays correct range on middle pages
- [ ] Displays correct range on last page (partial)
- [ ] Hides when totalItems is 0
- [ ] Numbers have medium font weight
- [ ] Uses en-dash (–) not hyphen
- [ ] Dark mode colors work
- [ ] Updates when page changes
- [ ] Handles single-page results correctly

## Acceptance Criteria
✅ Pure React component (no Sitecore UI dependency)
✅ Format: "Showing X–Y of Z results"
✅ Automatic range calculation
✅ Returns null when no results
✅ Medium font weight on numbers
✅ En-dash separator (–)
✅ Dark mode support
✅ Integrates with search results state
✅ Responsive text sizing
✅ Matches Figma design

## Common Issues & Solutions

**Issue**: Displays incorrect range on last page
- **Solution**: Ensure `totalItemsReturned` reflects actual array length, not `itemsPerPage`

**Issue**: Shows "0–0" when no results
- **Solution**: Component should return null when `totalItems <= 0`

**Issue**: Range exceeds total
- **Solution**: Use `Math.min()` to cap end value at `totalItems`

**Issue**: Hyphen instead of en-dash
- **Solution**: Use proper en-dash character (–) not hyphen (-)

## Related Components
- `searchInput.tsx` - Main search component that displays this summary
- `SearchPagination.tsx` - Pagination control (works together to show position)
- `CardViewSwitcher.tsx` - Sibling component in toolbar
- `SortOrder.tsx` - Sibling component in toolbar

## Installation Note
This is a custom component (not from Sitecore UI library). Check the Storybook documentation for reference implementation patterns.
