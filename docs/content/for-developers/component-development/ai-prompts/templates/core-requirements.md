## Requirements

### Core Development Standards
- **Do NOT** reuse or reference any existing implementation of this component
- Use the `cn` helper from `@utils.tsx` for className merging
- All styling must use Tailwind classes, referencing variables from the project's Tailwind config
- Reference and compose as many ShadCN UI primitives as possible (e.g., Button, Card, Input, etc.) to maximize re-use, accessibility, and themability: `@/ui`

### Sitecore Content SDK Integration
- All Sitecore fields must be editable using **Sitecore Content SDK primitives** (Text, RichText, etc.) from `@sitecore-content-sdk/nextjs`
- Use `SitecoreImage` from `@Images.tsx` and `SitecoreLink` from `@Link.tsx` for images and links - SitecoreImage and SitecoreLink already have page mode detection built in.
- Use `useSitecore()` hook for page context access (replaces JSS `useSitecoreContext`)
- Handle **enhanced page mode detection**: `isEditing`,  `isPreview`, `isNormal`
- Implement proper field rendering with Content SDK components
- Include proper TypeScript interfaces for all Content SDK field types

### Sitecore XM Cloud Styling
In Sitecore XM Cloud, styling options are provided as styles (space-separated class names) and advanced options as params. The entire list of styles available to all components in the solution are defined in `@/Styles`. Styles are output via the `styles` prop as classes.

**Important**: The keys (that you will find in the yml) provide context, but are only used in the Page Builder UI, not in code. For example:
- In the Components Top Spacing style option, "Top Large Space" is only shown in the Authoring UI of the Page Builder app (editing UI) as a dropdown option - in the code, the styles will actually show up in props styles as indicated by the Value hint in the yml. For Top Large Space - this is `"top-large-space"`
- For Components Bottom Spacing, Bottom Medium Space option, this is `"bottom-large-space"`
- For Background color, Primary background option, this is `"bg-primary text-primary-foreground"`

### Business Logic & Documentation
- Reference the `@{ComponentName}.MD` file for all business logic, field definitions, and variant/option details
- The component must support all visual and interactive states shown in the Figma design(s) and described in the requirements MD file

### Design & Accessibility
- You should prefer themability - and always use the semantic colors and semantic fonts as defined in the `tailwind.config.ts` - never the raw tailwind colors
- The component must be fully responsive and accessible
- Place the file in `src/components/{ComponentName}.tsx`

## Critical Implementation Patterns

### Content SDK Page Mode Detection
```typescript
// CRITICAL: Use Content SDK's enhanced mode detection
import { useSitecore } from '@sitecore-content-sdk/nextjs';

const { page } = useSitecore();

if (page.mode.isEditing) {
  // Content editing mode - show editable experience
}

if (page.mode.isPreview) {
  // Preview mode for content review
}

if (page.mode.isNormal) {
  // Normal website view
}
```

### Content SDK Field Rendering
```typescript
// CRITICAL: Use Content SDK field components, not JSS
import { Text, RichText, DateField, useSitecore } from '@sitecore-content-sdk/nextjs';

// Text fields
<Text field={fields.Title} tag="h2" className="semantic-text-classes" />

// Rich text fields
<RichText field={fields.Description} />

// Date fields with custom formatting  
<DateField 
  field={fields.PublishedDate}
  render={(date) => formatSitecoreDate(date?.toISOString() ?? '')}
/>

// Handle page context for fallbacks
const { page } = useSitecore();
if (!fields?.Title?.value && !page.layout.sitecore?.route?.fields?.Title) {
  return <div>[Component Title]</div>; // Meaningful fallback
}
```

