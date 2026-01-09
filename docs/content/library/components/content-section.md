# Content Section

The **Content Section** component is a flexible, layout-aware section component that allows rich content with optional media to be displayed with various layout and styling customizations. It supports variants , heading level configuration, image ordering, background themes, and text alignment — making it ideal for storytelling sections or marketing pages.

## Field Details

**Template Name:** Content Section  
**Item Path:** `/sitecore/templates/Feature/FastLane/Renderings/ContentSection/ContentSection`

| Field Name | Sitecore Field Type | Description |
|------------|-------------------|-------------|
| Image | Image | The main visual/media used in the component |
| Category | Single-Line Text | A small label typically shown above the title |
| Title | Single-Line Text | The main heading text for the section |
| IntroText | Rich Text | A descriptive body or intro content |
| CalltoActionLinkMain | General Link | Primary CTA button or link |
| CalltoActionLinkSecondary | General Link | Secondary CTA for optional interaction |

* * *

## Advanced Styling Options

### 1. Variant
Determines the structural layout of the section and whether it includes a media placeholder.

| Variant | Description |
|---------|-------------|
| default | A text-only layout. Content can be aligned to the left, center, or right. |
| ImageOrVideo | Split layout with a media (image/video) placeholder on one side and text on the other. |

* screenshot:
    ![screenshot](/images/components/component-content-section-variant.png "screenshot")


* * *

### 2. Heading Tag
Controls the semantic tag used for the section title, allowing content editors to manage heading hierarchy.

| Tag | Usage |
|-----|-------|
| h2 to h6 | Select from h2, h3, h4, h5, or h6 as appropriate for SEO and accessibility. |

* screenshot:
    ![screenshot](/images/components/component-content-section-heading-tag.png "screenshot")

* * *

### 3. Image Order
Applies to the `ImageOrVideo` variant and allows control over media positioning.

| Option | Description |
|--------|-------------|
| Left | Media appears on the left side. |
| Right | Media appears on the right side. |

* screenshot:
    ![screenshot](/images/components/component-content-section-image-order.png "screenshot")

* * *

## Styling Options

### 1. Background Color
Defines the theme for the section's background.

| Option | Description |
|--------|-------------|
| Primary background | Applies the primary background color. |
| Secondary background | Applies the secondary background color. |
| Tertiary background | Applies the tertiary background color. |

* * *

### 2. Content Alignment
Controls how the text content inside the section is aligned.

| Option | Description |
|--------|-------------|
| left | Aligns content to the left. |
| center | Aligns content to the center. |
| right | Aligns content to the right. |

* screenshot:
    ![screenshot](/images/components/component-content-section-content-alignment.png "screenshot")

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

### Screenshots of component with some advance parameter and styling option:
1\. `ImageOrVideo` variant , `right` image order, `h2` heading tag, `Tertiary background`

* screenshot:
    ![screenshot](/images/components/component-content-section-screenshot-1.png "screenshot")

2\. `ImageOrVideo` varient, `Left` image order , without background color

* screenshot:
    ![screenshot](/images/components/component-content-section-screenshot-2.png "screenshot")

3.  With background image :

* screenshot:
    ![screenshot](/images/components/component-content-section-screenshot-3.png "screenshot")
* screenshot:
    ![screenshot](/images/components/component-content-section-screenshot-4.png "screenshot")

4.  `primary background`:

* screenshot:
    ![screenshot](/images/components/component-content-section-screenshot-5.png "screenshot")
