# Using the Enhance Component Template

Quick guide for customizing and using the [Enhance Component Template](./templates/enhance-existing-component).

**Prerequisites**: Complete [Enhance Existing Component Workflow](../../start-here/workflows/enhance-existing-component) through Step 5 before using this template.

## Template Customization (5 minutes)

### 1. Copy Template
- Open [Enhance Component Template](./templates/enhance-existing-component)  
- Copy entire template content

### 2. Edit Customization Section Only
Edit the top section marked "CUSTOMIZATION SECTION - EDIT THESE VALUES":

```markdown
**Component Name:** ContentCard                     ← Replace {ComponentName}
**Component Documentation:** @content-card.md       ← Replace {component-name}

**Files to analyze:**                               ← AI will discover sub-components automatically
- @ContentCard.tsx  (main wrapper)

**New features to add:**                            ← Replace with your actual enhancement requirements
1. verticalwide orientation option
2. HideImage boolean parameter  
3. HideBorder boolean parameter
4. UseTitleAsLinkText parameter
5. SwapImage parameter
```

### 3. Leave Standard Instructions Unchanged
- Don't modify anything below the `---` separator line
- Standard instructions ensure consistency and preserve existing functionality

## Template Usage

### 1. Paste and Execute
- Paste customized template into AI assistant
- AI will read your component documentation for Figma links and analyze existing implementation

### 2. Review Generated Changes
- AI will modify existing component files to add new features
- Verify all existing functionality is preserved
- Check that new features integrate properly

## What the Template Produces

- **Enhanced component files** with new features added
- **Preserved existing functionality** - no breaking changes
- **Updated TypeScript interfaces** for new parameters
- **Integrated conditional logic** that works with existing patterns

## Template Customization Examples

See working examples:
- [ContentCard Enhancement Example](./examples/enhance-content-card) - Adding layout and visibility options
- [HeroBanner Enhancement Example](./examples/enhance-hero-banner) - Adding video backgrounds and advanced features

## Complete Process

For the full end-to-end process including Sitecore configuration and comprehensive testing, follow:
**[Enhance Existing Component Workflow](../../start-here/workflows/enhance-existing-component)**