### Checkbox Field Handling
```typescript
// CRITICAL: Sitecore checkbox fields are passed as strings, not booleans
// Checked checkboxes have value "1", unchecked have value "0", null, or undefined

// Component parameters (from component params)
interface ComponentParams {
  HideImage?: string;    // "1" for checked, "0" or undefined for unchecked
  HideBorder?: string;   // "1" for checked, "0" or undefined for unchecked
  SwapImage?: string;    // "1" for checked, "0" or undefined for unchecked
}

// Convert string checkbox values to booleans
const hideImage = HideImage === '1';
const hideBorder = HideBorder === '1';
const swapImage = SwapImage === '1';

// Use the boolean values in your component logic
const cardClasses = cn(
  'base-card-styles',
  !hideBorder && 'border border-border',
  // ... other conditional classes
);
```

### Button/Link Implementation (MUST FOLLOW)

#### Button Variant Logic
```typescript
// CRITICAL: Analyze Figma designs to determine correct button variants
// Different designs may require different variant logic
const buttonVariant = [analyze your specific design conditions] ? 'outline' : 'default';
```

#### Full Width Elements Implementation
```typescript
// CRITICAL: Both wrapper AND child element need w-full for true full-width
const isFullWidth = [your condition logic];

<Button
    variant={buttonVariant}
    className={cn('your-classes', isFullWidth && 'w-full')}
>
  <SitecoreLink 
  field={linkField} 
  className={isFullWidth ? 'w-full' : ''}
  >
    {content}
  </SitecoreLink>
</Button>
```

### SitecoreLink Component Usage
// CRITICAL: shows correct usage in buttons
Provide working examples of how SitecoreLink should be used:

```typescript
// ✅ Correct usage in buttons
<Button asChild>
  <SitecoreLink field={linkField}>
    {linkField.value?.text}
  </SitecoreLink>
</Button>

// ❌ NEVER do this (causes [object Object])
<SitecoreLink field={linkField}>
  <Text field={linkField} />
</SitecoreLink>

### Reference Implementation
Before implementing, examine these existing working components in the codebase:
- Look at `src/core/atom/Link.tsx` to understand SitecoreLink behavior
- Check existing button + link combinations in other components
- Use `grep_search` to find working SitecoreLink patterns: `<SitecoreLink.*field.*>`
```

### Link Field Text Access
For Content SDK link fields, access text values using:
- `linkField.value?.text` - Gets the link text
- `linkField.value?.href` - Gets the URL
- Never nest `<Text field={linkField} />` inside `<SitecoreLink>`
```

**Rules:**
- **Both** wrapper element AND child element need `w-full` class for full-width behavior
- Consider when full-width is appropriate based on your design
- Test that parent containers don't constrain width

#### Content SDK Link Handling
```typescript
// CRITICAL: Content SDK link patterns for editing vs normal mode
const shouldWrapWithLink = !page.mode.isEditing && fields.TargetUrl?.value?.href;

return shouldWrapWithLink ? (
  <SitecoreLink field={fields.TargetUrl}>
    <ComponentContent />
  </SitecoreLink>
) : (
  <ComponentContent />
);
```

#### Container Layout Logic
```typescript
// CRITICAL: Conditional container layout for proper element behavior
<div
  className={cn(
    'flex gap-2 w-full',
    hasMultipleElements ? 'justify-between' : ''
  )}
>
  {renderElements()}
</div>
```

### Layout Implementation (MUST FOLLOW)

#### Conditional Layout Classes
```typescript
// CRITICAL: Layout must adapt based on parameters and content
const layoutClasses = cn(
  baseClasses,
  condition1 ? 'conditional-class-1' : 'conditional-class-2',
  condition2 && 'additional-class'
);
```

#### Responsive Element Handling
```typescript
// CRITICAL: Proper responsive behavior and aspect ratios
<div className="relative w-full" style={{ aspectRatio: 'X/Y' }}>
  <SitecoreImage 
    field={imageField} 
    className="w-full h-full object-cover" 
    fill={true}
  />
