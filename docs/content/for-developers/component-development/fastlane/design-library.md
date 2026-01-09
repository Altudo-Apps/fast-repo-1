# FastLane Design Library Setup Guide

This guide covers how Design Library integration works in FastLane and how to optimize your components for Design Library mode.

## 🎭 What is Design Library Mode?

Design Library mode is a special **Content SDK feature** that allows components to be showcased and tested in isolation, perfect for:

- **Component Documentation** - Showcase all component variants
- **Design System Management** - Live component library within Sitecore
- **Variant Generation** - AI-powered component variant creation
- **Quality Assurance** - Test components independently

> **⚠️ Important**: Design Library mode (`page.mode.isDesignLibrary`) is completely separate from **SXA Partial Design templates** (`templateName === 'Partial Design'`). These are different concepts that serve different purposes.

## 🏗️ FastLane's Design Library Implementation

FastLane automatically supports Design Library mode through its Layout component. **No additional setup is required!**

### Layout.tsx Implementation

FastLane's Layout already includes the required Design Library pattern:

```typescript
// src/Layout.tsx - Already implemented in FastLane!
import { DesignLibrary } from '@sitecore-content-sdk/nextjs';

const Layout = ({ page }: LayoutProps): JSX.Element => {
  const { mode } = page;

  return (
    <>
      <Head>{/* Meta tags */}</Head>
      
      <div className={mainClassPageEditing}>
        {mode.isDesignLibrary ? (
          <DesignLibrary />
        ) : (
          <>
            <header>
              <div id="header">
                {route && <Placeholder name="headless-header" rendering={route} />}
              </div>
            </header>
            <main>
              <div id="content">
                {route && <Placeholder name="headless-main" rendering={route} />}
              </div>
            </main>
            <footer>
              <div id="footer">
                {route && <Placeholder name="headless-footer" rendering={route} />}
              </div>
            </footer>
          </>
        )}
      </div>
    </>
  );
};
```

### Key Features

**✅ Complete Layout Override**: When `mode.isDesignLibrary` is true, the entire normal layout is replaced with `<DesignLibrary />`

**✅ Automatic Component Discovery**: All FastLane components automatically work in Design Library mode

**✅ Zero Configuration**: No additional setup required for FastLane components

## 🎯 Page Mode Detection

FastLane components can detect and respond to different page modes:

```typescript
import { useSitecore } from '@sitecore-content-sdk/nextjs';

const MyComponent = (props) => {
  const { page } = useSitecore();
  const { mode } = page;

  // Available page modes in FastLane
  if (mode.isDesignLibrary) {
    // Design Library showcase mode
  }
  
  if (mode.isEditing) {
    // Content editing mode
  }
  
  if (mode.isPreview) {
    // Preview mode
  }
  
  if (mode.isNormal) {
    // Normal website view
  }
  
  // Component implementation
};
```

## 🧩 Optimizing Components for Design Library

### 1. Design Library Mode Detection

Components can detect and respond to Design Library mode:

```typescript
const MyComponent = (props) => {
  const { page } = useSitecore();
  
  // Design Library mode detection
  if (page.mode.isDesignLibrary) {
    // Component is being showcased in Design Library
    // Provide optimal showcase experience
    return <ComponentShowcaseView {...props} />;
  }
  
  // Normal component rendering
  return <NormalComponentView {...props} />;
};
```

**Note**: The Partial Design template logic in FastLane's Breadcrumb component is **SXA-specific** functionality for providing mock navigation data when components are used in SXA Partial Design templates. This is completely separate from Design Library mode.

### 2. Meaningful Empty States

Provide helpful fallbacks for content authors:

```typescript
// ArticleDate.tsx - Real FastLane implementation
export const Default = (props: ArticleDateProps): JSX.Element => {
  const { page } = useSitecore();
  
  if (!props.fields?.PublishedDate?.value && !page.layout.sitecore?.route?.fields?.PublishedDate) {
    return (
      <p className={`text-sm text-foreground font-medium ${props.params.styles}`}>
        [Article Date]
      </p>
    );
  }
  
  // Component implementation
};
```

### 3. Component Variants Showcase

For components with multiple variants, you can showcase them in Design Library:

```typescript
const MyComponent = (props) => {
  const { page } = useSitecore();
  
  // Optional: Show multiple variants in Design Library
  if (page.mode.isDesignLibrary) {
    return (
      <div className="design-library-showcase">
        <h3>Component Variants</h3>
        <div className="variant-grid">
          <DefaultVariant {...props} />
          <AlternateVariant {...props} />
          <CompactVariant {...props} />
        </div>
      </div>
    );
  }
  
  // Normal single variant rendering
  return <DefaultVariant {...props} />;
};
```

## 🚀 Next.js Integration

Design Library mode is automatically detected during server-side rendering:

```typescript
// [[...path]].tsx - Already implemented in FastLane!
import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';

export const getStaticProps: GetStaticProps = async (context) => {
  let page;
  
  if (context.preview && isDesignLibraryPreviewData(context.previewData)) {
    // Special Design Library data fetching
    page = await client.getDesignLibraryData(context.previewData);
  } else {
    // Normal page data fetching
    page = context.preview
      ? await client.getPreview(context.previewData)
      : await client.getPage(path, { locale: context.locale });
  }
  
  return { props: { page } };
};
```

