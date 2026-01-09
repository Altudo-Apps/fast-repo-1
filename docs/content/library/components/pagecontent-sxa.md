# PageContent (SXA)

**Page Content -** The Page Content component is a flexible React component for use in Sitecore XM Cloud sites, designed to render rich text content originating from a single Sitecore Rich Text field. It leverages the Sitecore Page Context to dynamically access and display the appropriate content field for the current page, with support for custom styling and consistent formatting.

**Description:**
A context-aware rich text content component that renders and displays the value of a Sitecore Rich Text field, providing full support for embedded content, HTML formatting, personalization, and inline editing within Experience Editor.

**Functionality:**

- Renders content from a specified Rich Text field (or falls back to the page context if not directly provided).
- Maintains structured output by wrapping content in defined HTML containers.
- Supports custom styling via utility CSS classes passed through the `styles` prop.
- Ensures robust handling of missing content by displaying a placeholder if the field is empty.


## Component Details

**Template Name:** JSON Rendering  
**Item Path:** `/sitecore/layout/Renderings/Feature/JSS Experience Accelerator/Page Content/PageContent`


## Field Details

| Field Name | Sitecore Field Type | Description | Required |
| :-- | :-- | :-- | :-- |
| Content | Rich Text | The main rich text content to render | Yes |

## Rendering Behavior

- **Dynamic Field Access:**
The component automatically detects and uses the `Content` field from the current page context.
- **Rich Text Rendering:**
Utilizes the Sitecore Content SDK’s `RichText` renderer to output fully formatted HTML, honoring embedded media, internal links, personalization, and Experience Editor capabilities.

## Styling Options

### 1. Component Wrapper Styles

Use the `styles` parameter/prop to apply utility classes to the root div, enabling:

- Layout: e.g., `mb-4`, `py-2`
- Theming: e.g., `bg-light`, `text-dark`
- Borders and Spacing: e.g., `border`, `rounded-lg`
- Any other global or local CSS utility classes as needed for layout control.


### 2. Content Area Classes

The markup enforces several BEM-style classes for inner content areas:


| Class | Purpose | Result |
| :-- | :-- | :-- |
| `component content` | Root wrapper | Contains component and enables high-level styling |
| `component-content` | Content area wrapper | Maintains proper spacing and structure |
| `field-content` | Rich text field output | Styles and targets the main field |

## Editing \& Page Builder Support

- **Inline Editing:**
Fully supports XM Cloud Page Builder, allowing content authors to visually edit the rich text directly within the page.


## Screenshots

1. **PageContent Component Overview**
   ![screenshot](/images/components/component-page-content.png "screenshot") 