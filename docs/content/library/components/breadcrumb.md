# Breadcrumb

**Breadcrumb:**  The Breadcrumb component is a navigational aid for the FastLane website, designed to display the user's current path within the site hierarchy (e.g., "Home > About Us > Our History"). Built using Radix UI and Tailwind CSS, it enhances usability by allowing users to backtrack through their navigation trail. The component dynamically adapts to the page structure and is responsive across devices.

**Description:** A horizontal list of clickable links representing the user's navigation path.

**Functionality:** Displays a trail of links (e.g., "Home," "About Us," "Our History") with separators (e.g., ">") to indicate the current page context. Each link is clickable, enabling users to navigate to previous sections. The current page (e.g., "Our History") is typically non-clickable or styled differently.

**Behavior Notes:**

- Data source: `page.layout.sitecore.context.breadCrumbsContext`.
- Editing & Design Library modes and Partial Design authoring render a small fake trail for visual context.
- All intermediate items are rendered as links; the last item is rendered as the current page (non-link) with `aria-current="page"`.
- Link URLs are normalized to lowercase; when a URL is missing, the component falls back to `#`.
- Supports styling via `params.styles`.

**Screenshot:**

![Breadcrumb Component](/images/components/component-breadcrumb.png)
