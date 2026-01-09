---
title: Figma → shadcn Component Prompt
---

# Figma → shadcn Component Prompt

Generate production-ready React components from Figma designs using the Figma MCP and shadcn MCP servers. This prompt extracts design specifications directly from Figma and generates fully-typed, accessible components.

---

## 🎯 Quick Start

1. **Copy the prompt** below
2. **Replace the Figma URL placeholder** with your component's Figma link
3. **Customize the configuration section** as needed
4. **Execute in Cursor** (ensure MCP servers are configured)

---

## 📋 Prerequisites

Before using this prompt, ensure:

- ✅ **Figma MCP server** is configured
- ✅ **shadcn MCP server** is configured
- ✅ **shadcn/ui** is initialized in your project
- ✅ You have **read access** to the Figma file
- ✅ **For responsive designs:** Collect Figma URLs for each breakpoint (Desktop, Tablet, Mobile)

### Two Figma Access Requirements

| Requirement | Purpose | How to Get |
|-------------|---------|-----------|
| 🔑 **Personal Access Token** | MCP API authentication | [figma.com/settings](https://www.figma.com/settings) → "Personal access tokens" (Free) |
| 🔓 **Dev Mode Access** | Copy URLs with `node-id` | Press `Shift + D` in Figma editor (May require paid plan) |

See [MCP Workflow & Setup](./mcp-workflow) for detailed configuration instructions.

### 📱 Responsive Design Note

For responsive components, Figma designs typically have **separate frames for each breakpoint**. You'll need to provide multiple Figma URLs:

| Breakpoint | Typical Width | Figma Frame |
|------------|---------------|-------------|
| Desktop | 1440px+ | Desktop version frame |
| Tablet | 768px - 1024px | Tablet version frame |
| Mobile | 320px - 767px | Mobile version frame |

Each frame may have a different `node-id` in Figma. Copy the URL for each responsive variant to ensure the generated component handles all breakpoints correctly.

---

## 📋 The Prompt

Copy the entire prompt below and paste it into your AI assistant:

````text
# Figma → shadcn Component Generation

## CONFIGURATION SECTION - CUSTOMIZE THESE VALUES

**Component Name:** {ComponentName}
**Output Directory:** src/components/ui/{ComponentName}

### Figma Design URLs (provide links for each breakpoint)

| Breakpoint | Figma URL |
|------------|-----------|
| **Desktop (1440px+)** | <PASTE DESKTOP FIGMA URL HERE> |
| **Tablet (768-1024px)** | <PASTE TABLET FIGMA URL HERE OR "Same as Desktop"> |
| **Mobile (320-767px)** | <PASTE MOBILE FIGMA URL HERE OR "Same as Desktop"> |

> **Note:** Each Figma frame/breakpoint may have a different `node-id`. Copy the URL for each responsive variant from Figma. If a breakpoint uses the same design, write "Same as Desktop" or "Same as Tablet".

**Integration Type:** (choose one)
- [ ] Standalone shadcn component (no Sitecore integration)
- [x] Sitecore XMC integrated component

**Additional Requirements:**
- [Add any specific requirements here]
- [e.g., "Must support dark mode"]
- [e.g., "Needs animation on hover"]

---

## EXECUTION INSTRUCTIONS

### Step 1: Extract Design from Figma

CRITICAL: Use the Figma MCP server to extract design information from ALL provided breakpoint URLs.

Execute the following MCP tools for EACH Figma URL (Desktop, Tablet, Mobile):

1. **Get the component node data for each breakpoint:**
   - Use `figma_get_node` with the node-id from each Figma URL
   - Extract: component structure, dimensions, padding, margins
   - Note differences between breakpoints (layout changes, hidden elements, spacing adjustments)

2. **Get design tokens:**
   - Use `figma_get_styles` to extract:
     - Colors (fills, strokes, effects)
     - Typography (font family, size, weight, line-height)
     - Spacing (padding, gaps, margins)
     - Border radius and shadows
   - Note any token variations between breakpoints (e.g., smaller text on mobile)

3. **Get component variants (if applicable):**
   - Identify all variants in the component set
   - Extract variant properties and their values
   - Note state-based variants (hover, focus, disabled)

4. **Document responsive differences:**
   - Layout changes (e.g., horizontal → vertical stack)
   - Element visibility (e.g., hidden on mobile)
   - Spacing/sizing adjustments per breakpoint
   - Typography scale changes

### Step 2: Map to shadcn Components

Based on the extracted Figma data, identify:

1. **Base shadcn component** to extend or compose (button, card, input, etc.)
2. **Required shadcn primitives** (if building from Radix UI)
3. **Additional shadcn components** needed for composition

Use `shadcn_list_components` to verify available components.

### Step 3: Generate Component

Create the component with these requirements:

#### Technical Requirements

- **Framework:** React 18+ with TypeScript
- **Styling:** Tailwind CSS with shadcn conventions
- **Accessibility:** WCAG 2.1 AA compliant
- **SSR:** Compatible with Next.js App Router

#### Code Requirements

```typescript
// Required structure for component file
import { cn } from '@/lib/utils'; // shadcn utility
import { ComponentProps } from 'react';

// If Sitecore integration:
import { withDatasourceCheck } from '@sitecore-content-sdk/nextjs';

interface {ComponentName}Props {
  // Strongly typed props from Figma variants
}

export const {ComponentName} = ({ ...props }: {ComponentName}Props) => {
  // Implementation using shadcn patterns
};

// Export variations
export default {ComponentName};
```

#### Styling Requirements

- Map Figma design tokens to Tailwind classes
- Use CSS variables for theming (--primary, --secondary, etc.)
- Follow shadcn class naming conventions
- **Implement responsive breakpoints from all provided Figma URLs:**
  - Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)
  - Map Desktop design → `lg:` and above
  - Map Tablet design → `md:` breakpoint
  - Map Mobile design → default (mobile-first) styles

