# Example: Create ProductCard Component

This is an example of how to use the [Create Component Prompt Template](../templates/create-component.md) for a Product Card component.

## Prompt Used

```markdown
# Create ProductCard Component from Figma Design

## COMPONENT CREATION TASK - READ FIRST
You are creating a NEW ProductCard component from scratch based on Figma designs.

CRITICAL: Ensure ALL Figma variants are accounted for in all of the options available
CRITICAL: FIRST!!!! use the Figma MCP Server to explore the designs. The Figma Design Reference links are in the @product-card.md file
CRITICAL: For each Figma URL, execute the figma mcp server tool get_code

IMPORTANT: The expectation is that the developer is running `npm run dev` while this prompt is being executed - as such - the `component-map.ts` file will get generated automatically once you complete generating the new component.

## Component Information
**Component Name:** ProductCard
**File Location:** `src/components/ProductCard.tsx`
**Documentation:** `docs/pages/library/components/product-card.md`

## Implementation Requirements

### Required Features:
- Product image with aspect ratio options
- Price display with currency formatting
- Add to cart functionality
- Wishlist toggle support
- Stock status indicators

### Required Parameters:
- ImageAspectRatio: Droplist (square, portrait, landscape)
- ShowPrice: Checkbox
- ShowAddToCart: Checkbox
- CardSize: Droplist (small, medium, large)

### Required Fields:
- ProductName: Single-Line Text
- ProductImage: Image
- Price: Single-Line Text
- Description: Rich Text
- ProductLink: General Link

CRITICAL: Follow guidelines @core-requirements.md documentation.
CRITICAL: Reference the component documentation at @product-card.md for all business logic, field definitions, and Figma design links.
```

## Context

This example demonstrates creating an e-commerce product card with:
- Product imagery with multiple aspect ratios
- Price display and formatting
- Interactive elements (cart, wishlist)
- Size variations for different layouts
- Stock and availability indicators

The key aspects customized from the template:
- **Component Name**: ProductCard
- **Features**: E-commerce specific functionality
- **Parameters**: Image ratios, visibility controls, sizing
- **Fields**: Product-specific content fields