</div>
```

### Typography Implementation (MUST FOLLOW)

#### Dynamic Heading Tags
```typescript
// CRITICAL: Constrain to valid heading elements for accessibility
const HeadingTag = (headerTag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') || 'h2';

<HeadingTag className="semantic-text-classes">
  <Text field={titleField} />
</HeadingTag>
```

#### Semantic Design Tokens
```typescript
// CRITICAL: Use semantic design tokens, not raw values
const semanticClasses = cn(
  'text-foreground',        // Not text-gray-900
  'bg-card',                // Not bg-white
  'border-border',          // Not border-gray-200
  'text-muted-foreground'   // Not text-gray-500
);
```

### Testing with Content SDK
```typescript
// CRITICAL: Mock Content SDK properly, not JSS
import { vi } from 'vitest';

vi.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: vi.fn(() => ({
    page: {
      mode: {
        isEditing: false,
        isDesignLibrary: false,
        isPreview: false,
        isNormal: true,
      },
      layout: { sitecore: { route: { fields: {} } } }
    }
  })),
  Text: ({ field, tag: Tag = 'div' }) => <Tag>{field?.value}</Tag>,
  RichText: ({ field }) => <div dangerouslySetInnerHTML={{ __html: field?.value }} />,
}));
```

## Common Pitfalls to Avoid

### 1. Content SDK Migration Issues
- ❌ Using JSS hooks (`useSitecoreContext`) instead of Content SDK (`useSitecore`)
- ❌ Using old JSS field rendering patterns instead of Content SDK components

### 2. Width and Layout Issues
- ❌ Only applying `w-full` to child elements but not wrapper elements
- ❌ Using layout classes that constrain desired behavior (e.g., `justify-between` with single elements)
- ❌ Not considering parent-child width relationships
- ❌ Hard-coding layout orientations instead of making them configurable

### 3. Button/Interactive Element Issues
- ❌ Not analyzing Figma designs for proper variant usage
- ❌ Using generic button styles instead of design-specific variants
- ❌ Missing hover, focus, and active states
- ❌ Poor touch target sizes on mobile

### 4. Typography and Design Token Issues
- ❌ Using hard-coded HTML tags instead of dynamic elements
- ❌ Not using semantic color tokens from design system
- ❌ Inconsistent font families and sizing
- ❌ Missing responsive typography considerations

### 5. Sitecore Integration Issues
- ❌ Not wrapping component with `withDatasourceCheck()` (this is available via: `import { withDatasourceCheck } from '@sitecore-content-sdk/nextjs';`)
- ❌ Missing field null/empty checks
- ❌ Not handling editing mode properly
- ❌ Forgetting to apply Sitecore styles from `rendering.params.styles`

### 6. Accessibility Issues
- ❌ Missing alt text for images
- ❌ Improper heading hierarchy
- ❌ No keyboard navigation support
- ❌ Insufficient color contrast
- ❌ Missing ARIA labels for complex interactions

### CRITICAL: Content SDK Link Pitfalls to Avoid

❌ **NEVER DO**:
- `<SitecoreLink><Text field={linkField} /></SitecoreLink>` (causes "[object Object]")  
- `<Button><SitecoreLink /></Button>` (breaks button styling)
- Accessing `linkField.text` directly (use `linkField.value?.text`)

✅ **ALWAYS DO**:
- `<Button asChild><SitecoreLink>{field.value?.text}</SitecoreLink></Button>`
- Test link rendering early in development
- Verify both editing and normal modes work
```

## Design Pattern Analysis Framework

### Before Implementation, Analyze:

1. **Visual Hierarchy**: What are the primary, secondary, and tertiary elements?
2. **Interactive Elements**: What button styles, hover states, and variants are shown?
3. **Layout Patterns**: How do elements flow in different screen sizes and orientations?
4. **Spacing System**: What consistent gaps, padding, and margins are used?
5. **Typography Patterns**: What heading levels, text sizes, and font weights are applied?
6. **Responsive Behavior**: How does the design adapt across different breakpoints?

### Implementation Planning Template

