# Search Facets Component

## Overview
An accordion-based facets component for filtering search results, with checkbox selections and range sliders for price facets.

## Goal
Implement collapsible search facets that allow users to filter results by various attributes, matching the Figma design specifications.

## Figma Design Reference
- **Component**: [Figma Design - Search Facets](https://www.figma.com/design/M37xh0dT7qtPPiEDIRuA4X/XMC-Fastlane---Official-Altudo-Version?node-id=17811-6090&m=dev)

## Storybook Reference
- [Sitecore Search UI - Facets](https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/docs/widget-components-facets--docs)

## Component Location
- **File Path**: `headapps/nextjs-starter/src/core/atom/SearchFacets.tsx`

## Dependencies
- Import `CheckIcon`, `ChevronDownIcon` from `@radix-ui/react-icons`
- Import facet types from `@sitecore-search/react`
- Import `useSearchResultsActions` from `@sitecore-search/react`
- Import facet components from `@sitecore-search/ui`: `AccordionFacets`, `FacetItem`, `RangeFacet`, `SearchResultsAccordionFacets`, `SearchResultsFacetValueRange`

## Component Structure

### Main Container
- Use `SearchResultsAccordionFacets` as root component
- Pass `onFacetValueClick` handler from `useSearchResultsActions`
- Map through facets array to render each facet

### Facet Header
- Use `AccordionFacets.Header` with `AccordionFacets.Trigger`
- Display facet label (name)
- Add `AccordionFacets.Icon` for chevron (rotates on open/close)
- Chevron only shown for non-price facets

### Facet Content
- Use `AccordionFacets.Content` wrapper
- Two types: Regular facets and Price facets

### Regular Facets
- Use `AccordionFacets.ValueList` to map facet values
- Each value is a `FacetItem` with:
  - `AccordionFacets.ItemCheckbox` with `CheckIcon`
  - `AccordionFacets.ItemLabel` showing value text and count

### Price Facets
- Create separate `PriceFacet` component
- Use `SearchResultsFacetValueRange` with min/max values
- Contains `RangeFacet.Track` with `RangeFacet.Range`
- Two handles: `RangeFacet.Start` and `RangeFacet.End`
- Display current values below handles

## Props Interface
- `facets` (SearchResponseFacet[]) - Array of facet data from search results

## Key Styling Requirements
- Accordion chevron rotates 180deg when expanded
- Chevron positioned on right side of header
- Checkbox styling with checked state
- Price range slider with dual handles

## Integration with Search SDK
- Get `onFacetClick` from `useSearchResultsActions`
- Pass to `onFacetValueClick` prop
- Facet selections automatically update search results
- State managed by Sitecore Search SDK

## Key Behaviors
1. Facets collapse/expand on header click
2. Multiple facets can be open simultaneously
3. Checkbox selection filters results immediately
4. Price range updates on handle release
5. Facet counts update based on selections
6. Chevron rotates to indicate open/closed state

## Testing Checklist
- [ ] Facets expand/collapse on click
- [ ] Checkboxes toggle selection
- [ ] Selected filters update results
- [ ] Price range slider works
- [ ] Facet counts display correctly
- [ ] Chevron rotates on expand/collapse
- [ ] Multiple facets can be open
- [ ] Keyboard navigation works
- [ ] Dark mode works correctly

## Acceptance Criteria
✅ Uses Sitecore Search UI facet components
✅ Accordion behavior for expanding/collapsing
✅ Checkbox selections for regular facets
✅ Range slider for price facets
✅ Chevron indicator on facet headers
✅ Integrates with useSearchResultsActions
✅ Facet selections filter results
✅ Keyboard accessible
✅ Dark mode support

## Related Components
- `searchInput.tsx` - Main search component that displays facets
- `Filter.tsx` - Active filters display with clear options
