# AI Prompt Templates

This directory contains the core AI prompt templates and standards for component development.

## Core Standards

### [Core Requirements & Standards](./templates/core-requirements)
Implementation patterns, coding standards, and critical requirements referenced by all templates.

**Contains:**
- Sitecore Content SDK integration patterns
- TypeScript and accessibility requirements
- Common pitfalls to avoid
- Critical implementation patterns

## Templates

### [Create Component](./templates/create-component)
Template for creating completely new components from Figma designs with full Sitecore integration.

**Use when:**
- Creating a brand new component that doesn't exist
- Implementing Figma designs for the first time
- Building reusable components for content authors

### [Enhance Existing Component](./templates/enhance-existing-component)
Template for adding new features to existing components while preserving all current behavior.

**Use when:**
- Adding new rendering parameters to existing components
- Creating new component variants or orientations
- Adding new fields or functionality
- Enhancing capabilities while maintaining backward compatibility

## How to Use Templates

1. **Copy the entire template** content from the appropriate template file
2. **Edit only the "CUSTOMIZATION SECTION"** at the top
3. **Replace placeholders** with your specific requirements:
   - Component names and documentation references
   - Main wrapper file to analyze (AI discovers sub-components automatically)
   - Features, parameters, and fields as needed
4. **Leave everything below the separator line** unchanged
5. **Paste the customized prompt** into your AI assistant

## Template Structure

All templates follow the same optimized structure:
- **Customization Section** (top) - All developer edits happen here
- **Separator line** (`---`)
- **Standard Instructions** (bottom) - Never modified, ensures consistency

This design makes templates DRY (Don't Repeat Yourself) and puts all customization points at the top for easy editing.
