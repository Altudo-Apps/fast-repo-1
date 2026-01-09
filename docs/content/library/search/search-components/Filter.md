# Search Filter Component – Implementation Brief

Use this document to (re)generate the Filter component that works with the Sitecore Search SDK and the Search Input template.

## Reference
- Filters component docs: https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/story/widget-components-filters--page

## Where to implement
- File: `headapps/nextjs-starter/src/core/atom/Filter.tsx`

## Dependencies
- `@sitecore-search/react` (hooks)
- Tailwind (utility classes)

## Expected behavior
- Read selected filters from the Search SDK store
  - Hook: `useSearchResultsSelectedFilters()` → array of selected filters
- Provide user actions via Search SDK
  - Hook: `useSearchResultsActions()` → `{ onRemoveFilter, onClearFilters }`
- Render each selected filter as a pill/chip with a remove (×) action
- Show a "Clear all filters" action if any filters exist
- Return `null` when there are no selected filters

## Implementation outline (pseudocode)
- Import hooks: `useSearchResultsSelectedFilters`, `useSearchResultsActions`
- `const selected = useSearchResultsSelectedFilters()`
- `const { onRemoveFilter, onClearFilters } = useSearchResultsActions()`
- If no `selected?.length`, return `null`
- Otherwise:
  - Map `selected` to chips: label = `${facetLabel}: ${valueLabel}`
  - Chip onClick → `onRemoveFilter(filter)`
  - Render small link/button: "Clear all filters" → `onClearFilters()`
- Add Tailwind classes similar to the docs (rounded-full, px-3, py-1, hover styles)

## Acceptance criteria
- Component compiles with no lints
- No runtime errors when used inside the Search Input template
- Removing a chip triggers `onRemoveFilter`
- "Clear all filters" triggers `onClearFilters`
- Returns `null` if no filters are selected

## Notes
- Types for selected filter come from the SDK; avoid hardcoding unless necessary
- Keep the component presentational and stateless other than calling SDK actions

## Installation & Setup Steps

### Step 1: Generate Component Using Sitecore CLI
Use the Sitecore Search CLI to generate the Filter component:

```bash
npx sc-search new-component --language typescript --name Filter --styling tailwind --output src/core/atom --overwrite
```

This will generate the component at: `src/core/atom/Filter/index.tsx`

### Step 2: Restructure the Generated File
The CLI generates the component in a folder structure. Flatten it:

**Move and rename the file**:
1. The CLI creates: `src/core/atom/Filter/index.tsx`
2. Move the content to: `src/core/atom/Filter.tsx`
3. Delete the old `Filters.tsx` if it exists (note the plural)
4. Delete the `Filter` folder

```bash
# PowerShell commands
# First, the content is copied (done via write operation to Filter.tsx)
# Then delete the old plural version and folder:
Remove-Item -Path src/core/atom/Filters.tsx -Force
Remove-Item -Path src/core/atom/Filter -Recurse -Force
```

### Step 3: Fix TypeScript Types
The generated component uses `any` type. Replace it with a proper type:

```typescript
type SelectedFacet = {
  facetId: string;
  facetLabel?: string;  // Optional - may be undefined from SDK
  valueLabel?: string;
  min?: number;         // For range filters
  max?: number;         // For range filters
};

const buildFacetLabel = (selectedFacet: SelectedFacet) => {
  // Changed from 'any'
  if ('min' in selectedFacet || 'max' in selectedFacet) {
    return `${buildRangeLabel(selectedFacet.min, selectedFacet.max)}`;
  }
  return `${selectedFacet.valueLabel}`;
};
```

**Important**: Make `facetLabel` optional (with `?`) to match the SDK's return type.

### Step 4: Format the Component
Fix the ternary operator formatting:

```typescript
const buildRangeLabel = (min: number | undefined, max: number | undefined): string => {
  return typeof min === 'undefined'
    ? `< $${max}`
    : typeof max === 'undefined'
    ? ` > $${min}`
    : `$${min} - $${max}`;
};
```

### Step 5: Verify No Linting Errors
Run the linter to ensure everything is clean:

```bash
npm run lint
```

## Generated Component Features

The CLI-generated Filter component includes:

✅ **SDK Hooks Integration**: Uses `useSearchResultsSelectedFilters()` and `useSearchResultsActions()`  
✅ **Dynamic Filter Pills**: Each selected filter rendered as a clickable chip  
✅ **Remove Individual Filter**: Click on pill calls `onRemoveFilter(filter)`  
✅ **Clear All Filters**: Button calls `onClearFilters()` to remove all at once  
✅ **Range Filter Support**: Handles min/max values for price ranges  
✅ **Conditional Rendering**: Returns empty fragment when no filters selected  
✅ **CSS-Based × Icon**: Uses ::before and ::after pseudo-elements  
✅ **Dark Mode Support**: Proper dark mode color classes  
✅ **TypeScript**: Fully typed with proper interfaces  
✅ **Accessibility**: Semantic HTML with proper button elements  

## Component Structure

The generated component includes:

1. **Header Section**: 
   - "Filters" title
   - "Clear Filters" button (only shown when filters exist)

2. **Filter Pills Section**:
   - Maps through selected filters
   - Each pill shows: `facetLabel: valueLabel` or range display
   - Click handler on each pill to remove
   - Custom × icon using CSS pseudo-elements

3. **Helper Functions**:
   - `buildRangeLabel()`: Formats min/max price ranges
   - `buildFacetLabel()`: Determines if range or value label

## Quick Command Summary

```bash
# 1. Generate the component
npx sc-search new-component --language typescript --name Filter --styling tailwind --output src/core/atom --overwrite

# 2. Move to proper location (done via write to Filter.tsx)

# 3. Delete old files
Remove-Item -Path src/core/atom/Filters.tsx -Force
Remove-Item -Path src/core/atom/Filter -Recurse -Force

# 4. Fix TypeScript types (manual edit)
# - Add SelectedFacet type
# - Make facetLabel optional
# - Format ternary operators

# 5. Verify
npm run lint
```

## Integration Notes

The Filter component works automatically with the SearchInput template:
- Import it in SearchInput: `import Filter from './components/Filter'`
- Place it before SearchFacets in the layout
- No additional props needed - it reads from SDK context
- Automatically shows/hides based on filter state