# FLContainer (SXA)

**FLContainer -** The FLContainer component is a custom structural wrapper extending the Sitecore XM Cloud SXA Container functionality. It provides intelligent layout handling with automatic width detection, content centering, and background image support through parsed Sitecore media URLs.

**Description:** A foundational structural component that dynamically applies layout classes based on style parameters, supporting full-width layouts, centered content positioning, bordered sections, and background images.

**Functionality:** Renders a wrapper container with dynamic styling based on GridParameters and Styles fields, supporting background images, content centering, and responsive layout options.

## Component Details

**Template Name:** JSON Rendering  
**Item Path:** `/sitecore/layout/Renderings/Feature/FastLane/Renderings/FLContainer/FLContainer`

## Component Variants

The FLContainer provides multiple rendering variants:

| Variant | Description |
|---------|-------------|
| `Default` | Standard container with dynamic layout detection |
| `Themed` | Container wrapped in a flex column for themed sections |
| `Header` | Alias for Themed variant, used for header containers |
| `Footer` | Alias for Themed variant, used for footer containers |

## Advanced Layout Options

### 1. Container Width Control
The component supports both boxed and full-width layouts through the `GridParameters` field.

| Example | Result |
|---------|--------|
| `container mx-auto` | Boxed content with centered margins |
| `w-full` | Full-width fluid layout |
| `container mx-auto px-4` | Boxed with custom padding |
| `w-full max-w-7xl mx-auto` | Full-width with max-width constraint |

### 2. Content Alignment
Use the `Styles` field to control content positioning and layout behavior.

| Field Value | Description |
|-------------|-------------|
| `position-center` | Centers content using flexbox |
| `sxa-bordered` | Adds styled border with responsive padding |
| `bg-gray-100` | Applies background color |
| `position-center sxa-bordered` | Combines centering with border styling |

### 3. Background Images
The `BackgroundImage` field supports Sitecore media URLs for background images.

| Field Value | Result |
|-------------|--------|
| `mediaurl="/-/media/hero-bg.jpg"` | Background image applied |
| `mediaurl="/-/media/pattern.png"` | Pattern background |
| Empty | No background image |

## Styling Options

### 1. Component Wrapper Styles
Use the **`Styles`** field to apply global classes to the root container:
- **Centering**: `position-center` (applies flex centering)
- **Borders**: `sxa-bordered` (styled border with padding)
- **Backgrounds**: `bg-gray-100`, `bg-primary`, `bg-secondary`
- **Spacing**: `p-4`, `py-6`, `my-4`

### 2. Grid Parameters
The **`GridParameters`** field controls layout structure:
- **Boxed Layout**: `container mx-auto` (centered with margins)
- **Full-Width**: `w-full` (fluid layout)
- **Responsive**: `container mx-auto px-4 lg:px-8` (responsive padding)
- **Custom**: `max-w-7xl mx-auto` (constrained width)

### 3. Content Placeholders
Each container uses a unique placeholder defined by `DynamicPlaceholderId`:
- **Naming Convention**: `container-{DynamicPlaceholderId}`
- **Content Insertion**: Drop components into the placeholder in Experience Editor
- **Unique Values**: Each instance requires a different DynamicPlaceholderId

### Common Configurations

| Use Case | GridParameters | Styles | BackgroundImage |
|----------|----------------|--------|-----------------|
| **Boxed, Centered Content** | `container mx-auto` | `position-center` | - |
| **Full-Width with Background** | `w-full` | `bg-overlay` | `mediaurl="/-/media/hero.jpg"` |
| **Bordered Section** | `container mx-auto` | `sxa-bordered bg-gray-50` | - |
| **Header Container** | `w-full` | `bg-primary text-white` | - |

## Screenshots

1. **Container Component Overview**
   ![screenshot](/images/components/component-container.png "screenshot")

2. **Bordered Container Example**
   ![screenshot](/images/components/component-container-bordered.png "screenshot")