#### Variant Implementation

For each Figma variant, create:
- TypeScript union type for variant prop
- Corresponding Tailwind class mappings using `cva` or conditional classes
- Proper default values

### Step 4: Generate Tests

Create comprehensive unit tests:

```typescript
// {ComponentName}.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { {ComponentName} } from './{ComponentName}';

expect.extend(toHaveNoViolations);

describe('{ComponentName}', () => {
  // Render tests for all variants
  // Interaction tests (click, hover, focus)
  // Accessibility tests with axe
  // Props validation tests
});
```

### Step 5: Output Files

Generate the following files:

1. **`{ComponentName}.tsx`** - Main component
2. **`{ComponentName}.test.tsx`** - Unit tests
3. **`index.ts`** - Barrel export

If Sitecore integration is selected, also include:
- Sitecore field type definitions
- `withDatasourceCheck` wrapper
- Component rendering params interface

---

## OUTPUT FORMAT

Provide each file as a separate code block with explicit path:

```tsx
// path=src/components/ui/{ComponentName}/{ComponentName}.tsx
[component code]
```

```tsx
// path=src/components/ui/{ComponentName}/{ComponentName}.test.tsx
[test code]
```

```ts
// path=src/components/ui/{ComponentName}/index.ts
[barrel export]
```

---

## QUALITY CHECKLIST

Before completing, verify:

- [ ] All Figma variants are implemented
- [ ] TypeScript types are strict (no `any`)
- [ ] Accessibility attributes are present (aria-*, role)
- [ ] Keyboard navigation works
- [ ] Focus states match Figma design
- [ ] **Responsive behavior matches ALL provided Figma breakpoints:**
  - [ ] Desktop layout matches Desktop Figma URL
  - [ ] Tablet layout matches Tablet Figma URL  
  - [ ] Mobile layout matches Mobile Figma URL
- [ ] Tests cover all variants and interactions
- [ ] Code follows shadcn conventions
````

---

## 📝 Example Usage

### Example 1: Simple Button Component

**Input Configuration:**

```markdown
**Component Name:** ActionButton
**Output Directory:** src/components/ui/ActionButton

### Figma Design URLs

| Breakpoint | Figma URL |
|------------|-----------|
| **Desktop (1440px+)** | https://www.figma.com/file/ABC123/Design-System?node-id=100:200 |
| **Tablet (768-1024px)** | Same as Desktop |
| **Mobile (320-767px)** | Same as Desktop |

**Integration Type:**
- [x] Standalone shadcn component (no Sitecore integration)

**Additional Requirements:**
- Must support loading state with spinner
- Needs icon support (left or right position)
```

**Generated Output:**

The AI will analyze the Figma design and generate:

