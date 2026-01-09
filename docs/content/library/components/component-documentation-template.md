# FastLane Component Documentation Template (Author-Centric)

## 📌 1. Component Overview

- **Component Name**:
- **Brief Description**: What is this component used for? What purpose does it serve on a page?
- **Example Use Cases**: Where should this component be used (e.g., homepage hero, feature section, navigation bar)?
- **Expected Frequency of Use**: (e.g., Single use per page, multiple per page, site-wide)

---

## 🖊 2. Authoring Experience

### ✍️ Content Fields (Datasource Template)
*List all the fields authors fill in — use plain English, not system terms.*

| Field Label (as seen by author) | Description | Required? | Notes/Examples |
|----------------------------------|-------------|-----------|----------------|
| Heading | Title text at the top | Yes | e.g., "Why Choose Us" |
| Body Text | Main content area | Yes | Supports rich text |
| Image | Main visual | Optional | 1200x600 recommended |
| CTA Button Text | Text shown on button | Optional | e.g., "Learn More" |
| CTA Link | Destination URL or page | Optional | Can link internally or externally |

---

### 🎛 Styling Options (Basic)
*These options are visible in the **Styling** tab or context bar. Authors can use them to visually change how the component looks.*

| Option | Description | Available Values | Default |
|--------|-------------|------------------|---------|
| Padding | Space above/below the component | None, Small, Medium, Large | Medium |
| Background Color | Sets background behind component | White, Gray, Theme Primary | White |
| Text Alignment | Controls alignment of text | Left, Center, Right | Left |

---

### 🧠 Advanced Options (Rendering Parameters)
*These are less commonly used, but available in the "Advanced" tab for more control.*

| Option | Description | Example Use Case | Default |
|--------|-------------|------------------|---------|
| Visibility Rules | Show/hide on certain devices | Hide on mobile | Show on all devices |
| Variant | Changes the component layout | Image Left / Image Right / Stacked | Image Left |
| Override Theme | Allows specific branding | Use for campaign landing pages | Inherit from site |

---

## 🧷 3. Content Source Rules

- **Datasource Template(s)**: What kind of content this component expects (e.g., "Hero Content", "Promo", etc.)
- **Where Content is Stored**: Local to page / Reusable from folder / Global shared content
- **Can Authors Add This in Pages UI?**: Yes / No
- **Can Authors Create New Content Items?**: Yes / No
- **Can This Component Be Personalised?**: Yes / No
- **Can This Component Be Hidden or Removed in a Page?**: Yes / No

---

## 🧩 4. Variants & Display Modes
*List all visual or structural variations of the component that an author can choose from:*

| Variant Name | Visual Description | Use Case | How to Select |
|--------------|-------------------|----------|---------------|
| Image Left | Image on left, text on right | Default marketing layout | Variant dropdown |
| Image Right | Image on right, text on left | For alternating visual rhythm | Variant dropdown |
| Full Width | Edge-to-edge background, centered content | Hero or banner | Variant dropdown |

---

## 🧪 5. Authoring Tips & Best Practices

- What should authors keep in mind to make this look good?
- Are there any required image sizes or character limits?
- Common mistakes to avoid?
- Any known limitations?

---

## 📸 6. Screenshots / Examples

- **Screenshot of Component in Use**: *(Paste or link to screenshot)*
- **Screenshot of Pages UI with Component Selected**: *(Authoring interface view)*
- **Figma Link** (if available):
- **Storybook Link** (if available):

---

## ✅ 7. Review & QA Checklist

| Item | Verified? |
|------|-----------|
| Fields appear correctly in Pages UI | [ ] |
| Styling and Advanced options display correctly | [ ] |
| Component works across screen sizes | [ ] |
| Component works with personalization | [ ] |
| Matches Figma design | [ ] |
