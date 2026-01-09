# Article Horizontal Item Card Component

## Overview
A horizontal card component for displaying article search results in a list view format, featuring an image, title, author, description, and a "Read More" button.

## Goal
Implement a responsive horizontal article card that displays search results in a compact list format, matching the Figma design specifications and using Sitecore Search UI components.

## References

### Storybook Documentation
- **Component Reference**: [Sitecore Search - Article Horizontal Card](https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/story/widget-components-article-horizontal-card--page)
- Review the Storybook documentation carefully - it contains all details on using this component, code examples, and CLI commands for installation

### Figma Design
- **Design Link**: [Figma - Article Horizontal Card](https://www.figma.com/design/M37xh0dT7qtPPiEDIRuA4X/XMC-Fastlane---Official-Altudo-Version?node-id=17811-5640&m=dev)

## Component Location
- **File Path**: `headapps/nextjs-starter/src/core/atom/ArticleHorizontalCard.tsx`
- **Export Name**: `ArticleHorizontalItemCard` (default export)

## Dependencies
- Import `ActionProp` and `ItemClickedAction` types from `@sitecore-search/react`
- Import `ArticleCard` compound component from `@sitecore-search/ui`
- Import `CustomButtonLink` from `../atom/CustomButtonLink`
- Import `LinkField` type from `@sitecore-content-sdk/nextjs`

## Component Structure

### Layout
- Horizontal flex layout with image on left (25% width) and content on right (75% width)
- Image section: Fixed width at 25%, no shrinking
- Content section: Grows to fill remaining space with flex-col layout
- Max height constraint: 208px (max-h-52)
- Full width with responsive overflow handling

### Image Section
- Position: Left side, 25% width
- Styling: Fixed width, no flex shrinking, gray background
- Image sizing: Full height and width, object-cover for proper aspect ratio
- Fallback: Use placeholder image if `image_url` is not available
- Default placeholder: "https://placehold.co/500x300?text=No%20Image"

### Content Section
- Position: Right side with left padding (pl-4)
- Layout: Flex column with growing space
- Contains: Title, Author, Description (optional), Read More button

### Title Display
- Use `ArticleCard.Title` component from Sitecore UI
- Text: Display `article.name` or fallback to `article.title`
- Styling: Base text size (text-base), semibold font weight
- No wrapping or truncation

### Author Display
- Use `ArticleCard.Subtitle` component from Sitecore UI
- Text: Display `article.author`

### Description Display
- Conditional: Only show if `article.description` exists AND `displayText` prop is true
- Container: Plain div element
- Styling: Line clamp to 3 lines, small text, gray color with dark mode support
- Spacing: Margin top of 8px (mt-2)

### Read More Button
- Use `CustomButtonLink` component
- Variant: "outline"
- Create `LinkField` object with article URL and title
- Display text: "Read More"
- Icon: Right arrow SVG (chevron right)
- Positioning: Width auto (w-max), margin top 16px (mt-4)
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

- `onItemClick` (ActionProp<ItemClickedAction>) - Click handler from Sitecore Search
- `index` (number) - Article index in search results list

### Optional Props
- `className` (string) - Additional CSS classes for customization
- `displayText` (boolean) - Whether to show description text (default: false)

## Integration with Search Results

### Usage Context
- Used in list view mode of search results
- Displayed when `viewMode === 'list'` in search input component
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
- Handle optional fields gracefully with fallbacks
- Use primary title field with fallback to secondary
- Provide placeholder for missing images

## Accessibility Requirements
- Use semantic HTML structure
- Provide meaningful alt text for images (via ArticleCard.Image)
- Ensure button is keyboard accessible
- Maintain sufficient color contrast ratios
- Support screen reader navigation
- Add proper ARIA labels where needed

## Responsive Design
- Works in mobile, tablet, and desktop layouts
- Image maintains 25% width across breakpoints
- Content text wraps appropriately
- Button remains accessible on touch devices
- Card maintains max height to prevent layout shifts

## Key Behaviors
1. Image loads with fallback placeholder if URL missing
2. Title displays with name as primary, title as fallback
3. Description only shows when `displayText` prop is true
4. Button click triggers search analytics via onItemClick
5. Card maintains fixed max height regardless of content
6. Horizontal layout maintained across all screen sizes
7. Content truncates with ellipsis when exceeding max height

## Testing Checklist
- [ ] Card displays correctly with all fields populated
- [ ] Card displays correctly with minimal data (only title and ID)
- [ ] Fallback image shows when image_url is missing
- [ ] Description shows/hides based on displayText prop
- [ ] Read More button is clickable
- [ ] onItemClick called with correct parameters
- [ ] Horizontal layout maintained on mobile
- [ ] Dark mode colors applied correctly
- [ ] Text truncation works (description line clamp)
- [ ] Card max height prevents overflow
- [ ] Image aspect ratio maintained
- [ ] Button icon displays correctly
- [ ] Keyboard navigation works
- [ ] Screen reader announces content properly

## Acceptance Criteria
✅ Uses Sitecore Search UI ArticleCard component
✅ Horizontal layout with 25/75 split (image/content)
✅ Displays article title, author, and optional description
✅ CustomButtonLink with "Read More" and arrow icon
✅ Image fallback for missing URLs
✅ Integrates with search SDK onItemClick
✅ Responsive and maintains layout on mobile
✅ Dark mode support throughout
✅ Line clamp on description (3 lines max)
✅ Max height constraint (208px)
✅ Overflow handling prevents horizontal scroll
✅ Code lints clean with proper TypeScript types
✅ Matches Figma design specifications
✅ Follows Storybook component patterns

## Common Issues & Solutions

**Issue**: Card overflows container horizontally
- **Solution**: Ensure max-w-full is applied and parent has overflow-hidden

**Issue**: Image not maintaining aspect ratio
- **Solution**: Use object-cover and object-center classes

**Issue**: Description text not truncating
- **Solution**: Apply line-clamp-3 class and ensure container has proper width

**Issue**: Button not clickable
- **Solution**: Ensure z-index is not blocked by overlapping elements

**Issue**: Dark mode not applying
- **Solution**: Verify dark: prefixed classes are included

## Related Components
- `ArticleCard.tsx` - Grid view version of article card
- `searchInput.tsx` - Main search component that uses this card in list view
- `CardViewSwitcher.tsx` - Toggle between grid and list views
- `CustomButtonLink` - Button component used for "Read More" action

## Type Definition Example Structure
The component expects an article object with specific shape. Ensure your article type includes:
- Required: id (string)
- Optional: name, title, url, source_id, image_url, author, description (all strings)

The onItemClick prop should be typed as ActionProp from Sitecore Search SDK.

## Installation & Setup Steps

### Step 1: Generate Component Using Sitecore CLI
Use the Sitecore Search CLI to generate the ArticleHorizontalCard component:

```bash
npx sc-search new-component --language typescript --name ArticleHorizontalCard --styling tailwind --output src/core/atom --overwrite
```

This will generate the component at: `src/core/atom/ArticleHorizontalCard/index.tsx`

### Step 2: Restructure the Generated File
The CLI generates the component in a folder structure. Flatten it:

**Move and rename the file**:
1. The CLI creates: `src/core/atom/ArticleHorizontalCard/index.tsx`
2. Move the content to: `src/core/atom/ArticleHorizontalCard.tsx`
3. Delete the `ArticleHorizontalCard` folder

```bash
# PowerShell commands
# First, the content is copied (done via write operation)
# Then delete the folder:
Remove-Item -Path src/core/atom/ArticleHorizontalCard -Recurse -Force
```

### Step 3: Fix TypeScript Types
Replace the `any` type with a proper Article type:

```typescript
type Article = {
  id: string;
  name?: string;
  title?: string;
  url?: string;
  source_id?: string;
  image_url?: string;
  author?: string;
  description?: string;
};

type ArticleCardItemCardProps = {
  className?: string;
  displayText?: boolean;
  article: Article;  // Changed from 'any'
  onItemClick: ActionProp<ItemClickedAction>;
  index: number;
};
```

### Step 4: Format the Component
The generated component may have formatting issues. Fix them:

```typescript
// Properly format JSX elements
<ArticleCard.Title className="text-base">
  {article.name || article.title}
</ArticleCard.Title>

<ArticleCard.Subtitle className="mt-3 text-sm text-gray-500">
  {article.author}
</ArticleCard.Subtitle>

{article.description && displayText && (
  <div className="line-clamp-3 mt-3 text-sm">{article.description}</div>
)}
```

### Step 5: Verify No Linting Errors
Run the linter to ensure everything is clean:

```bash
npm run lint
```

## Generated Component Features

The CLI-generated component includes:

✅ **Sitecore UI Integration**: Uses `ArticleCard` from `@sitecore-search/ui`  
✅ **Horizontal Layout**: 25/75 image/content split  
✅ **Image Handling**: Fallback placeholder for missing images  
✅ **Click Analytics**: Integrated with `onItemClick` from Sitecore Search  
✅ **Accessibility**: Proper ARIA labels and semantic HTML  
✅ **Responsive Design**: Works across all screen sizes  
✅ **Dark Mode**: Built-in dark mode support  
✅ **Line Clamping**: Description truncates to 3 lines  
✅ **Hover Effects**: Scale and shadow effects on hover  
✅ **TypeScript Types**: Fully typed with proper interfaces  

## Quick Command Summary

```bash
# 1. Generate the component
npx sc-search new-component --language typescript --name ArticleHorizontalCard --styling tailwind --output src/core/atom --overwrite

# 2. Move to proper location (done manually or via script)
# Copy content from src/core/atom/ArticleHorizontalCard/index.tsx to src/core/atom/ArticleHorizontalCard.tsx

# 3. Delete the folder
Remove-Item -Path src/core/atom/ArticleHorizontalCard -Recurse -Force

# 4. Fix types and format (manual code edits)

# 5. Verify
npm run lint
```
