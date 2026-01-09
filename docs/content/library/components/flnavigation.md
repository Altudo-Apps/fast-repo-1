# FLNavigation

**FLNavigation -** The FLNavigation component is a custom navigation wrapper providing a responsive, hierarchical navigation menu for the FastLane website. It supports multi-level navigation with collapsible sections, mobile-responsive toggle functionality, and seamless integration with Sitecore XM Cloud's editing experience.

**Description:** A navigation component that renders a hierarchical menu from Sitecore content tree, featuring expand/collapse functionality, current page highlighting, and responsive behavior with mobile toggle support.

**Functionality:** Wraps NavigationList and HeaderNavigation sub-components to provide a complete navigation solution with multi-level support, editing mode awareness, and accessibility features.

## Component Details

**Template Name:** JSON Rendering  
**Item Path:** `/sitecore/layout/Renderings/Feature/FastLane/Renderings/FLNavigation/FLNavigation`

## Component Variants

| Variant | Description |
|---------|-------------|
| `Default` | Standard navigation rendering with hierarchical menu structure |

## Field Details

The navigation structure is automatically populated from the Sitecore content tree. Each navigation item includes:

| Field Name | Sitecore Field Type | Description | Required |
|------------|---------------------|-------------|----------|
| `NavigationTitle` | Single-Line Text | Primary display text for the navigation link | No |
| `Title` | Single-Line Text | Fallback display text if NavigationTitle is empty | No |
| `DisplayName` | System | Item display name (used if Title is empty) | Yes |
| `Href` | General Link | Target URL for the navigation link | Yes |
| `Querystring` | Single-Line Text | Additional query parameters | No |
| `Children` | System | Nested child navigation items | No |
| `Styles` | Multilist | CSS class names for styling | No |

## Features & Behavior

### Multi-Level Navigation
- Supports unlimited nesting depth through recursive `NavigationList` rendering
- Level 1 items styled as headers with larger typography
- Level 2+ items have indented styling with chevron indicators

### Mobile Responsiveness
- Toggle button appears on mobile devices (`md:hidden`)
- Navigation hidden by default on mobile, shown on toggle
- Desktop navigation always visible (`hidden md:block`)

### Editing Mode Support
- Detects Sitecore editing mode via `useSitecore()` hook
- Prevents navigation in editing mode to maintain editor functionality
- Click events gracefully handled during content authoring

### Current Page Highlighting
- Automatically detects and highlights the current page in navigation
- Uses path normalization for accurate matching
- Applies `!bg-secondary text-secondary-foreground` styling to active items

### Expand/Collapse Behavior
- Items with children have chevron indicators
- Chevron rotates 180° on expand
- State managed per-item with React `useState`
- Smooth transitions with Tailwind CSS

## Screenshots

1. **Sidebar Navigation Component**
   ![screenshot](/images/components/component-sidebar-navigation.png "screenshot")

2. **Navigation Menu**
   ![screenshot](/images/components/component-navigation-menu.webp "screenshot")
