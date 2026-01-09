# Content Block (SXA)

**Content Block -** The Content Block component is the most **fundamental building block** in Sitecore XM Cloud SXA projects, providing a simple structure to display a **heading and rich text content**. It is ideal for paragraphs, informational sections, or introductory copy on any page. Highly reusable, it forms the backbone for content-heavy layouts and editorial storytelling.

**Description:** A foundational content component that renders a heading and rich text content with consistent styling and semantic HTML structure, supporting full rich text formatting capabilities.

**Functionality:** Renders a heading (defaulting to h2) and rich text content with customizable styling classes, providing the essential building block for content-heavy pages and editorial sections.

## Component Details

*This component is implemented as a React component and does not have a corresponding Sitecore rendering item.*


| Field Name | Sitecore Field Type | Description | Required |
| :-- | :-- | :-- | :-- |
| `heading` | Single-Line Text | The main heading or title for the content block | Yes |
| `content` | Rich Text | The descriptive or body content for the content block | Yes |

## Advanced Content Options

### 1. Heading Configuration
The heading field supports various text content and automatically renders as an `h2` element by default.

| Example | Result |
|---------|--------|
| `Welcome to Our Site` | Renders as `<h2 class="contentTitle">Welcome to Our Site</h2>` |
| `About Our Company` | Renders as `<h2 class="contentTitle">About Our Company</h2>` |
| `Product Features` | Renders as `<h2 class="contentTitle">Product Features</h2>` |

### 2. Rich Text Content
The content field supports full Sitecore rich text editor capabilities including:

| Format | HTML Output | Use Case |
|---------|-------------|----------|
| **Bold** | `<strong>` or `<b>` | Emphasis, important text |
| **Italic** | `<em>` or `<i>` | Foreign words, emphasis |
| **Lists** | `<ul>`, `<ol>`, `<li>` | Bullet points, numbered lists |
| **Links** | `<a href="">` | Internal/external navigation |
| **Images** | `<img>` | Inline media content |
| **Tables** | `<table>`, `<tr>`, `<td>` | Data presentation |

### 3. Component Styling
Use the **`Styles`** field to apply global classes to the root container:

| Style | Description |
|-------|-------------|
| `text-center` | Centers text alignment |
| `bg-light` | Light background color |
| `p-4` | Adds padding |
| `my-4` | Adds vertical margins |
| `border` | Adds border styling |
| `rounded` | Rounds corners |


### 1. Component Wrapper Styles
The component renders with a root container using the class `contentBlock`:

```html
<div class="contentBlock {styles}">
  <h2 class="contentTitle">{heading}</h2>
  <div class="contentDescription">{content}</div>
</div>
```

### 2. Default CSS Classes
- **Root Container**: `contentBlock` - Main wrapper for styling and layout
- **Heading**: `contentTitle` - Styling for the heading element
- **Content**: `contentDescription` - Styling for the rich text content

### 3. Custom Styling
Combine the `Styles` field with your design system:
- **Typography**: `text-lg`, `font-bold`, `text-gray-800`
- **Spacing**: `p-6`, `my-8`, `px-4`
- **Backgrounds**: `bg-white`, `bg-gray-50`, `bg-primary`
- **Borders**: `border`, `border-gray-200`, `rounded-lg`
