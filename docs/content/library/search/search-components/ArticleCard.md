# Article Card Component

## Overview
A vertical card component for displaying article search results in a grid view format, featuring an image, title, subtitle, author, description, and a "Read More" button.

## Goal
Implement a responsive vertical article card that displays search results in a grid layout, matching the Figma design specifications and using Sitecore Search UI components.

## References

### Storybook Documentation
- **Component Reference**: [Sitecore Search - Article Card](https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/docs/widget-components-article-card--page)
- Review the Storybook documentation carefully - it contains all details on using this component, code examples, and CLI commands for installation

### Figma Design
- **Design Link**: [Figma - Article Card Grid View](https://www.figma.com/design/M37xh0dT7qtPPiEDIRuA4X/XMC-Fastlane---Official-Altudo-Version?node-id=17811-5640&m=dev)

## Component Location
- **File Path**: `headapps/nextjs-starter/src/core/atom/ArticleCard.tsx`

## Dependencies
- Import `ActionProp` and `ItemClickedAction` types from `@sitecore-search/react`
- Import `ArticleCard` compound component from `@sitecore-search/ui`
- Import `CustomButtonLink` from `./CustomButtonLink`
- Import `LinkField` type from `@sitecore-content-sdk/nextjs`

## Component Structure

### Layout
- Vertical flex layout with image on top and content below
- Image section: Fixed height (192px / h-48)
- Content section: Flexible height with padding, grows to fill space
- Card has border, rounded corners, shadow, and overflow hidden

### Image Section
- Position: Top of card
- Height: Fixed at 192px (h-48)
- Image sizing: Full width and height, object-cover for proper aspect ratio
- Fallback: Use placeholder image if `image_url` is not available
- Default placeholder: "https://placehold.co/500x300?text=No%20Image"
- Background: Gray (gray-200) while loading

### Content Section
- Position: Below image with padding (p-4)
- Layout: Flex column, grows to fill remaining space
- Contains: Title, Subtitle (optional), Author (optional), Description (optional), Read More button

### Title Display
- Use `ArticleCard.Title` component from Sitecore UI
- Text: Display `article.name` or fallback to `article.title`
- Line clamp: 2 lines maximum (line-clamp-2)
- Spacing: Bottom margin (mb-2)

### Subtitle Display
- Use `ArticleCard.Subtitle` component from Sitecore UI
- Conditional: Only show if `article.subtitle` exists
- Spacing: Bottom margin (mb-2)

### Author Display
- Use `ArticleCard.Subtitle` component from Sitecore UI
- Conditional: Only show if `article.author` exists
- Spacing: Bottom margin (mb-2)

### Description Display
- Conditional: Only show if `article.description` exists
- Container: Plain div element
- Line clamp: 3 lines maximum (line-clamp-3)
- Positioning: Pushes to available space with mt-auto
- Spacing: Bottom margin (mb-3)

### Read More Button
- Use `CustomButtonLink` component
- Variant: "outline"
- Create `LinkField` object with article URL and title
- Display text: "Read More"
- Icon: Right arrow SVG (chevron right)
- Width: Full width (w-full)
- Click handler: Prevent default and call `onItemClick` with article details

## Props Interface

### Required Props
- `article` (object) - Article data with following fields:
  - `id` (string, required) - Unique article identifier
  - `name` (string, optional) - Article name/title (primary)
  - `title` (string, optional) - Alternative title field
  - `url` (string, optional) - Article URL for navigation
  - `source_id` (string, optional) - Source identifier for analytics
  - `image_url` (string, optional) - Article image URL
  - `author` (string, optional) - Article author name
  - `description` (string, optional) - Article description/excerpt
  - `subtitle` (string, optional) - Article subtitle

- `onItemClick` (ActionProp<ItemClickedAction>) - Click handler from Sitecore Search
- `index` (number) - Article index in search results list

### Optional Props
- `className` (string) - Additional CSS classes for customization

## Integration with Search Results

### Usage Context
- Used in grid view mode of search results
- Displayed when `viewMode === 'grid'` in search input component
- Rendered in a grid layout (1 column mobile, 2 columns tablet, 3 columns desktop)
- Mapped from articles array with index
- Receives `onItemClick` from `useSearchResults` hook

### Click Handling
- Create LinkField object with article URL, title, and "Read More" text
- On button click: prevent default navigation
- Call `onItemClick` with object containing:
  - `id`: article.id
  - `index`: article index in results
  - `sourceId`: article.source_id (for analytics)

### Data Mapping
- Map search result data to article object structure
- Handle optional fields gracefully (subtitle, author, description)
- Use primary title field with fallback to secondary
- Provide placeholder for missing images

## Accessibility Requirements
- Use semantic HTML structure
- Provide meaningful alt text for images (via ArticleCard.Image)
- Ensure button is keyboard accessible
- Maintain sufficient color contrast ratios
- Support screen reader navigation

## Responsive Design
- Grid layout: 1 column (mobile), 2 columns (sm), 3 columns (lg)
- Card adapts to container width
- Image maintains aspect ratio
- Text truncates with ellipsis
- Button remains accessible on touch devices

## Key Behaviors
1. Image loads with fallback placeholder if URL missing
2. Title displays with name as primary, title as fallback
3. Subtitle, author, and description show only if data exists
4. Description and title truncate with ellipsis (line-clamp)
5. Button click triggers search analytics via onItemClick
6. Card maintains consistent height in grid layout
7. Content section grows to fill available space

## Testing Checklist
- [ ] Card displays correctly with all fields populated
- [ ] Card displays correctly with minimal data (only title and ID)
- [ ] Fallback image shows when image_url is missing
- [ ] Optional fields (subtitle, author, description) show/hide correctly
- [ ] Read More button is clickable
- [ ] onItemClick called with correct parameters
- [ ] Grid layout works on mobile, tablet, desktop
- [ ] Dark mode colors applied correctly
- [ ] Text truncation works (line-clamp)
- [ ] Image aspect ratio maintained
- [ ] Button icon displays correctly
- [ ] Keyboard navigation works

## Acceptance Criteria
✅ Uses Sitecore Search UI ArticleCard component
✅ Vertical layout with image on top, content below
✅ Displays article title, optional subtitle, author, and description
✅ CustomButtonLink with "Read More" and arrow icon
✅ Image fallback for missing URLs
✅ Integrates with search SDK onItemClick
✅ Responsive grid layout (1/2/3 columns)
✅ Dark mode support throughout
✅ Line clamp on title (2 lines) and description (3 lines)
✅ Full width button at bottom
✅ Matches Figma design specifications
✅ Follows Storybook component patterns

## Related Components
- `ArticleHorizontalCard.tsx` - List view version of article card
- `searchInput.tsx` - Main search component that uses this card in grid view
- `CardViewSwitcher.tsx` - Toggle between grid and list views
- `CustomButtonLink` - Button component used for "Read More" action

## Installation Note
Check the Storybook documentation link above for CLI commands to scaffold this component if using Sitecore's component generation tools.

