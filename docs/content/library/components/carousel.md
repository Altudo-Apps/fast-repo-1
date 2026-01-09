# Carousel

The Carousel component displays a horizontally scrollable set of slides. Authors add one or more `Carousel Slide` items into the Carousel. Each slide can contain rich content (e.g., images, headings, text, CTAs) via its own placeholder, making the component highly flexible for hero banners, feature highlights, and promotional sections.

## Field Details

**Template Name:** Carousel  
**Item Path:** `/sitecore/templates/Feature/FastLane/Renderings/Carousel/Carousel`

| Field Name | Sitecore Field Type | Description |
|------------|---------------------|-------------|
| — | — | The Carousel itself does not hold content fields; it provides a placeholder for adding `Carousel Slide` items. |

* * *

## Authoring Model

- Add the `Carousel` component to the page.
- Inside the Carousel, add one or more `Carousel Slide` items to the `Slides` placeholder.
- Open each `Carousel Slide` and add content into its `slide-{*}` placeholder (e.g., image, title, text, CTA components).

* * *

## Advanced Options (Rendering Parameters)

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| SlidesToShow | Number | Number of slides visible at once. | 1 |
| SlidesToScroll | Number | Number of slides moved per navigation action. | 1 |
| EnableCenterZoom | Checkbox | Enables a subtle center zoom effect on the active slide. | Off |
| ArrowPosition | Droplist | Controls position/behavior of navigation UI. If set to `Bottom`, dots are hidden. | — |

Notes:
- The component renders navigation arrows and dots using a slick-based slider. Dots are shown unless `ArrowPosition` is set to `Bottom`.
- For widths below 1024px, the component forces `slidesToShow: 1` for accessibility and readability.

### Styling Options
Common styling such as spacing, background, and alignment may be available via global styles. See `Global Styling Guide` for details.

* * *

## Placeholders

- `carouselslides-{*}`: Primary placeholder inside Carousel where authors add `Carousel Slide` items.
- Each slide component (`Carousel Slide`) provides its own `slide-{*}` placeholder for authoring slide content.
- Internally, the Carousel renders each slide into `carouselcontent-{DynamicPlaceholderId}` to mount one slide at a time.

* * *

## How It Works

- Initialization: The Carousel reads slide renderings from the `carouselslides-{*}` placeholder and prepares a slick slider.
- Rendering: For each slide, the component re-renders the slide via a child placeholder `carouselcontent-{DynamicPlaceholderId}`. This ensures each slide hosts its own content tree.
- Editing Experience: When the page is in editing mode, the `carouselslides-{*}` placeholder is shown so authors can add, remove, or reorder slides directly.
- Adding Slides via Layers Panel: In Sitecore PageBuilder, `Carousel Slide` components are added through the **Layers** panel (located on the left side of the editor). To add slides:
  1. Locate the `Carousel` component in the Layers panel hierarchy.
  2. Click the expand arrow (▶) next to the Carousel to reveal its `carouselslides-{*}` placeholder.
  3. Click the **+** icon on the placeholder or right-click and select "Add component".
  4. Search for and select `Carousel Slide` from the component picker.
  5. Repeat to add additional slides as needed.
  6. Drag and drop slides within the Layers panel to reorder them.
- Minimum Slides Requirement: You must add at least **two `Carousel Slide`** components for the carousel to function as intended. With only one slide, the navigation arrows and dots will still render but there will be no sliding behavior since there is nothing to navigate to. The carousel is designed to cycle through multiple slides, so having a minimum of two slides ensures the navigation controls (prev/next arrows and pagination dots) work correctly and provide a proper user experience.
- Parameters → Behavior:
  - `SlidesToShow` sets how many slides are visible.
  - `SlidesToScroll` sets how many slides advance per navigation.
  - `EnableCenterZoom` toggles a `zoom-effect` CSS class on the wrapper, allowing a subtle scale on the active slide.
  - `ArrowPosition` controls navigation UI: when set to `Bottom`, dots are hidden.
- Navigation: Uses custom next/prev arrow buttons; dots are enabled by default unless overridden by `ArrowPosition`.
- Responsive: Below 1024px width, the slider forces `slidesToShow: 1` for readability.
- Centering: Uses slick’s `centerMode` with `centerPadding: 0` to keep the active slide centered.

Notes:
- Slide content is authored inside the `Carousel Slide` component’s `slide-{*}` placeholder. This allows any mix of child components (image, text, CTAs, etc.).
- The Carousel uses `react-slick` under the hood and a shared `SlickArrowButton` for navigation.

* * *

## Related: Carousel Slide

The `Carousel Slide` is a companion component used only inside the `Carousel`.

**Template Name:** Carousel Slide  
**Item Path:** `/sitecore/templates/Feature/FastLane/Renderings/Carousel/CarouselSlide`

| Field Name | Sitecore Field Type | Description |
|------------|---------------------|-------------|
SlideTitle | Single-Line Text | The text used as the carousel slide title. |
| — | — | The slide hosts a `slide-{*}` placeholder for adding other content components to build the slide. |

Additional parameters available on slides:
- `styles`: Optional CSS utility classes applied to the slide wrapper.
- `RenderingIdentifier`: Optional HTML id for targeting/analytics.

* * *

## Screenshots

1. Carousel with three slides visible, center zoom enabled

![screenshot](/images/components/component-carousel-default-variant.png "Carousel with three slides visible, center zoom enabled")

2. Carousel with arrows at bottom (dots hidden)

![screenshot](/images/components/component-carousel-arrows.png "Carousel with arrows at bottom")

3. Authoring view showing the `Slides` placeholder and slide content placeholder

![screenshot](/images/components/component-carousel-placeholder.png "Authoring view")


