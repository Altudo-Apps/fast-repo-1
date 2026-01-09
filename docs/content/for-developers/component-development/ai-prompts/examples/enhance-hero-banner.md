# Example: Enhance HeroBanner Component

This is an example of how to use the [Enhance Existing Component Prompt Template](../templates/enhance-existing-component.md) for adding advanced features to the HeroBanner component.

## Prompt Used

```markdown
# Enhance HeroBanner Component from Figma Design

## ENHANCEMENT TASK - READ FIRST
You are enhancing the EXISTING HeroBanner component, not creating a new one.

CRITICAL: Ensure ALL Figma variants are accounted for in all of the options available
CRITICAL: FIRST!!!! use the Figma MCP Server to explore the designs. The Figma Design Reference links are in the @hero-banner.md file
CRITICAL: For each Figma URL, execute the figma mcp server tool get_code
 
Files to analyze:
- @HeroBanner.tsx  (main wrapper)
 
New features to add:
1. Video background support with autoplay/mute controls
2. Parallax scrolling effect option
3. Multiple call-to-action button support (primary + secondary)
4. Animation timing controls for content entrance
5. Mobile-specific background image option

PRESERVE all existing functionality while adding these enhancements.

CRITICAL: Follow guidelines @core-requirements.md documentation.
CRITICAL: Reference the documentation for the HeroBanner component at @hero-banner.md
```

## Context

This example demonstrates enhancing a hero banner component with advanced features:
- **Video Backgrounds**: Adding MP4/WebM video support with accessibility controls
- **Interactive Effects**: Parallax scrolling for enhanced visual appeal
- **Enhanced CTAs**: Supporting dual call-to-action patterns
- **Animation Control**: Configurable entrance animations
- **Mobile Optimization**: Separate mobile backgrounds for performance

The key aspects of this enhancement:
- **Preserve Existing**: All current background image and alignment options remain
- **Add Advanced Features**: Five sophisticated new capabilities
- **Component Analysis**: AI analyzes main wrapper and discovers sub-components automatically
- **Performance Conscious**: Video backgrounds include fallback and mobile considerations

## Implementation Notes

This enhancement demonstrates more complex scenarios:
1. **Media Handling**: Adding video field types and proper fallback logic
2. **Performance**: Considering mobile performance with separate background options
3. **Accessibility**: Video autoplay with mute controls and reduced motion support
4. **Component Discovery**: AI automatically finds and updates all related component files
5. **Advanced Parameters**: Complex parameter interactions (video + parallax + animations)
