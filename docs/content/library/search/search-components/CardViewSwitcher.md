# Card View Switcher Component

## Overview
A toggle component for switching between grid and list views in search results, using icon-based buttons.

## Goal
Implement a view mode switcher that allows users to toggle between card (grid) and list display modes for search results.

## Figma Design Reference
- **Component**: [Figma Design - Card View Switcher](https://www.figma.com/design/M37xh0dT7qtPPiEDIRuA4X/XMC-Fastlane---Official-Altudo-Version?node-id=17811-6189&m=dev)

## Component Location
- **File Path**: `headapps/nextjs-starter/src/core/atom/CardViewSwitcher.tsx`

## Dependencies
- Import `ToggleGroupPrimitive` from `@radix-ui/react-toggle-group`
- Import `GridIcon` and `ListBulletIcon` from `@radix-ui/react-icons`

## Component Structure

### Use Radix Toggle Group
- Use `ToggleGroupPrimitive.Root` with `type="single"`
- Pass `value` and `onValueChange` props for controlled state
- Contains two `ToggleGroupPrimitive.Item` components

### Grid View Button
- Value: "grid"
- Icon: `GridIcon` - 2x2 grid of squares
- ARIA label: "Grid view"

### List View Button
- Value: "list"
- Icon: `ListBulletIcon` - horizontal lines with bullets
- ARIA label: "List view"

## Props Interface
- `value` (ViewMode: 'grid' | 'list') - Current active view mode
- `onChange` ((mode: ViewMode) => void) - Callback when view changes
- `className` (string, optional) - Additional CSS classes

## Key Styling Requirements
- Icons should use `currentColor` for stroke to support active state colors
- No borders on buttons
- Gap between buttons
- Active state indicated by accent colors

## Integration with Search Results
- Place in toolbar next to SortOrder component
- Receive viewMode state from parent (SearchResults page)
- Call onChange to update parent state
- Parent conditionally renders ArticleCard (grid) or ArticleHorizontalCard (list)

## Key Behaviors
1. Only one view mode active at a time (single selection)
2. Click toggles between grid and list views
3. Active state shown with different styling
4. Icons change based on selected view
5. State managed by parent component
6. Prevents deselection (always one selected)

## Testing Checklist
- [ ] Grid icon displays correctly
- [ ] List icon displays correctly
- [ ] Clicking toggles view mode
- [ ] Only one button active at a time
- [ ] onChange callback fires with correct value
- [ ] Keyboard navigation works
- [ ] ARIA labels present
- [ ] Dark mode works correctly

## Acceptance Criteria
✅ Uses Radix UI ToggleGroup primitive
✅ Icon-based buttons (no text labels)
✅ Grid and List icons from Radix
✅ Single selection (no deselection)
✅ Controlled component with value prop
✅ Keyboard accessible
✅ Dark mode support
✅ Integrates with search results view switching

## Related Components
- `searchInput.tsx` - Main search component that conditionally renders based on view mode
- `ArticleCard.tsx` - Grid view card component
- `ArticleHorizontalCard.tsx` - List view card component
- `SortOrder.tsx` - Sibling component in toolbar


document link: https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/docs/widget-components-cardviewswitcher--page