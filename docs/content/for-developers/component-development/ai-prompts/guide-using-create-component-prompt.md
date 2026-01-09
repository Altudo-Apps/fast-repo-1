# Using the Create Component Template

Quick guide for customizing and using the [Create Component Template](./templates/create-component).

**Prerequisites**: Complete [Create New Component Workflow](../../start-here/workflows/create-new-component) through Step 5 before using this template.

## Template Customization (5 minutes)

### 1. Copy Template
- Open [Create Component Template](./templates/create-component)
- Copy entire template content

### 2. Edit Customization Section Only
Edit the top section marked "CUSTOMIZATION SECTION - EDIT THESE VALUES":

```markdown
**Component Name:** ProductCard                    ← Replace {ComponentName}
**Component Documentation:** @product-card.md      ← Replace {component-name}
**File Location:** `src/components/ProductCard.tsx` ← Auto-updates when you change name

**Required Features:**                              ← Replace with your actual features
- Product image with aspect ratio options
- Price display with currency formatting
- Add to cart functionality

**Required Parameters:**                            ← Replace with your Sitecore parameters  
- ImageAspectRatio: Droplist (square, portrait, landscape)
- ShowPrice: Checkbox

**Required Fields:**                                ← Replace with your Sitecore template fields
- ProductName: Single-Line Text
- ProductImage: Image
- Price: Single-Line Text
```

### 3. Leave Standard Instructions Unchanged
- Don't modify anything below the `---` separator line
- Standard instructions ensure consistency and effectiveness

## Template Usage

### 1. Paste and Execute
- Paste customized template into AI assistant
- AI will automatically read your component documentation for Figma links and business logic

### 2. Save Generated Component  
- Save output to file location specified in customization section
- Component-map.ts will update automatically (if `npm run dev` is running)

## What the Template Produces

- **Production-ready component** at your specified file location
- **Full Sitecore Content SDK integration** with proper field rendering
- **All Figma design variants** implemented based on your documentation
- **TypeScript interfaces** and proper error handling

## Template Customization Examples

See working examples:
- [Hero Banner Example](./examples/create-hero-banner) - Full-screen component with backgrounds
- [Product Card Example](./examples/create-product-card) - E-commerce component with pricing

## Complete Process

For the full end-to-end process including Sitecore setup and testing, follow:
**[Create New Component Workflow](../../start-here/workflows/create-new-component)**