| Design Variant | Layout Type | Key Elements | Interactive Patterns | Special Considerations |
|----------------|-------------|--------------|---------------------|----------------------|
| Variant 1 | [layout] | [elements] | [interactions] | [notes] |
| Variant 2 | [layout] | [elements] | [interactions] | [notes] |

## Implementation Checklist

### Pre-Implementation
- [ ] Analyze all Figma variants for patterns and edge cases
- [ ] Identify button/link variants and states for each design
- [ ] Map layout patterns and responsive behavior
- [ ] Define typography hierarchy and semantic class usage
- [ ] Plan conditional logic for different variants and states
- [ ] Review `@{ComponentName}.MD` for business requirements
- [ ] Use `grep_search` to find existing SitecoreLink usage patterns
- [ ] Read `src/core/atom/Link.tsx` to understand wrapper behavior  
- [ ] Search for working button + link combinations: `grep_search "Button.*asChild.*SitecoreLink"`

### During Implementation
- [ ] Use proper Content SDK imports and patterns
- [ ] Implement `useSitecore()` hook correctly
- [ ] Handle all page modes (editing, Design Library, preview, normal)
- [ ] Use proper TypeScript interfaces for Content SDK fields
- [ ] Implement conditional styling based on design analysis
- [ ] Apply semantic design tokens consistently
- [ ] Handle full-width elements correctly (wrapper + child)
- [ ] Include proper field validation and null checks
- [ ] Test responsive behavior across breakpoints

### Post-Implementation Validation
- [ ] Test all Figma design variants match implementation
- [ ] Verify interactive states work correctly
- [ ] Confirm responsive behavior is appropriate
- [ ] Validate accessibility compliance (keyboard, screen readers, contrast)
- [ ] Test in Sitecore editing mode and ensure fields are editable
- [ ] Test Design Library mode rendering
- [ ] Check that conditional logic handles edge cases properly
- [ ] Verify Content SDK field rendering works correctly
- [ ] Test that link text appears correctly (not "[object Object]")

## Deliverable
Output a single, production-ready file with all necessary imports, types, and logic. The component should match the Figma designs as closely as possible while supporting all required variants and maintaining full Sitecore XM Cloud compatibility with Content SDK integration.

## Usage Instructions

### 1. Replace Placeholders
- `{ComponentName}` with your actual component name (e.g., "HeroBanner", "ProductCard", "Testimonial")
- `[Figma URL 1]`, `[Figma URL 2]`, etc. with actual Figma URLs
- `@{ComponentName}.MD` with the actual markdown file name

### 2. Analyze Figma Designs First
- Study all variants before coding
- Map visual patterns, interactions, and responsive behavior
- Identify conditional logic requirements
- Plan semantic class usage

### 3. Follow Content SDK Patterns
- Use `useSitecore()` instead of JSS patterns
- Implement proper page mode detection
- Use Content SDK field components
- Handle Design Library mode appropriately

### 4. Follow Implementation Patterns
- Use the provided patterns for width, layout, and typography
- Reference the pitfalls list to avoid common mistakes
- Apply the validation checklist before considering complete

### 5. Example Usage
```markdown
# Create a new HeroBanner component using ShadCN and Tailwind CSS, based on the Figma design(s) at the following URL(s):
@https://www.figma.com/design/.../HeroBanner?node-id=123-456

# Requirements:
[rest of template with HeroBanner.MD reference]
```

## Key Benefits

1. **Content SDK Integration**: Updated for latest Sitecore patterns
2. **Prevents Common Issues**: Includes patterns to avoid width, layout, and interaction problems
3. **Design Analysis Framework**: Systematic approach to understanding Figma designs
4. **Quality Assurance**: Comprehensive validation checklist for consistent results
5. **Best Practices**: Enforces proper use of ShadCN, Tailwind, and Sitecore Content SDK
6. **Accessibility Focus**: Ensures components meet accessibility standards
7. **Design System Compliance**: Promotes consistent use of semantic tokens

This template helps create high-quality components that match Figma designs exactly while avoiding common implementation pitfalls and leveraging the latest Content SDK capabilities. 