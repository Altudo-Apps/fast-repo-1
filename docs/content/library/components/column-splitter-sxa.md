# Column Splitter (SXA)

**Column Splitter -** The Column Splitter component is a flexible, layout-controlling SXA (Sitecore Experience Accelerator) component that allows editors to divide content into configurable columns within a page section. Each column can have its own width and custom styles, making it ideal for responsive layouts, multi-column sections, and marketing blocks.

**Description:** A dynamic layout component that renders up to 8 columns based on configuration, with customizable widths and styling for each column.

**Functionality:** Dynamically renders columns based on the `EnabledPlaceholders` configuration, supporting Bootstrap's grid system and providing placeholders for content insertion.

## Component Details

**Template Name:** JSON Rendering  
**Item Path:** `/sitecore/layout/Renderings/Feature/JSS Experience Accelerator/Page Structure/Column Splitter`

## Advanced Layout Options

### 1. Number of Columns
The component supports up to **8 columns**. Specify the column numbers to render via the `EnabledPlaceholders` field.

| Example | Result |
|---------|--------|
| `1,2` | 2 columns rendered |
| `1,2,3,4` | 4 columns rendered |
| `1` | Single full-width column |
| `1,3,5` | 3 columns rendered (columns 1, 3, and 5) |

### 2. Column Widths
Each column's width can be adjusted using the `ColumnWidthN` fields where N is the column number (1–8). These are typically **Bootstrap CSS classes** or custom width classes.

| Field | Example Value | Description |
|-------|---------------|-------------|
| ColumnWidth1 | `col-12 col-md-6` | Column 1 takes full width on mobile, half width on medium+ screens |
| ColumnWidth2 | `col-12 col-md-6` | Column 2 takes full width on mobile, half width on medium+ screens |
| ColumnWidth1 | `col-lg-4` | Column 1 takes 1/3 width on large screens |
| ColumnWidth2 | `col-lg-8` | Column 2 takes 2/3 width on large screens |

### 3. Column Styles
The `StylesN` fields (N from 1–8) allow custom styling for each column, such as *padding, background, borders, or text alignment*.

| Field | Example Value | Description |
|-------|---------------|-------------|
| Styles1 | `bg-primary p-4 text-center` | Adds background, padding, and center alignment to column 1 |
| Styles2 | `border border-secondary rounded` | Adds border, secondary color, and rounded corners to column 2 |
| Styles3 | `shadow-sm` | Adds subtle shadow to column 3 |

## Styling Options

### 1. Component Wrapper Styles
Use the **`styles`** field to apply global classes to the root container. Common uses include:
- Margin utilities: `my-4`, `mt-5`
- Background colors: `bg-light`, `bg-secondary`
- Border utilities: `border`, `border-top`
- Spacing: `p-4`, `py-3`

### 2. Responsive Design
The component works seamlessly with Bootstrap's responsive grid system:
- Use `col-12` for full-width columns on all screen sizes
- Use `col-md-6` for half-width columns on medium screens and up
- Use `col-lg-4` for one-third width on large screens and up
- Combine classes like `col-12 col-md-6 col-lg-4` for progressive enhancement

### 3. Content Placeholders
Each column uses a placeholder (`column-N-{*}`) to allow editors to drop components or rich content. This makes the layout adaptable to various content needs.


- **Maximum columns:** 8 columns supported
- **Column order:** Determined by the order in `EnabledPlaceholders`
- **CSS conflicts:** Custom styles in Styles fields may override Bootstrap defaults
- **Content overflow:** Long content may affect column heights and alignment
- **Mobile experience:** Ensure columns stack properly on small screens

## Screenshots

1. **2-Column Split, Asymmetric Widths**
   ![screenshot](/images/components/component-column-splitter-two-column.png "screenshot")

2. **Column Splitter Component Overview**
   ![screenshot](/images/components/component-column-splitter.png "screenshot")

3. **Manage Columns Interface**
   ![screenshot](/images/components/column-splitter-manage-columns.png "screenshot")

