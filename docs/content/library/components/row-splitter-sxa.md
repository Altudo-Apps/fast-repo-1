# Row Splitter (SXA)

**Row Splitter -** The Row Splitter component is a flexible, layout-controlling SXA (Sitecore Experience Accelerator) component that allows editors to divide content into configurable rows within a page section. Each row can have its own styling and background, making it ideal for creating visual separation, stacked content layouts, and marketing sections with alternating themes.

**Description:** A dynamic layout component that renders up to 8 rows based on configuration, with customizable styling for each row to create visual hierarchy and content organization.

**Functionality:** Dynamically renders rows based on the `EnabledPlaceholders` configuration, providing placeholders for content insertion and supporting custom styling for each row.

## Component Details

**Template Name:** JSON Rendering  
**Item Path:** `/sitecore/layout/Renderings/Feature/JSS Experience Accelerator/Page Structure/Row Splitter`

## Advanced Layout Options

### 1. Number of Rows
The component supports up to **8 rows**. Specify the row numbers to render via the `EnabledPlaceholders` field.

| Example | Result |
|---------|--------|
| `1,2` | 2 rows rendered |
| `1,2,3,4` | 4 rows rendered |
| `1` | Single full-width row |
| `1,3,5` | 3 rows rendered (rows 1, 3, and 5) |

### 2. Row Styles
Each row's styling can be customized using the `StylesN` fields where N is the row number (1–8). These typically include **background colors, padding, borders, and spacing utilities**.

| Field | Example Value | Description |
|-------|---------------|-------------|
| Styles1 | `bg-primary p-4` | Row 1 with primary background and padding |
| Styles2 | `bg-light border-t-2` | Row 2 with light background and top border |
| Styles3 | `py-8 shadow-sm` | Row 3 with vertical padding and subtle shadow |
| Styles4 | `bg-secondary text-white` | Row 4 with secondary background and white text |



## Styling Options

### 1. Component Wrapper Styles
Use the **`styles`** field to apply global classes to the root container. Common uses include:
- Margin utilities: `my-4`, `mt-5`
- Background colors: `bg-light`, `bg-secondary`
- Border utilities: `border`, `border-top`
- Spacing: `p-4`, `py-3`

### 2. Row-specific Styling
Each row can have its own styling applied through the `StylesN` fields:
- **Backgrounds**: `bg-primary`, `bg-light`, `bg-secondary`, `bg-dark`
- **Padding**: `p-4`, `py-6`, `px-8`, `pt-3`
- **Borders**: `border`, `border-t-2`, `border-bottom`, `border-primary`
- **Spacing**: `my-4`, `mt-5`, `mb-3`
- **Shadows**: `shadow-sm`, `shadow-md`, `shadow-lg`
- **Text**: `text-center`, `text-white`, `text-primary`

### 3. Content Placeholders
Each row uses a placeholder (`row-N-{*}`) to allow editors to drop components or rich content. This makes the layout adaptable to various content needs and enables highly customizable stacked layouts.

- **Maximum rows:** 8 rows supported
- **Row order:** Determined by the order in `EnabledPlaceholders`
- **CSS conflicts:** Custom styles in Styles fields may override theme defaults
- **Content overflow:** Long content may affect row heights and alignment
- **Mobile experience:** Ensure rows stack properly on small screens
- **Styling inheritance:** Row styles are independent and don't inherit from parent components

## Screenshots

1. **Row Splitter Component Overview**
   ![screenshot](/images/components/component-row-splitter.png "screenshot")

2. **Manage Rows Interface**
   ![screenshot](/images/components/component-row-splitter-manage-rows.png "screenshot")

