# Accordion

The Accordion component groups content into expandable/collapsible panels. Authors add one or more `Accordion Panel` items inside the Accordion. Each panel has a title and a rich content area via its own placeholder, making this ideal for FAQs, product details, and progressive disclosure of content.

## Field Details

**Template Name:** Accordion  
**Item Path:** `/sitecore/templates/Feature/FastLane/Renderings/Accordion/Accordion`

| Field Name | Sitecore Field Type | Description |
|------------|---------------------|-------------|
| — | — | The Accordion itself does not hold content fields; it provides a placeholder for adding `Accordion Panel` items. |

* * *

## Authoring Model

- Add the `Accordion` component to the page.
- Inside the Accordion, add one or more `Accordion Panel` items to the `accord-{*}` placeholder.
- Open each `Accordion Panel` and add content into its `accordcontent-{DynamicPlaceholderId}` placeholder (e.g., text, images, CTAs, etc.).

Notes:
- In the editor (Experience Editor), all panels are open by default to simplify authoring.
- On the live site, the Accordion behaves as a single-expand control (one panel open at a time) and supports collapse.

* * *

## Advanced Options (Rendering Parameters)

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| styles | Single-Line Text | Optional CSS utility classes applied to the Accordion wrapper. | — |
| RenderingIdentifier | Single-Line Text | Optional HTML `id` attribute for targeting/analytics. | — |

### Styling Options
Common styling such as spacing, background, and alignment may be available via global styles. See `Global Styling Guide` for details.

* * *

## Placeholders

- `accord-{*}`: Primary placeholder inside Accordion where authors add `Accordion Panel` items.
- Each panel renders its content via a child placeholder named `accordcontent-{DynamicPlaceholderId}`.

* * *

## How It Works

- Initialization: The Accordion reads panel renderings from the `accord-{*}` placeholder.
- Panel Structure: Each `Accordion Panel` renders an `AccordionTrigger` (title) and `AccordionContent` (body) bound to a unique `value` key.
- Editing Experience: In editing mode, all panels are opened by default for easier content authoring.
- Live Behavior: On the live site, the Accordion allows a single panel to be open at a time and supports collapsing the open panel.

Implementation notes:
- The wrapper can accept optional `styles` from rendering parameters for layout tweaks.
- The open/close behavior is handled by the UI library and the component’s mode (editing vs. live).

* * *

## Related: Accordion Panel

The `Accordion Panel` is the child item used only inside the `Accordion`.

**Template Name:** Accordion Panel  
**Item Path:** `/sitecore/templates/Feature/FastLane/Renderings/Accordion/AccordionPanel`

| Field Name | Sitecore Field Type | Description |
|------------|---------------------|-------------|
| AccordionPanelTitle | Single-Line Text | The text used as the clickable panel header. |
| — | — | The panel hosts a `accordcontent-{DynamicPlaceholderId}` placeholder for adding other content components. |

Additional parameters available on panels:
- `styles`: Optional CSS utility classes applied to the panel wrapper.
- `RenderingIdentifier`: Optional HTML id for targeting/analytics.

* * *

## Screenshots

1. Accordion with multiple panels (live site view)

![screenshot](/images/components/component-accordion-default.png "Accordion with multiple panels")

2. Authoring view showing the `accord-{*}` placeholder and panel content placeholder

![screenshot](/images/components/component-accordion-authoring.png "Authoring view")