```tsx
// path=src/components/ui/ActionButton/ActionButton.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ className, variant, size, asChild = false, loading, icon, iconPosition = 'left', children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!loading && icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
        {children}
        {!loading && icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      </Comp>
    );
  }
);

ActionButton.displayName = 'ActionButton';

export { ActionButton, buttonVariants };
```

---

### Example 2: Sitecore-Integrated Card Component (with Responsive Breakpoints)

**Input Configuration:**

```markdown
**Component Name:** FeatureCard
**Output Directory:** src/components/FeatureCard

### Figma Design URLs

| Breakpoint | Figma URL |
|------------|-----------|
| **Desktop (1440px+)** | https://www.figma.com/file/XYZ789/Website?node-id=500:600 |
| **Tablet (768-1024px)** | https://www.figma.com/file/XYZ789/Website?node-id=500:650 |
| **Mobile (320-767px)** | https://www.figma.com/file/XYZ789/Website?node-id=500:700 |

**Integration Type:**
- [x] Sitecore XMC integrated component

**Additional Requirements:**
- Must support Experience Editor inline editing
- Image field with responsive sizes
- CTA button linking to Sitecore link field
- Desktop: Horizontal card layout with image on left
- Tablet: Same as desktop but smaller image
- Mobile: Vertical stack with image on top
```

**Generated Output (partial):**

```tsx
// path=src/components/FeatureCard/FeatureCard.tsx
import { JSX } from 'react';
import {
  ComponentParams,
  ComponentRendering,
  Field,
  ImageField,
  LinkField,
  Text,
  Image,
  Link,
  useSitecore,
  withDatasourceCheck,
} from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Fields {
  Title: Field<string>;
  Description: Field<string>;
  Image: ImageField;
  CTA: LinkField;
}

type FeatureCardProps = {
  params: { [key: string]: string };
  fields: Fields;
  rendering: ComponentRendering & { params: ComponentParams };
};

export const FeatureCard = (props: FeatureCardProps): JSX.Element => {
  const { page } = useSitecore();
  const isEditing = page.mode.isEditing;
  
  return (
    <Card className={cn('overflow-hidden', props.params.styles)}>
      <CardHeader className="p-0">
        <Image
          field={props.fields.Image}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-6">
        <Text
          tag="h3"
          field={props.fields.Title}
          className="text-xl font-semibold mb-2"
        />
        <Text
          tag="p"
          field={props.fields.Description}
          className="text-muted-foreground"
        />
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild>
          <Link field={props.fields.CTA} />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default withDatasourceCheck()<FeatureCardProps>(FeatureCard);
```

---

## 🎯 Best Practices

### Before Running the Prompt

- ✅ Verify all Figma URLs are accessible with your token
- ✅ Ensure the component frame is properly named
- ✅ Check that all variants are included in the design
- ✅ Confirm design tokens are applied consistently
- ✅ **Collect Figma URLs for all responsive breakpoints** (Desktop, Tablet, Mobile)
- ✅ Note any layout differences between breakpoints (stack direction, visibility, spacing)

### Customizing the Output

- Modify the **Output Directory** to match your project structure
- Add specific **Additional Requirements** for unique needs
- Choose the correct **Integration Type** for your use case

### After Generation

- ✅ Review generated TypeScript interfaces
- ✅ Verify Tailwind classes match your theme
- ✅ Run the test suite to ensure coverage
- ✅ Test keyboard navigation and screen reader support
- ✅ If Sitecore integrated, test in Experience Editor

---

## 🔗 Related Resources

- [MCP Workflow & Setup](./mcp-workflow) - Server configuration guide
- [Create Component Template](../templates/create-component) - Alternative workflow
- [Core Requirements](../templates/core-requirements) - FastLane coding standards
- [Azure DevOps → AI Prompt](../azure-devops/azuredevops-to-ai-component-prompt) - Story-driven workflow

---

## ❓ Troubleshooting

### MCP Tools Not Available

If MCP tools don't appear:
1. Verify MCP servers are configured in Cursor settings
2. Restart Cursor completely
3. Check the MCP debug logs for errors

### Figma Access Denied

If Figma returns access errors:
1. Verify your access token is valid
2. Check file sharing permissions
3. Ensure the token has read access

### Component Generation Issues

If generation fails or produces incorrect output:
1. Verify the Figma design follows Auto Layout
2. Check that design tokens are properly applied
3. Simplify complex designs into smaller components

---

**Need help with MCP setup?** See the [MCP Workflow & Setup](./mcp-workflow) guide for detailed configuration instructions.

