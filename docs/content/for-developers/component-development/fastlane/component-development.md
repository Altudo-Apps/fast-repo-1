# FastLane Component Development Guide

This guide covers how to develop components within the FastLane framework, based on the actual patterns used in the FastLane codebase.

## 🏗️ FastLane Architecture Overview

FastLane uses a **single-layer component architecture** with atomic design principles:

```
headapps/nextjs-starter/src/
├── components/          # Main Sitecore components
├── core/
│   ├── atom/           # Base UI elements
│   ├── molecules/      # Composite components  
│   ├── ui/             # Reusable UI components
│   └── lib/            # Utilities and helpers
├── types/              # TypeScript definitions
└── lib/                # Shared utilities
```

## 📝 Component Structure

### Basic Component Pattern

FastLane components follow this standard structure:

```typescript
// ArticleDate.tsx
import { JSX } from 'react';
import { useSitecore, DateField } from '@sitecore-content-sdk/nextjs';

export interface ArticleDateFields {
  PublishedDate: DateFieldProps;
}

export type ArticleDateProps = {
  params: { [key: string]: string };
  fields: ArticleDateFields;
};

export const Default = (props: ArticleDateProps): JSX.Element => {
  const { page } = useSitecore();  // 🎯 Access page context
  const id = props.params.RenderingIdentifier;

  // Handle empty state
  if (!props.fields?.PublishedDate?.value && !page.layout.sitecore?.route?.fields?.PublishedDate) {
    return <p className={props.params.styles}>[Article Date]</p>;
  }

  // Component implementation
  return (
    <DateField 
      field={field} 
      render={(date) => formatSitecoreDate(date?.toISOString() ?? '')} 
    />
  );
};
```

### Key Patterns in FastLane Components

**1. useSitecore Hook Usage**
```typescript
const { page } = useSitecore();
const isPageEditing = page.mode.isEditing;
```

**2. Fallback Rendering**
```typescript
// Always provide meaningful fallbacks for content authors
if (!props.fields?.RequiredField) {
  return <div>[Component Name]</div>;
}
```

**3. Page Mode Awareness**
```typescript
// Handle Design Library mode
if (page.mode.isDesignLibrary) {
  // Component is being showcased in Design Library
  return <ComponentShowcaseView {...props} />;
}

// Handle normal editing mode
if (page.mode.isEditing) {
  // Component is in content editing mode
  return <EditingView {...props} />;
}
```

## 🎯 Component Props Interface

FastLane uses a standardized props interface:

```typescript
// From lib/component-props/index.ts
export type ComponentProps = {
  rendering: ComponentRendering;
  params: ComponentParams & {
    RenderingIdentifier?: string;
    styles?: string;
    EnabledPlaceholders?: string;
  };
};
```

**Use this for any component that doesn't need specific fields:**
```typescript
import { ComponentProps } from 'lib/component-props';

const MyComponent = (props: ComponentProps): JSX.Element => {
  const styles = props?.params?.styles;
  // Component implementation
};
```

## 🧱 Atomic Design in FastLane

### Atoms (`src/core/atom/`)
Basic UI elements like images, buttons:
```typescript
// Used throughout FastLane
import { SitecoreImage } from 'src/core/atom/Images';
import { SitecoreLink } from 'src/core/atom/Link';
```

### Molecules (`src/core/molecules/`)
Composite components combining atoms:
```typescript
// ContentCard combines multiple atoms
const CardItem = ({ fields, CardOrientation, ImageOrder }: CardItemProps) => {
  return (
    <Card className="font-satoshi overflow-hidden p-6">
      {fields?.Icon?.value?.src && (
        <SitecoreImage field={fields.Icon} className="w-8 h-8" />
      )}
      <Text field={fields.Title} tag="h3" />
      <RichText field={fields.Description} />
    </Card>
  );
};
```

### UI Components (`src/core/ui/`)
Reusable UI patterns:
```typescript
// Used in components like Breadcrumb
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from 'src/core/ui/breadcrumb';
```

## 🎭 Design Library Integration

FastLane automatically supports Design Library mode through the Layout component:

```typescript
// Layout.tsx - Already implemented in FastLane
{mode.isDesignLibrary ? (
  <DesignLibrary />
) : (
  <>
    <header>{/* Normal layout */}</header>
    <main>{/* Normal layout */}</main>
  </>
)}
```

**Components automatically work in Design Library** without modification, but you can add specific handling:

