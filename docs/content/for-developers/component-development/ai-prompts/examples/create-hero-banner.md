# Example: Create HeroBanner Component

This is an example of how to use the [Create Component Prompt Template](../templates/create-component.md) for a Hero Banner component.

## Prompt Used

```markdown
# Create HeroBanner Component from Figma Design

## COMPONENT CREATION TASK - READ FIRST
You are creating a NEW HeroBanner component from scratch based on Figma designs.

CRITICAL: Ensure ALL Figma variants are accounted for in all of the options available
CRITICAL: FIRST!!!! use the Figma MCP Server to explore the designs. The Figma Design Reference links are in the @hero-banner.md file  
CRITICAL: For each Figma URL, execute the figma mcp server tool get_code

IMPORTANT: The expectation is that the developer is running `npm run dev` while this prompt is being executed - as such - the `component-map.ts` file will get generated automatically once you complete generating the new component.

## Component Information
**Component Name:** HeroBanner
**File Location:** `src/components/HeroBanner.tsx`
**Documentation:** `docs/pages/library/components/hero-banner.md`

## Implementation Requirements

### Required Features:
- Full-screen hero layout with background image support
- Multiple content alignment options (left, center, right)
- Overlay support with opacity controls
- Responsive text scaling and layout adaptation

### Required Parameters:
- ContentAlignment: Droplist (left, center, right)
- BackgroundOverlay: Checkbox for enabling overlay
- OverlayOpacity: Droplist (light, medium, dark)

### Required Fields:
- Title: Single-Line Text
- Subtitle: Single-Line Text  
- Description: Rich Text
- BackgroundImage: Image
- CallToAction: General Link

CRITICAL: Follow guidelines @core-requirements.md documentation.
CRITICAL: Reference the component documentation at @hero-banner.md for all business logic, field definitions, and Figma design links.
```

## Context

This example demonstrates creating a full-screen hero component with:
- Background image support
- Content alignment options
- Overlay controls for readability
- Responsive design considerations
- Multiple CTA support

The key aspects customized from the template:
- **Component Name**: HeroBanner
- **Features**: Full-screen layout, overlays, alignment
- **Parameters**: Alignment, overlay settings
- **Fields**: Hero-specific content fields
