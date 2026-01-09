# Title (SXA)

**Title -** The Title component is a flexible, context-aware React component for Sitecore XM Cloud sites, designed to render and optionally link a page or item’s Title field. It uses the Sitecore Page Context and integrated GraphQL data to obtain the appropriate Title value, providing consistent formatting, robust editing support, and customizable styles.

**Description:**
A dynamic heading or title component that displays the value of a Sitecore Text field, supporting both standalone text and automatic linking to the relevant page (when not in editing mode). The component enables in-place editing within Experience Editor and supports custom class styling for easy layout control.

**Functionality:**

- Renders the Title from a Sitecore Text field, drawing from either the datasource or context item (via integrated GraphQL).
- Wraps the title in a link to the current page (when not editing); in Experience Editor, shows plain text for in-place editing.
- Provides a consistent markup structure with nested classes for styling control.
- Gracefully handles missing or empty field values with robust fallback logic.


## Field Details

**Template Name:** JSON Rendering  
**Item Path:** `/sitecore/layout/Renderings/Feature/JSS Experience Accelerator/Page Content/Title`

## Field Details

| Field Name | Sitecore Field Type | Description | Required |
| :-- | :-- | :-- | :-- |
| Title | Text | The main title or heading to display | Yes |

## Rendering Behavior

- **Dynamic Field Access:**
Automatically selects the `Title` field from the datasource if available, falling back to the context item for data-driven flexibility.
- **Linked Title:**
When not in editing mode, the title is rendered as a clickable link (using `SitecoreLink`) pointing to the associated page, improving user navigation.
- **Editing Mode Support:**
In Experience Editor/Page Builder editing mode, only the raw title text is shown to allow content authors to edit the title in place.
- **Consistent Structure:**
Uses a `ComponentContent` wrapper with standardized class names for styling and layout consistency.


## Styling Options

### 1. Component Wrapper Styles

Apply utility classes via the `styles` parameter or prop at the root level:

- Layout: `mb-2`, `pt-3`
- Color \& Theme: `text-primary`, `bg-light`
- Borders and Radius: `border-bottom`, `rounded`
- Any project-specific global or local utility classes


### 2. Content Area Classes

The component’s output provides these BEM-inspired classes for easy targeting:


| Class | Purpose | Result |
| :-- | :-- | :-- |
| `component title` | Root wrapper | Enables high-level component styling |
| `component-content` | Title content area | Structured content/control |
| `field-title` | The title text/link | Styles the field or link |

## Editing \& Page Builder Support

- **Inline Editing:**
Supports Sitecore XM Cloud Experience Editor/Page Builder for direct, in-context editing of the Title field.
- **Placeholder Handling:**
Robustly supports empty or unconfigured fields, ensuring the page remains stable during design and content phase.

## Screenshots

### Title Component

![Title Component](/images/components/component-title.png)

