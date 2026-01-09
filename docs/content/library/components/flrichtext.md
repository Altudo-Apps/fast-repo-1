# FLRichText

**FLRichText -** The FLRichText component is a custom rich text wrapper extending the Sitecore Content SDK RichText functionality. It renders formatted HTML content from Sitecore with comprehensive Tailwind CSS styling for typography, lists, tables, and interactive elements.

**Description:** A styled rich text component that applies consistent Tailwind typography classes to all HTML elements rendered from Sitecore's rich text field, ensuring uniform formatting across headings, paragraphs, lists, tables, and links.

**Functionality:** Wraps the Sitecore Content SDK RichText component with predefined Tailwind CSS classes for all common HTML elements, providing consistent styling and responsive behavior.

## Component Details

**Template Name:** JSON Rendering  
**Item Path:** `/sitecore/layout/Renderings/Feature/FastLane/Renderings/FLRichText/FLRichText`

## Component Variants

| Variant | Description |
|---------|-------------|
| `Default` | Standard rich text rendering with full Tailwind typography styling |

## Field Details

| Field Name | Sitecore Field Type | Description | Required |
|------------|---------------------|-------------|----------|
| `Text` | Rich Text | The formatted HTML content to display | Yes |

## Rich Text Formatting Support

### Text Formatting

| Format | HTML Tag | Use Case |
|--------|----------|----------|
| **Bold** | `<strong>` or `<b>` | Emphasis, important text |
| **Italic** | `<em>` or `<i>` | Foreign words, emphasis |
| **Underline** | `<u>` | Links, emphasis |
| **Strikethrough** | `<s>` or `<del>` | Removed content, discounts |
| **Subscript** | `<sub>` | Chemical formulas, footnotes |
| **Superscript** | `<sup>` | Mathematical expressions, citations |

### Link and Media Support

| Feature | Description | Use Case |
|---------|-------------|----------|
| **Internal Links** | Sitecore internal link resolution | Navigation between pages |
| **External Links** | External URL linking | References and resources |
| **Embedded Media** | Images and media integration | Rich content presentation |

## Screenshots

1. **RichText Component Overview**
   ![screenshot](/images/components/component-rich-text.png "screenshot")
