# Content Card

## Summary

The Content Card component is a flexible, highly customizable card used for showcasing structured content along with an image and call-to-action. It supports advanced styling options through props or Sitecore field controls, enabling layout customization, heading levels, image ordering, background themes, and link behavior. The component is built using ShadCN UI primitives and follows design patterns from Figma specifications.

## Implementation Overview

The ContentCard component supports four distinct visual variants based on Figma designs:
- **Standard Card**: Vertical layout with optional icon, dual button support
- **Card with Image**: Vertical layout with prominent image and single outline button
- **Altudo Card**: Vertical layout with image, text link, and primary button
- **Search Result**: Horizontal layout with fixed image width and compact button

## Figma Design References

- [Standard Card](https://www.figma.com/design/M37xh0dT7qtPPiEDIRuA4X/XMC-Fastlane---Official-Altudo-Version?node-id=268-1190&t=xq7tp1VrnRY4N69g-4)
- [Card with Image](https://www.figma.com/design/M37xh0dT7qtPPiEDIRuA4X/XMC-Fastlane---Official-Altudo-Version?node-id=12095-122422&t=xq7tp1VrnRY4N69g-4)
- [Altudo Card with Frame](https://www.figma.com/design/M37xh0dT7qtPPiEDIRuA4X/XMC-Fastlane---Official-Altudo-Version?node-id=14281-4806&t=xq7tp1VrnRY4N69g-4)
- [Search Result Card](https://www.figma.com/design/M37xh0dT7qtPPiEDIRuA4X/XMC-Fastlane---Official-Altudo-Version?node-id=12107-145101&t=xq7tp1VrnRY4N69g-4)

## Field Details

**Template Name:** Content Card  
**Item Path:** `/sitecore/templates/Feature/FastLane/Renderings/ContentCard/ContentCard`

| Field Name | Sitecore Field Type | Description |
|------------|-------------------|-------------|
| Title | Single-Line Text | Field for the section or item/page title |
| Category | Single-Line Text | Field to categorize the content |
| IntroText | Rich Text | Introductory text for the content |
| Icon | Image | An icon to accent the card (32x32px) |
| Image | Image | An image to visually represent the card content (16:9 aspect ratio) |
| CalltoActionLinkMain | General Link | Primary call-to-action link |
| CalltoActionLinkSecondary | General Link | Secondary call-to-action link |

## Advanced Styling Options

### 1. Card Orientation

**Rendering Parameter:** `CardOrientation`  
**Description:** Determines the layout direction of the image and text content.

| Option | Description | Use Case |
|--------|-------------|----------|
| vertical | Image and text stack vertically | Standard content cards, feature highlights |
| horizontalflex | Image occupies 30% of the card width, and text occupies 70% | Content with supporting imagery |
| horizontalequal | Image and text split the card width equally (50% - 50%) | Balanced content presentation |

* screenshot:
    ![screenshot](/images/components/component-content-card-orientation.png "screenshot")

### 2. Image Order

**Rendering Parameter:** `ImageOrder`  
**Description:** Controls the positioning of the image relative to the text when in horizontal orientations.

| Option | Description |
|--------|-------------|
| Left | Image appears on the left side |
| Right | Image appears on the right side |

**Note:** Only applies to horizontal layout orientations.

* screenshot:
    ![screenshot](/images/components/component-content-card-image-order.png "screenshot")


### 3. Heading Tag

**Rendering Parameter:** `HeaderTag`  
**Description:** Allows the content editor to control the semantic heading level of the card title for SEO and structure.

| Tag | Usage |
|-----|-------|
| h2 to h6 | Choose between h2, h3, h4, h5, or h6 depending on the page hierarchy |

**Default:** `h3`

* screenshot:
    ![screenshot](/images/components/component-content-card-heading-tag.png "screenshot")


### 4. Link Type

**Rendering Parameter:** `LinkType`  
**Description:** Specifies how links or interactions are applied within the card.

| Option | Description |
|--------|-------------|
| Button | Displays a prominent CTA button for the main cta |
| Card | Makes the entire card clickable like a link (using the main cta) |
| Link | Displays a regular text link for the main cta with underline |

* screenshot:
    ![screenshot](/images/components/component-content-card-link-type.png "screenshot")


## Button Behavior and Styling

### Button Variant Logic

The component automatically determines the correct button variant based on content:

| Scenario | Button Variant | Appearance |
|----------|----------------|------------|
| Card with image + single CTA | `outline` | White background with border |
| Card without image + single CTA | `default` | Blue primary background |
| Card with dual CTAs | Primary: `default`, Secondary: `outline` | Blue + white buttons |

### Button Width Behavior

| Layout | CTA Count | Button Width | Container Layout |
|--------|-----------|--------------|------------------|
| Vertical | Single | Full width | No justify-between |
| Vertical | Dual | Auto width | justify-between |
| Horizontal | Single | Auto width | No justify-between |
| Horizontal | Dual | Auto width | justify-between |

### Critical Implementation Details

- **Full-width buttons require both** the `SitecoreLink` wrapper AND the `Button` to have `w-full` class
- **Container layout** must conditionally apply `justify-between` only when there are dual CTAs
- **Arrow icons** automatically appear on buttons when an image is present
- **Card as link**: When `LinkType` is set to `Card` and a valid `href` exists, the entire card becomes clickable in non-edit mode. In editing mode, the card is rendered without the link wrapper.

## Styling Options

### 1. Background Color

**Description:** Changes the background theme of the card to match the design guidelines.

| Option | Description | CSS Classes |
|--------|-------------|-------------|
| Primary background | Applies the primary theme background | `bg-primary text-primary-foreground` |
| Secondary background | Applies the secondary theme background | `bg-secondary text-secondary-foreground` |
| Tertiary background | Applies the tertiary theme background | `bg-tertiary text-tertiary-foreground` |

### 2. Component Top Spacing

**Description:** Controls the top spacing above the component.

| Option | CSS Class |
|--------|-----------|
| Top Large Space | `top-large-space` |
| Top Medium Space | `top-medium-space` |
| Top Low Space | `top-low-space` |
| Top No Space | `top-no-space` |

### 3. Component Bottom Spacing

**Description:** Controls the bottom spacing below the component.

| Option | CSS Class |
|--------|-----------|
| Bottom Large Space | `bottom-large-space` |
| Bottom Medium Space | `bottom-medium-space` |
| Bottom Low Space | `bottom-low-space` |
| Bottom No Space | `bottom-no-space` |

## Design Pattern Examples

### Standard Card (No Image, Dual CTAs)
- **Structure:** Icon → Category → Title → Description → Dual Buttons
- **Primary Button:** Blue background (`default` variant)
- **Secondary Button:** White background with border (`outline` variant)
- **Layout:** Buttons side-by-side with `justify-between`

### Card with Image (Single CTA)
- **Structure:** Icon → Category → Title → Description → Image → Button
- **Button:** White background with border (`outline` variant)
- **Layout:** Full-width button with arrow icon
- **Image:** 16:9 aspect ratio, full card width

### Altudo Card (Image + Text Link + Button)
- **Structure:** Category → Image → Title → Description → Text Link → Button
- **Text Link:** Underlined, appears in content flow
- **Button:** Blue background (`default` variant), full width

### Search Result (Horizontal Layout)
- **Structure:** Fixed Image (314px) → Content (Icon, Category, Title, Description, Button)
- **Button:** White background with border (`outline` variant)
- **Layout:** Compact button, auto width

## Technical Implementation

### Typography Classes
- **Category:** `text-sm font-medium text-foreground font-satoshi`
- **Title:** `text-2xl font-semibold text-card-foreground tracking-tight font-Zodiak`
- **Description:** `text-muted-foreground font-satoshi` (14px vertical, 16px horizontal)

### Spacing Classes
- **Card Padding:** `p-6` (24px)
- **Section Gaps:** `gap-6` (24px)
- **Content Gaps:** `gap-1.5` (6px)
- **Button Container:** `gap-2` (8px)

### Interactive States
- **Card Hover:** `hover:shadow-md`
- **Clickable Card:** `cursor-pointer hover:shadow-lg`
- **Button Focus:** `focus-visible:ring-1 focus-visible:ring-ring`

## Usage Notes

- **Orientation options** are especially useful in responsive designs to switch layouts on different breakpoints
- **Image Order** is only relevant when using horizontal layouts
- **Heading Tag** selection ensures proper semantic HTML, aiding accessibility and SEO
- **Background Color** allows designers to match the card with branding themes or page context
- **Button variants** automatically adjust based on content type (image presence and CTA count)
- **Full-width behavior** only applies to single CTAs in vertical layouts

## Accessibility Features

- Semantic heading structure (h2-h6)
- Proper alt text for images and icons
- Keyboard navigation support
- ARIA labels for interactive elements
- Sufficient color contrast ratios
- Touch-friendly button sizes (minimum 44px)

## Browser Compatibility

- Supports all modern browsers
- Responsive design works across mobile, tablet, and desktop
- Graceful degradation for older browsers
- Optimized for Sitecore Experience Editor

## Performance Considerations

- Lazy loading for images
- Efficient re-renders with proper React patterns
- WebP image format support
- Minimal CSS bundle impact
- Tree-shaking friendly imports
 
### Screenshots
* vertical (orientation), button (link type):
    ![vertical button](/images/components/component-content-card-screenshot-vertical-button.png "vertical button")

* vertical, no link, with icon
    ![vertical, no link, with icon](/images/components/component-content-card-screenshot-vertical-no-link-icon.png "vertical, no link, with icon")

* horizontalflex, button
    ![horizontalflex, button](/images/components/component-content-card-screenshot-horizontalflex-button.png "horizontalflex, button")

* horizontalflex, right image
    ![horizontalflex, right image](/images/components/component-content-card-screenshot-horizontalflex-right.png "horizontalflex right image")

* horizontalequal, left image
    ![horizontalflex, right image](/images/components/component-content-card-screenshot-horizontalequal-left.png "horizontalequal left image")

* horizontalequal, right image
    ![horizontalflex, right image](/images/components/component-content-card-screenshot-horizontalequal-right.png "horizontalequal right image")

