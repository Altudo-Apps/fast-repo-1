# Tabs

**Tabs** - The Tabs component is a reusable UI element for the FastLane website, designed to present content in a tabbed interface. Built using Radix UI and Tailwind CSS, it supports multiple tabs (e.g., "Continuing Education," "Venue") with flexible content areas. The component integrates with Sitecore placeholders, allowing dynamic addition of sub-components, and adapts to light and dark themes.

**Tabs Component:**

**Description**: A container that manages a set of tabbed sections, enabling users to switch between different content panels.

**Functionality:** Displays a horizontal tab list (e.g., "Continuing Education," "Admission Discounts") with corresponding content areas. Supports theme switching (light/dark) for visual consistency across the site.

**Placeholder Flexibility:** Uses `navtab-{*}` to collect tab items and renders the active tab content into `navtab-{DynamicPlaceholderId}`. The component persists the last selected tab in `localStorage` under the key `active-tab`.

**Tab Component:**

**Description:** An individual tab within the Tabs component, representing a single navigable section.

**Functionality:** Displays a tab title (e.g., "Tab Text") and an associated content area, which can be populated with placeholder text or dynamic content. Supports user interaction to switch active tabs.

**Placeholder Flexibility:** Each tab panel renders its content via `navtabcontent-{DynamicPlaceholderId}`. This modularity supports content editors in customizing tab content without code changes.

**Template Name:** Tab

**Item Path:** /sitecore/templates/Feature/FastLane/Renderings/Tabs/Tab

**Fields:**

| Field Name | Sitecore Field Type | Description |
|------------|-------------------|-------------|
| NavTabTitle | Single Line Text | The title or label for the individual tab (e.g., "Tab Text"). |

**Screenshots:**

**Tabs Visual design from Figma**

![screenshot](/images/components/component-tabs-1.png "screenshot")

**Tab Component displaying a Sitecore placeholder to add any Sitecore components (Image, RichText, CTA etc.)**

![screenshot](/images/components/component-tabs-2.png "screenshot")

![screenshot](/images/components/component-tabs-3.png "screenshot")
