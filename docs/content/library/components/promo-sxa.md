# Promo (SXA)

**Promo -** The Promo component is a flexible, highly customizable SXA (Sitecore Experience Accelerator) component that displays promotional content with an icon, text, and optional links. It's designed to showcase features, announcements, or call-to-action content in a visually appealing format.

**Description:** A dynamic promotional component that renders promotional content from Sitecore's content with consistent formatting, performance optimization, and editing support for content managers.

**Functionality:** Dynamically renders promotional content based on field configuration, supporting various content layouts, optional icons and links, and responsive design patterns.

## Component Details

**Template Name:** JSON Rendering  
**Item Path:** `/sitecore/layout/Renderings/Feature/JSS Experience Accelerator/Page Content/Promo`

## Field Details

| Field Name | Sitecore Field Type | Description | Required |
| :-- | :-- | :-- | :-- |
| `PromoIcon` | Image | Icon or image to accompany the promotional content | No |
| `PromoText` | Rich Text | Primary promotional text content | Yes |
| `PromoLink` | General Link | Call-to-action link for the promotion | No |
| `PromoText2` | Rich Text | Secondary text content (used in WithText variant) | No |
| `PromoText3` | Rich Text | Tertiary text content (used in advanced variants) | No |

## Advanced Display Options

### 1. Content Variants
The component supports multiple content layout variants for different promotional needs.

| Variant | Description | Use Case |
|---------|-------------|----------|
| **Default** | Single text with icon and link | Simple promotions, feature highlights |
| **WithText** | Two text fields for detailed messaging | Multi-point messaging, detailed features |
| **Advanced** | Three text fields with enhanced layout | Complex promotional content, product showcases |

### 2. Icon Integration
The `PromoIcon` field enables visual enhancement of promotional content.

| Icon Type | Use Case | Recommended Size |
|-----------|----------|------------------|
| **Icons** | Feature highlights, benefits | 48x48px, 64x64px |
| **Small images** | Product features, services | 100x100px |
| **Illustrations** | Complex concepts, processes | 200x200px |

### 3. Link Behavior
The `PromoLink` field provides call-to-action functionality for promotional content.

| Condition | Behavior | Result |
|-----------|-----------|---------|
| `PromoLink` exists | Full link functionality | Clickable promotional content |
| No `PromoLink` | Static display | Information-only promotion |
| Link with text | Enhanced user experience | Clear call-to-action |

## Styling Options

### 1. Component Wrapper Styles
Use the **`styles`** field to apply global classes to the root container. Common uses include:
- Margin utilities: `my-4`, `mt-5`
- Background colors: `bg-light`, `bg-secondary`
- Border utilities: `border`, `border-top`
- Spacing: `p-4`, `py-3`

### 2. Content Layout Modes
Different rendering modes for various use cases and styling needs.

| Mode | Description | CSS Classes |
|------|-------------|-------------|
| **Standard Promo** | Basic icon, text, and link | `component promo` |
| **Card Layout** | Enhanced card styling | `component promo shadow-lg rounded-lg` |
| **Hero Promo** | Large promotional display | `component promo hero-promo` |
| **Inline Promo** | Compact inline styling | `component promo inline` |

### 3. Content Styling
Styling applied to the promotional content area for consistent layout and appearance.

| Class | Purpose | Result |
|-------|---------|--------|
| `component-content` | Content wrapper | Proper spacing and layout |
| `field-promoicon` | Icon container | Icon positioning and sizing |
| `promo-text` | Text content area | Text layout and styling |
| `field-promotext` | Primary text styling | Main promotional message |
| `field-promolink` | Link styling | Call-to-action appearance |

## Screenshots

1. **Promo Component Overview**
   ![screenshot](/images/components/component-promo.png "screenshot")