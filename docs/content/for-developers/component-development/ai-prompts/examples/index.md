# AI Prompt Examples

This directory contains working examples of how to customize the AI prompt templates for different types of components.

## Create Component Examples

Examples of using the [Create Component Prompt Template](./examples/../templates/create-component.md):

### [Hero Banner Example](./examples/create-hero-banner.md)
Shows how to create a full-screen hero component with:
- Background image support
- Content alignment options  
- Overlay controls for readability
- Responsive design considerations

### [Product Card Example](./examples/create-product-card.md)
Shows how to create an e-commerce product card with:
- Product imagery with multiple aspect ratios
- Price display and formatting
- Interactive elements (cart, wishlist)
- Size variations for different layouts

## Enhance Component Examples

Examples of using the [Enhance Existing Component Prompt Template](./examples/../templates/enhance-existing-component.md):

### [ContentCard Enhancement Example](./examples/enhance-content-card.md)
Shows how to add new features to an existing content card:
- New layout orientations (`verticalwide`)
- Visibility controls (`HideImage`, `HideBorder`)
- UX improvements (`UseTitleAsLinkText`, `SwapImage`)
- Preserving all existing functionality

### [HeroBanner Enhancement Example](./examples/enhance-hero-banner.md)
Shows how to add advanced features to an existing hero banner:
- Video background support with controls
- Parallax scrolling effects
- Multiple call-to-action support
- Animation timing controls
- Mobile optimization features

## Feature Implementation Examples

Complete feature prompts for complex implementations:

### [Complete Wildcard Routing Feature Guide](./wildcard-routing-feature.md)
Comprehensive guide for implementing listing and detail pages with wildcard routing:
- **Two Proven Patterns**: External API/JSON pattern (locations) OR GraphQL pattern (blogs)
- **Wildcard Routing**: Dynamic route handling with `[...path].tsx` pattern
- **API Integration**: Mock API with JSON fallback strategy (External pattern)
- **GraphQL Integration**: Sitecore content queries (GraphQL pattern)
- **Data Injection**: Dynamic meta tags and breadcrumb injection
- **Rich UI Components**: Grid layout, card design, status badges
- **ISR Support**: Incremental Static Regeneration with 5s revalidate
- **Sitecore Integration**: Full Content SDK integration with Experience Editor support
- **TypeScript Types**: Complete type definitions for all data structures
- **Error Handling**: API fallback and 404 handling
- **Real Examples**: Based on working `locations` and `blogs` implementations in this codebase

**Use this pattern for:** Locations, Providers, Products, Blog Posts, Events, or any entity with listing + detail pages

## Usage

1. **Choose the appropriate example** based on your component type and needs
2. **Copy the example prompt** and customize it for your specific requirements
3. **Replace placeholders** with your actual component details
4. **Follow the related workflow documentation** for complete implementation guidance

## Key Patterns

All examples demonstrate:
- ✅ **Proper placeholder usage** - Clear markers for customization points
- ✅ **Complete requirements** - Features, parameters, and fields fully specified
- ✅ **Documentation references** - Proper links to component docs and core requirements
- ✅ **Figma integration** - Using MCP server for design analysis
- ✅ **Backward compatibility** - (Enhancement examples) Preserving existing functionality
