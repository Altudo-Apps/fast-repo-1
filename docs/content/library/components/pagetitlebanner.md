# PageTitleBanner

The component is a flexible, layout-aware section designed to display rich content with optional media, supporting various layout and styling customizations. It includes support for variants, background themes, image ordering, and text alignment. While the heading level is fixed to `h1` (not configurable), the component is ideal for storytelling sections and marketing-focused pages.

## Field Details
**Template Name:** PageTitleBanner  
**Item Path:** `/sitecore/templates/Feature/FastLane/Renderings/PageTitleBanner/PageTitleBanner`

| Field Name | Sitecore Field Type | Description |
|------------|-------------------|-------------|
| Image | Image | The main visual/media used in the component for the background |
| Category | Single-Line Text | A small label typically shown above the title |
| Title | Single-Line Text | The main heading text for the section |
| IntroText | Rich Text | A descriptive body or intro content |
| CalltoActionLinkMain | General Link | Primary CTA button or link |
| CalltoActionLinkSecondary | General Link | Secondary CTA for optional interaction |
| Content | Rich Text | Main content / Page Content |
| NavigationDescription | Single-Line Text | Descriptive text or label for navigation elements. |


* * *

## Advanced Styling Options

### 1. Variant
Determines the structural layout of the section and whether it includes a media placeholder.

| Variant | Description |
|---------|-------------|
| default | A text-only layout. Content can be aligned to the left, center, or right. |
| ImageOrVideo | Split layout with a media (image/video) placeholder on one side and text on the other. |

screenshot:

![screenshot](/images/components/component-pagetitlebanner-1.png "screenshot")

* * *

### 2. Image Order
Applies to the `ImageOrVideo` variant and allows control over media positioning.

| Option | Description |
|--------|-------------|
| Left | Media appears on the left side. |
| Right | Media appears on the right side. |

Screenshot:

![screenshot](/images/components/component-pagetitlebanner-2.png "screenshot")

* * *

## Styling Options

### 1. Background Color
Defines the theme for the section's background.

| Option | Description |
|--------|-------------|
| Primary background | Applies the primary background color. |
| Secondary background | Applies the secondary background color. |
| Tertiary background | Applies the tertiary background color. |

Screenshot:

* * *

### 2. Content Alignment
Controls how the text content inside the section is aligned (if we are using the default variant then this option will work).

| Option | Description |
|--------|-------------|
| left | Aligns content to the left. |
| center | Aligns content to the center. |
| right | Aligns content to the right. |

Screenshot:

![screenshot](/images/components/component-pagetitlebanner-3.png "screenshot")

### 3. Component Top Spacing
Controls the top spacing above the component. The following options are available:

- Top Large Space
- Top Medium Space
- Top Low Space
- Top No Space

### 4. Component Bottom Spacing
Controls the bottom spacing below the component. The following options are available:

- Bottom Large Space
- Bottom Medium Space
- Bottom Low Space
- Bottom No Space
    

* * *