## 🧪 Testing Design Library Components

Test your components work correctly in Design Library mode:

```typescript
// Component.test.tsx
describe('Design Library Mode', () => {
  it('should provide mock data for Partial Design template', () => {
    mockUseSitecore.mockReturnValue({
      page: {
        layout: {
          sitecore: {
            route: { templateName: 'Partial Design' }
          }
        },
        mode: { 
          isEditing: true,
          isDesignLibrary: true 
        }
      }
    });

    render(<MyComponent params={{}} />);
    
    // Should show mock data for Design Library
    expect(screen.getByText('Sample Content')).toBeInTheDocument();
  });

  it('should handle Design Library mode gracefully', () => {
    mockUseSitecore.mockReturnValue({
      page: {
        layout: { sitecore: {} },
        mode: { isDesignLibrary: true }
      }
    });

    expect(() => render(<MyComponent params={{}} />)).not.toThrow();
  });
});
```

## 🎨 Best Practices for Design Library

### 1. Always Provide Fallbacks

```typescript
// ✅ Good - Meaningful fallback
if (!fields?.Title?.value) {
  return <div className="placeholder">[Component Title]</div>;
}

// ❌ Bad - Empty or broken display
if (!fields?.Title?.value) {
  return null;
}
```

### 2. Handle Edge Cases

```typescript
// Handle null/undefined field values gracefully
const title = fields?.Title?.value || '[No Title Provided]';
const imageUrl = fields?.Image?.value?.src || '/placeholder-image.jpg';
```

### 3. Provide Rich Content for Design Library

```typescript
// ✅ Good - Rich content for Design Library showcase
if (page.mode.isDesignLibrary) {
  // Provide comprehensive data for component showcase
  return (
    <ComponentWithMockData
      title="Annual Financial Report 2024"
      description="Comprehensive overview of our financial performance..."
      publishedDate="2024-01-15T00:00:00Z"
      author="Jane Smith, CFO"
    />
  );
}

// ❌ Bad - Minimal content in Design Library
if (page.mode.isDesignLibrary) {
  return <Component title="Test" />;
}
```

### 4. Respect Content Author Workflow

```typescript
// Don't interfere with normal editing
if (page.mode.isEditing && !page.mode.isDesignLibrary) {
  // Normal edit mode - show real editing experience
  return <EditingView {...props} />;
}

if (page.mode.isDesignLibrary) {
  // Design Library mode - optimized for showcase
  return <ShowcaseView {...props} />;
}
```

## 🔧 Debugging Design Library Issues

### Check Page Mode Detection

```typescript
// Add temporary logging to debug mode detection
console.log('Page modes:', {
  isNormal: page.mode.isNormal,
  isPreview: page.mode.isPreview,
  isEditing: page.mode.isEditing,
  isDesignLibrary: page.mode.isDesignLibrary,
  templateName: page.layout.sitecore.route?.templateName
});
```

### Verify Layout Implementation

Ensure your Layout component includes the Design Library check:

```typescript
// Required pattern in Layout.tsx
{mode.isDesignLibrary ? (
  <DesignLibrary />
) : (
  // Normal layout
)}
```

## 📊 Component Compatibility Checklist

Use this checklist to ensure your FastLane components work well in Design Library:

- [ ] Component handles empty/null field values gracefully
- [ ] Meaningful fallback content for missing data
- [ ] Mock data provided for Partial Design templates (if applicable)
- [ ] No runtime errors in Design Library mode
- [ ] Component renders correctly in isolation
- [ ] Styling works without page-level context
- [ ] Interactive elements work in showcase mode

## 🎯 Advanced Features

### Variant Generation Support

Prepare components for AI-powered variant generation:

```typescript
const MyComponent = (props) => {
  const { page } = useSitecore();
  
  // Check for variant generation mode
  if (page.mode.designLibrary?.isVariantGeneration) {
    // Optimize rendering for AI analysis
    return <OptimizedForAIView {...props} />;
  }
  
  // Normal rendering
};
```

### Component Documentation

Add inline documentation for Design Library:

```typescript
const MyComponent = (props) => {
  return (
    <div data-component="MyComponent" data-version="1.0">
      {/* Component implementation */}
    </div>
  );
};
```

## 🎯 Next Steps

- **Component Development**: See the [FastLane Component Development Guide](./component-development.md)
- **Testing**: See the [FastLane Testing Guide](./testing.md)

---

FastLane's Design Library integration provides a **seamless component showcase experience** with **zero configuration required**. Your components automatically work in Design Library mode while providing rich content author experiences.

## 🔍 Key Concepts Summary

**Design Library Mode** (`page.mode.isDesignLibrary`):
- Content SDK feature for component showcase
- Replaces entire layout with `<DesignLibrary />` component
- Used for component documentation and variant generation

**SXA Partial Design Templates** (`templateName === 'Partial Design'`):
- SXA-specific feature for template building
- Provides mock data for navigation and other contextual components
- Completely separate from Design Library functionality 