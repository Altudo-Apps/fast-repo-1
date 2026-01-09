# Sort Order Component

## Overview
A dropdown component for selecting the sort order of search results.

## Goal
Implement a sort order selector that displays available sorting options and updates search results when selection changes.

## Figma Design Reference
- **Component**: [Figma Design - Sort Order](https://www.figma.com/design/M37xh0dT7qtPPiEDIRuA4X/XMC-Fastlane---Official-Altudo-Version?node-id=17811-6173&m=dev)
- **Arrow Icon**: [Figma Design - Chevron](https://www.figma.com/design/M37xh0dT7qtPPiEDIRuA4X/XMC-Fastlane---Official-Altudo-Version?node-id=17811-6185&m=dev)

## Storybook Reference
- [Sitecore Search UI - Sort Select](https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/docs/widget-components-sort-select--docs)

## Component Location
- **File Path**: `headapps/nextjs-starter/src/core/atom/SortOrder.tsx`

## Dependencies
- Import sort choice types from `@sitecore-search/react`
- Import `useSearchResultsActions` from `@sitecore-search/react`
- Import `SortSelect` from `@sitecore-search/ui`

## Component Structure

### Use Sitecore SortSelect Component
- Use `SortSelect.Root` with `defaultValue` and `onValueChange`
- Get `onSortChange` from `useSearchResultsActions`

### Trigger Button
- Use `SortSelect.Trigger` component
- Display "Sort by:" label prefix
- Show selected option label in `SortSelect.SelectValue`
- Add custom chevron icon (downward pointing)

### Custom Chevron Icon
- Create custom SVG chevron (not using Radix icon)
- Downward pointing chevron with rounded line caps
- Stroke width: 1.5px
- Size: 20x20px viewBox

### Dropdown Content
- Use `SortSelect.Content` for dropdown menu
- Contains `SortSelect.Viewport`
- Map through options to create `SortSelect.Option` items
- Each option displays `SortSelect.OptionText` with label

## Props Interface
- `options` (SearchResponseSortChoice[]) - Array of available sort options from search results
- `selected` (string) - Currently selected sort option name

## Key Styling Requirements
- Trigger button: No border, transparent background, inline text style
- Label: "Sort by:" prefix before selected value
- Selected value: Medium font weight
- Dropdown: White background with shadow and border
- No borders on trigger (clean text appearance)

## Integration with Search SDK
- Get `onSortChange` from `useSearchResultsActions`
- Pass sort choice object (not just name) to `onSortChange`
- Find selected option by matching name in options array
- Options passed from search results `sort.choices`

## Key Behaviors
1. Displays current sort selection
2. Opens dropdown on click
3. Updates results when option selected
4. Dropdown closes after selection
5. Shows sort options from search API
6. No default sort forced (uses backend default)

## Testing Checklist
- [ ] Dropdown opens on click
- [ ] Current selection displays correctly
- [ ] Clicking option changes sort order
- [ ] Results update after selection change
- [ ] Dropdown closes after selection
- [ ] "Sort by:" label shows
- [ ] Custom chevron displays
- [ ] Keyboard navigation works
- [ ] Dark mode works correctly

## Acceptance Criteria
✅ Uses Sitecore Search UI SortSelect component
✅ Text-based trigger (no border button style)
✅ "Sort by:" label prefix
✅ Custom chevron icon (not Radix)
✅ Integrates with useSearchResultsActions
✅ Passes full sort choice object to onSortChange
✅ Keyboard accessible
✅ Dark mode support

## Related Components
- `searchInput.tsx` - Main search component that includes SortOrder
- `CardViewSwitcher.tsx` - Sibling component in toolbar

## Implementation Code

```typescript
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
```

## How It Works

1. **Props Received**: Component gets `options` (sort choices) and `selected` (current sort name)
2. **Find Selected**: Uses `findIndex` to locate current sort option
3. **Get Label**: Extracts label from selected option for display
4. **SDK Hook**: Calls `useSearchResultsActions()` to get `onSortChange`
5. **User Clicks Trigger**: Dropdown opens showing all options
6. **User Selects**: Clicks an option in the dropdown
7. **SDK Action**: `onSortChange` called with **full option object** (not just name)
8. **Results Update**: SDK refetches with new sort order
9. **Dropdown Closes**: Auto-closes after selection

## Critical Implementation Details

### Value Handling (IMPORTANT!)

The `SortSelect` component from Sitecore UI expects:
- **Option `value`**: Pass the **entire `SearchResponseSortChoice` object**
- **`onValueChange`**: Pass `onSortChange` **directly** (it handles the object)

```typescript
// CORRECT - Pass entire object as value
<SortSelect.Option value={option} />

// CORRECT - Pass onSortChange directly
<SortSelect.Root onValueChange={onSortChange} />
```

**DO NOT** do this:
```typescript
// WRONG - Don't pass just the name
<SortSelect.Option value={option.name} />

// WRONG - Don't create a wrapper function
const handleChange = (name: string) => {
  onSortChange({ sortType: option }); // This won't work!
};
```

### Custom Chevron Icon

Per Figma design, use a **custom SVG chevron** (not Radix icon):

```typescript
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
```

**Specifications**:
- Size: 20x20px
- Stroke width: 1.5px
- Line caps: Rounded
- Uses `currentColor` for dark mode support

## Styling Breakdown

### Trigger (Text-based, No Border)

```css
inline-flex items-center          /* Inline layout with items */
text-sm                            /* Small text size */
text-gray-700 dark:text-gray-300  /* Text color */
hover:text-gray-900 dark:hover:text-gray-100  /* Hover color */
transition-colors                  /* Smooth color transition */
focus:outline-none                 /* No focus outline */
```

**Key**: NO `border`, NO `background`, NO `rounded` - Clean inline text appearance!

### Label & Selected Value

```typescript
<span className="font-normal">Sort by:</span>  // Normal weight label
<SortSelect.SelectValue className="font-medium ml-1">  // Medium weight value
  {selectedLabel}
</SortSelect.SelectValue>
```

### Dropdown Content

```css
bg-white dark:bg-gray-800                      /* Background colors */
border border-gray-200 dark:border-gray-700    /* Border */
rounded-md                                      /* Rounded corners */
shadow-lg                                       /* Box shadow */
overflow-hidden                                 /* Clip content */
z-50                                            /* Stack above content */
```

### Dropdown Options

```css
px-3 py-2 text-sm                              /* Padding and size */
text-gray-700 dark:text-gray-300               /* Text color */
hover:bg-gray-100 dark:hover:bg-gray-700       /* Hover background */
rounded cursor-pointer                          /* Rounded with pointer */
outline-none                                    /* No outline */
focus:bg-gray-100 dark:focus:bg-gray-700       /* Focus state */

/* Checked state */
data-[state=checked]:bg-gray-100 dark:data-[state=checked]:bg-gray-700
data-[state=checked]:font-medium               /* Bold when selected */
```

## Integration with SearchInput

The component is used in the SearchInput template:

```typescript
const {
  queryResult: {
    data: {
      sort: { choices: sortChoices = [] } = {},
    } = {},
  },
  state: { sortType },
} = useSearchResults();

// Inside render
<section className="flex justify-between text-xs">
  {totalItems > 0 && (
    <QueryResultsSummary ... />
  )}
  <SortOrder options={sortChoices} selected={sortType} />
</section>
```

**Data Sources:**
- `options`: From `queryResult.data.sort.choices` (array of sort options from API)
- `selected`: From `useSearchResults().state.sortType` (current sort type name)

## Sort Choice Object Structure

```typescript
type SearchResponseSortChoice = {
  name: string;    // Internal name (e.g., "featured_desc")
  label: string;   // Display label (e.g., "Featured")
  order: string;   // Sort order ("asc" or "desc")
  // ... other properties
};
```

## Accessibility Features

✅ **Keyboard Navigation**: Full keyboard support via Sitecore UI  
✅ **Focus Management**: Dropdown opens/closes with keyboard  
✅ **ARIA Attributes**: Sitecore UI handles ARIA automatically  
✅ **Screen Readers**: Announces current selection and options  
✅ **Focus Indicators**: Custom focus styles on options  

## Common Issues & Solutions

**Issue**: TypeScript error about `sortType` property
- **Solution**: Pass the entire option object as value, not just the name. Pass `onSortChange` directly to `onValueChange`.

**Issue**: Dropdown doesn't close after selection
- **Solution**: Ensure you're using `SortSelect.Root` with proper `onValueChange`. Sitecore UI handles closing automatically.

**Issue**: Selected value doesn't display
- **Solution**: Calculate `selectedLabel` from the options array using `findIndex` and display it in `SortSelect.SelectValue`.

**Issue**: Trigger looks like a button with border
- **Solution**: Use `inline-flex` with NO border classes. Should look like inline text, not a button.

**Issue**: Wrong icon used
- **Solution**: Don't use Radix icons. Create custom SVG chevron per Figma specs (20x20, stroke 1.5).

## Performance Notes

- Component hides when `options` array is empty
- Only re-renders when `options` or `selected` change
- Dropdown content rendered on-demand (not until opened)
- SDK handles all state management efficiently

## Testing Guide

### Manual Testing
1. Click trigger → Dropdown should open
2. Check trigger style → Should be inline text (no border/background)
3. Check label → Should say "Sort by:" with normal weight
4. Check selected value → Should show with medium weight
5. Check chevron → Custom SVG (not Radix icon)
6. Hover option → Background should change
7. Click option → Results should update and dropdown close
8. Check current selection → Should show new sort label
9. Toggle dark mode → All colors should adjust
10. Keyboard navigation → Arrow keys and Enter should work

### Expected Behavior
- First load → Shows default sort from backend
- No options → Component hidden
- After selection → Dropdown closes immediately
- Results → Update without page reload

## Notes

- This is a **custom implementation** using Sitecore UI components
- **Text-based trigger** (not button style) matches Figma exactly
- **Custom SVG chevron** per design specs (not Radix icon)
- **Pass entire object** as value, not just name
- **Direct SDK integration** - `onSortChange` passed directly
- **No wrapper function** needed for value change
- **Auto-close** handled by Sitecore UI
- **Default export** to match SearchInput import pattern