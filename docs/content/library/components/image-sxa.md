# Image (SXA)

**Image -** The Image component is a flexible, highly customizable SXA (Sitecore Experience Accelerator) component that displays images with configurable styling, responsive behavior, and optimization features. It supports multiple variants including standard image display, hero banner images, and clickable images with optional captions.

**Description:** A dynamic image component that renders images from Sitecore's media library with consistent formatting, performance optimization, and editing support for content managers.

**Functionality:** Dynamically renders images based on field configuration, supporting responsive design, optional link wrapping, caption display, and hero banner styling with background images.

## Component Details

**Template Name:** JSON Rendering  
**Item Path:** `/sitecore/layout/Renderings/Feature/JSS Experience Accelerator/Media/Image`

## Field Details

| Field Name | Sitecore Field Type | Description | Required |
|------------|-------------------|-------------|----------|
| Image | Image | The image to display | Yes |
| ImageCaption | Single-Line Text | Caption text displayed below the image | No |
| TargetUrl | General Link | Optional link for clickable images | No |

## Advanced Display Options

### 1. Image Variants
The component supports three distinct visual variants for different use cases.

| Variant | Description | Use Case |
|---------|-------------|----------|
| **Default** | Standard image with optional link and caption | Content images, product photos |
| **Banner** | Hero banner with background styling | Header images, hero sections |
| **Empty State** | Placeholder display | Content editing mode |

### 2. Link Behavior
The `TargetUrl` field enables clickable images with intelligent link wrapping.

| Condition | Behavior | Result |
|-----------|-----------|---------|
| `TargetUrl` exists + Not editing | Image wrapped in link | Clickable image |
| `TargetUrl` exists + Editing mode | Image without link | Editable in Experience Editor |
| No `TargetUrl` | Image only | Static display |

### 3. Responsive Behavior
Automatic responsive image handling through Sitecore's image optimization system.

| Feature | Description | Benefit |
|---------|-------------|---------|
| **Automatic Sizing** | Responsive width and height | Optimized for all screen sizes |
| **Lazy Loading** | Images load when in viewport | Improved page performance |
| **Format Optimization** | WebP and modern format support | Faster image delivery |

## Styling Options

### 1. Component Wrapper Styles
Use the **`styles`** field to apply global classes to the root container. Common uses include:
- Margin utilities: `my-4`, `mt-5`
- Background colors: `bg-light`, `bg-secondary`
- Border utilities: `border`, `border-top`
- Spacing: `p-4`, `py-3`

### 2. Image Display Modes
Different rendering modes for various use cases and styling needs.

| Mode | Description | CSS Classes |
|------|-------------|-------------|
| **Standard Image** | Basic image with optional link | `component image` |
| **Hero Banner** | Background image with editing overlay | `component hero-banner rounded-lg` |
| **Clickable Image** | Image wrapped in link | `component image` with link wrapper |

### 3. Content Styling
Styling applied to the image content area for consistent layout and appearance.

| Class | Purpose | Result |
|-------|---------|--------|
| `component-content` | Content wrapper | Proper spacing and layout |
| `sc-sxa-image-hero-banner` | Hero banner content | Background image support |
| `image-caption` | Caption styling | Text below image |

## Screenshots

1. **Image Component Overview**
   ![screenshot](/images/components/component-image.png "screenshot")

