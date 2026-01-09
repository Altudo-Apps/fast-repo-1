# Example: Enhance ContentCard Component

This is an example of how to use the [Enhance Existing Component Prompt Template](../templates/enhance-existing-component.md) for adding features to the ContentCard component.

## Prompt Used

```markdown
# Enhance ContentCard Component from Figma Design

## ENHANCEMENT TASK - READ FIRST
You are enhancing the EXISTING ContentCard component, not creating a new one.

CRITICAL: Ensure ALL Figma variants are accounted for in all of the options available
CRITICAL: FIRST!!!! use the Figma MCP Server to explore the designs. The Figma Design Reference links are in the @content-card.md file
CRITICAL: For each Figma URL, execute the figma mcp server tool get_code
 
Files to analyze:
- @ContentCard.tsx  (main wrapper)
 
New features to add:
1. verticalwide orientation option
2. HideImage boolean parameter  
3. HideBorder boolean parameter
4. UseTitleAsLinkText parameter
5. SwapImage parameter

PRESERVE all existing functionality while adding these enhancements.

CRITICAL: Follow guidelines @core-requirements.md documentation.
CRITICAL: Reference the documentation for the ContentCard component at @content-card.md
```

## Context

This example demonstrates enhancing an existing content card component with:
- **New Orientation**: Adding `verticalwide` to existing orientation options
- **Visibility Controls**: Hide image and border options for flexible layouts
- **UX Enhancement**: Using title as link text for better accessibility
- **Layout Control**: Swapping image and content positions

The key aspects of this enhancement:
- **Preserve Existing**: All current orientations (vertical, horizontal-flex, horizontal-equal) remain unchanged
- **Add New Features**: Five new parameters that extend capabilities
- **Component Analysis**: AI analyzes main wrapper and discovers sub-components automatically
- **Backward Compatible**: All existing content continues working exactly as before

## Implementation Notes

This enhancement required:
1. **Sitecore Changes**: Added new parameters to rendering definition
2. **Type Updates**: Extended interfaces for new parameters 
3. **Logic Integration**: Added new conditional logic alongside existing patterns
4. **Component Discovery**: AI automatically found and updated CardItem.tsx and ContentCardBtn.tsx
5. **Documentation Updates**: Added new features to component documentation with Figma references