```typescript
const MyComponent = (props: ComponentProps) => {
  const { page } = useSitecore();
  
  // Optional: Special behavior for Design Library
  if (page.mode.isDesignLibrary) {
    // Showcase multiple variants or states
  }
  
  // Normal component logic
};
```

## 🔧 Content SDK Integration

### Field Rendering
FastLane components use Content SDK field components:

```typescript
import { Text, RichText, DateField } from '@sitecore-content-sdk/nextjs';

// Text fields
<Text field={fields.Title} tag="h2" className="text-2xl" />

// Rich text fields  
<RichText field={fields.Description} />

// Date fields with custom formatting
<DateField 
  field={fields.PublishedDate}
  render={(date) => formatSitecoreDate(date?.toISOString() ?? '')}
/>
```

### Image Handling
```typescript
import { SitecoreImage } from 'src/core/atom/Images';

// Standard image rendering
<SitecoreImage field={fields.Image} className="w-full h-auto" />

// Conditional image rendering
{fields?.Image?.value?.src && (
  <SitecoreImage field={fields.Image} className="object-cover" />
)}
```

### Link Handling
```typescript
import { SitecoreLink } from 'src/core/atom/Link';

// Conditional link wrapping
const shouldWrapWithLink = !page.mode.isEditing && fields.TargetUrl?.value?.href;

return shouldWrapWithLink ? (
  <SitecoreLink field={fields.TargetUrl}>
    <ComponentContent />
  </SitecoreLink>
) : (
  <ComponentContent />
);
```

## 📊 Page Context Access

Use `useSitecore()` to access comprehensive page context:

```typescript
const { page } = useSitecore();

// Page modes
page.mode.isNormal       // Normal website view
page.mode.isPreview      // Preview mode
page.mode.isEditing      // Content editing mode  
page.mode.isDesignLibrary // Design library mode

// Page data
page.layout.sitecore.route.fields     // Page-level fields
page.layout.sitecore.context         // Site context
page.siteName                         // Current site
page.locale                           // Current language
```

## 🎨 Styling Approach

FastLane uses **Tailwind CSS** with a design system approach:

```typescript
// Use Tailwind classes directly
<div className="bg-background text-foreground p-6 rounded-lg">

// Combine with conditional classes
<div className={cn(
  'flex w-full gap-6',
  {
    'flex-col md:items-start': isVertical,
    'flex-row': isHorizontal,
  }
)}>

// Apply component-specific styles
<p className={`text-sm text-foreground font-medium ${props.params.styles}`}>
```

## 🚀 Best Practices

### 1. Always Handle Empty States
```typescript
// Provide meaningful fallbacks
if (!fields?.RequiredField) {
  return <div className="component-placeholder">[Component Name]</div>;
}
```

### 2. Respect Page Modes
```typescript
// Don't wrap links in edit mode
const shouldWrapWithLink = !page.mode.isEditing && fields.TargetUrl?.value?.href;
```

### 3. Use Semantic HTML
```typescript
// Choose appropriate HTML elements
<Text field={fields.Title} tag="h2" />  // Not just <div>
<Text field={fields.Description} tag="p" />
```

### 4. Handle Conditional Rendering
```typescript
// Check for field values before rendering
{fields?.Image?.value?.src && (
  <SitecoreImage field={fields.Image} />
)}
```

### 5. Extract Reusable Logic
```typescript
// Create utility functions for common operations
const formatSitecoreDate = (sitecoreDateString: string) => {
  const dateOnly = sitecoreDateString.slice(0, 10);
  const date = new Date(dateOnly + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
  });
};
```

## 📁 File Organization

Follow FastLane's established patterns:

```
components/
├── MyComponent.tsx           # Main component implementation
├── MyComponent.test.tsx      # Component tests
└── subfolder/               # For complex components
    ├── MyComponent.tsx      # Main component  
    ├── MyComponent.test.tsx # Tests
    └── SubComponent.tsx     # Related components
```

## 🎯 Next Steps

- **Testing**: See the [FastLane Testing Guide](./testing.md)
- **Design Library**: See the [FastLane Design Library Setup](./design-library.md)
- **Core Architecture**: See the [FastLane Core Architecture](./core-architecture.md)

---

This guide covers the foundational patterns for building components within FastLane. The architecture is designed for **maintainability**, **testability**, and **Design Library compatibility** while providing a great developer experience. 