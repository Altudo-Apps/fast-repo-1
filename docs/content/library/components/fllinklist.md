# FLLinkList (LinkList)

**FLLinkList** - A flexible, highly customizable navigation component that displays collections of links in various formats and layouts. This FastLane component renders lists of links with configurable styling, responsive behavior, and full Sitecore editing support.

**Description:** A dynamic link list component that renders collections of links from Sitecore content with consistent formatting, GraphQL-powered data fetching, and seamless Experience Editor integration.

**Functionality:** Dynamically renders link lists using integrated GraphQL queries, supporting a title heading and multiple link items with responsive design patterns.

## Component Details

**Template Name:** JSON Rendering  
**Item Path:** `/sitecore/layout/Renderings/Feature/FastLane/Renderings/FLLinkList/FLLinkList`

## Field Details

### FL Link List (Datasource Template)

| Field Name | Sitecore Field Type | Description | Required |
|:--|:--|:--|:--|
| Title | Single-Line Text | The display title/heading for the link list | No |

### Child Items

The FL Link List template inherits the Link field from base templates. Child items under the datasource contain:

| Field Name | Sitecore Field Type | Description | Required |
|:--|:--|:--|:--|
| Link | General Link | The URL or Sitecore item to link to | Yes |

## Link Types

The General Link field supports various link types:

| Type | Description | Result |
|:--|:--|:--|
| Internal | Sitecore item linking | Navigation within site |
| External | URL to external site | Links to other domains |
| Email | `mailto:` links | Email contacts |
| Anchor | Section navigation within the page | Jump to content |
| Media | Download files from media library | PDFs, images, docs |
| JavaScript | Custom scripts | Advanced interactions |

## Advanced Styling Options

### 1. Hierarchical Link Grouping

Supports grouping of links into logical folders for organization such as footer columns, main navigation panels, and multi-level categories.

| Structure | Description | Use Case |
|:--|:--|:--|
| **Link List Folder** | Main grouping of related links | Footer links, main nav |
| **Link List Item** | Individual link item with URL and title | Each menu or footer link |

### 2. Link List Structure

The component renders a structured list of links with a title and individual link items.

| Element | Description | Use Case |
|:--|:--|:--|
| **Title** | Heading displayed above the link list | Section headers, navigation labels |
| **Link Items** | Individual links within the list | Navigation menus, related content |
| **List Container** | Wrapper for organizing links | Consistent layout and styling |

### 3. Link Display Options

The component provides flexible control over how links are presented.

| Option | Description | Effect |
|:--|:--|:--|
| Link Text | Display link text from link field | Shows descriptive text for each link |
| Link URLs | Navigate to target destinations | Functional navigation functionality |
| Link Styling | Custom CSS classes for appearance | Consistent visual presentation |

### 4. List Display Modes

Different rendering modes for various use cases:

| Mode | Description | CSS Classes |
|:--|:--|:--|
| **Horizontal (Default)** | Links displayed in a row | `flex gap-5` |
| **Vertical Stack** | Links stacked vertically | Override with `flex flex-col` |
| **Grid Layout** | Grid-based presentation | Override with `grid` classes |

### 5. Component Wrapper Styles

Use the **`styles`** rendering parameter to apply global classes to the root container:

- Margin utilities: `my-4`, `mt-5`
- Background colors: `bg-light`, `bg-secondary`
- Border utilities: `border`, `border-top`
- Spacing: `p-4`, `py-3`

### 6. Responsive Behavior

Automatic responsive link list handling through modern CSS and responsive design patterns.

| Feature | Description | Benefit |
|:--|:--|:--|
| **Flexible Layouts** | Responsive grid and flexbox layouts | Optimized for all screen sizes |
| **Mobile Optimization** | Stack and reflow on small screens | Better mobile user experience |
| **Touch Friendly** | Appropriate touch targets | Improved mobile navigation |

## Screenshots

1. **FLLinkList Component Overview**
   ![screenshot](/images/components/component-linklist-item.png "FLLinkList Component")
