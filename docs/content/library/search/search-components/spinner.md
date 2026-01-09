# Spinner Component

## Overview
A loading spinner component that displays an animated circular indicator with customizable sizes and accessibility features.

## Goal
Implement an accessible loading spinner that provides visual feedback during asynchronous operations, with support for different sizes and screen reader announcements.

## References

### Storybook Documentation
- **Component Reference**: [Sitecore Search - Spinner](https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/story/widget-components-spinner--page)
- Review the Storybook documentation for implementation details and examples

## Component Location
- **File Path**: `headapps/nextjs-starter/src/core/atom/Spinner.tsx`

## Dependencies
- React only (no external dependencies)
- Uses Tailwind CSS for styling and animations
- Pure presentational component

## Component Structure

### Conditional Rendering
- Component returns `null` when `loading` prop is `false`
- Only renders when loading state is active

### Size Variants
Three size options with corresponding dimensions:
- **Small (sm)**: 20px (h-5 w-5), 2px border
- **Medium (md)**: 24px (h-6 w-6), 2px border (default)
- **Large (lg)**: 32px (h-8 w-8), 2px border

### Accessibility Features
- Uses `role="status"` for ARIA semantics
- Includes `aria-live="polite"` for screen reader updates
- Screen reader only text with `sr-only` class
- Visual spinner marked with `aria-hidden="true"`

### Animation
- Uses Tailwind's `animate-spin` utility
- Circular border with transparent top for rotation effect
- Continuous rotation animation

## Props Interface

### Optional Props
- `loading` (boolean) - Whether spinner is active (default: `false`)
- `size` (SpinnerSize: 'sm' | 'md' | 'lg') - Size variant (default: `'md'`)
- `label` (string) - Screen reader announcement text (default: `'Loading…'`)
- `className` (string) - Additional CSS classes for wrapper

## Usage Patterns

### Loading State Indicator
Display spinner while fetching search results:
- Show when `isFetching` or `isLoading` is `true`
- Hide when data loaded
- Center in container or overlay

### Overlay Pattern
Full-screen loading overlay:
- Fixed positioned container
- Semi-transparent background
- Centered spinner
- Positioned above content with z-index

### Inline Pattern
Small spinner next to content:
- Use 'sm' size
- Inline display
- Part of button or list item

## Integration with Search Results

### Usage in searchInput.tsx
Display overlay during fetching:
- Check `isFetching` from `useSearchResults`
- Show full-screen overlay with spinner
- Position absolutely over results
- Semi-transparent white background (50% opacity)
- Center spinner vertically and horizontally
- Apply high z-index (z-30 for overlay, z-40 for spinner)

### Initial Loading
Display centered spinner during initial load:
- Check `isLoading` from `useSearchResults`
- Show full-screen spinner
- Center in viewport
- No overlay background (clean appearance)

## Accessibility Requirements
- ARIA role: "status"
- Live region: "polite" (doesn't interrupt)
- Screen reader text: Announces loading state
- Visual indicator: Hidden from assistive tech (aria-hidden)
- Maintains keyboard focus context

## Key Behaviors
1. Shows only when loading prop is true
2. Hides completely when loading is false (returns null)
3. Announces state changes to screen readers
4. Rotates continuously while visible
5. Inherits color scheme from parent
6. No layout shift when appearing/disappearing

## Testing Checklist
- [ ] Spinner shows when loading is true
- [ ] Spinner hides when loading is false
- [ ] All three sizes render correctly (sm, md, lg)
- [ ] Screen reader announces label text
- [ ] Animation rotates smoothly
- [ ] Dark mode colors work
- [ ] Custom className applies correctly
- [ ] No console errors or warnings
- [ ] Overlay pattern centers correctly
- [ ] Inline pattern displays inline

## Acceptance Criteria
✅ Pure React component (no external library)
✅ Three size variants (sm, md, lg)
✅ Conditional rendering based on loading prop
✅ Accessible with ARIA attributes
✅ Screen reader support with sr-only label
✅ Smooth rotation animation
✅ Dark mode support
✅ Customizable via className
✅ No layout shift on mount/unmount
✅ Matches Figma design patterns

## Common Issues & Solutions

**Issue**: Spinner not appearing
- **Solution**: Ensure `loading` prop is set to `true`

**Issue**: Screen reader not announcing
- **Solution**: Verify `role="status"` and `aria-live="polite"` are present

**Issue**: Animation not smooth
- **Solution**: Check that `animate-spin` Tailwind class is properly configured

**Issue**: Wrong size
- **Solution**: Pass correct size prop ('sm', 'md', or 'lg')

**Issue**: Spinner visible when it shouldn't be
- **Solution**: Ensure loading state is properly managed and set to false when complete

## Usage Examples

### Full-Screen Loading Overlay
```
Show spinner overlay while isFetching:
- Fixed positioned container (w-full h-full fixed top-0 left-0)
- Semi-transparent background (bg-white opacity-50)
- Centered spinner (absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%])
- High z-index (z-30 for overlay, z-40 for spinner)
```

### Initial Page Load
```
Show centered spinner on initial load:
- Full viewport centering (h-screen w-full)
- Flex center (flex justify-center items-center)
- No background overlay
- Large size for visibility
```

### Inline Loading
```
Show small spinner inline:
- Use 'sm' size
- Inline-block display
- Next to text or button
- Inherits parent text color
```

## Related Components
- `searchInput.tsx` - Uses spinner for loading and fetching states
- Custom loading overlays
- Button loading states
- Content placeholders

## Installation Note
This is a custom component. Check the Storybook documentation for Sitecore's reference implementation and patterns.
