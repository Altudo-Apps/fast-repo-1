# MegaMenu Navigation (MegaNav & MegaNavItem)

**Mega Menu Navigation:** The Mega Navigation component is designed to provide an expandable, multi-level navigation menu for the FastLane website, enhancing user navigation across various pages. It supports a hierarchical structure with headers and items, adhering to responsive design principles and theming via ShadCN UI and Tailwind CSS. The component is optimized for the Sitecore XM Cloud Pages Editor and includes nested templates for MegaNav and MegaNavItem to manage content and navigation structure.

**a. MegaNav:**

**Description**: A comprehensive navigation menu that organizes multiple sections (e.g., "About Us," "Resources," "News").

**Functionality**: Provides a dropdown or expandable menu structure, allowing users to access primary site sections. Supports keyboard navigation and mobile-friendly collapse/expand behavior.

**Authoring & Placeholders**

- Add `MegaNavItem` components into the `meganav-{*}` placeholder when editing.
- Runtime content renders via `meganav-{DynamicPlaceholderId}` for the active item (desktop overlay, mobile sheet, and editing view).

**Behavior Notes**

- Desktop: Opens an overlay panel for the active item; closes on outside click or Escape key.
- Mobile: Uses a slide-in sheet with a back button for nested content.
- State: Remembers the last active item in `localStorage` under `active-menu-item`.
- Navigation: Closes menus on route changes.

## MegaNav Field Details

**Template Name:** MegaNav  
**Item Path:** `/sitecore/templates/Feature/FastLane/Renderings/MegaNav/MegaNav`

| Field Name | Sitecore Field Type | Description |
|------------|-------------------|-------------|
| MegaNavHeaderTitle | Single-Line Text | The main header title for the navigation section |

**b. MegaNavItem:**

**Description**: Individual menu items within the MegaNavigation (e.g., "Getting Started," "Documentation"). It holds a Sitecore placeholder to add Image, RichText, Column / Row Splitter and MegaNavLinkList.

**Functionality**: Acts as a category or section header within the navigation, triggering the display of associated MegaNavLinkList items on hover or click.

## MegaNavItem Field Details

**Template Name:** MegaNavItem
**Item Path:** `/sitecore/templates/Feature/FastLane/Renderings/MegaNav/MegaNavItem`

| Field Name | Sitecore Field Type | Description |
|------------|-------------------|-------------|
| MegaNavTitle | Single-Line Text | Title field for the navigation item |

**Screenshots:**

**MegaNavigation:** 
    ![screenshot](/images/components/component-meganavigation.png "screenshot")

**Mega NavItem displays Sitecore placeholder to add any components:**
    ![screenshot](/images/components/component-mega-navitem.png "screenshot")
