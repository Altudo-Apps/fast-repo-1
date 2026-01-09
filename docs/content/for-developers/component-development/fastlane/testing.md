# FastLane Testing Guide

This comprehensive guide covers testing patterns for FastLane components using the Content SDK, based on actual test implementations in the FastLane codebase.

## 🧪 Testing Architecture

FastLane uses **Vitest** for testing with comprehensive mocking patterns for Content SDK integration.

**Technology Stack:**
- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** - Component testing utilities
- **[@sitecore-content-sdk/nextjs](https://github.com/Sitecore/content-sdk)** - Content SDK integration

## 📝 Basic Test Structure

### Standard FastLane Test Pattern

Every FastLane component test follows this pattern:

```typescript
// Breadcrumb.test.tsx - Real FastLane example
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import BreadCrumb from './Breadcrumb';

// Mock the Content SDK hook
vi.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: vi.fn(),
}));

const mockUseSitecore = useSitecore as ReturnType<typeof vi.fn>;

describe('BreadCrumb Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render component correctly', () => {
    // Test implementation
  });
});
```

## 🎯 Content SDK Mocking Patterns

### Pattern 1: Simple Component Mock

For components that only need basic editing state:

```typescript
vi.spyOn(SitecoreContentSdk, 'useSitecore').mockReturnValue({
  page: {
    mode: { 
      isEditing: false,
      isPreview: false,
      isNormal: true,
      isDesignLibrary: false,
    },
  },
});
```

**Used in**: CTAButton, ContentSection, basic components

### Pattern 2: Complex Page Data Mock

For components that access page route fields or context:

```typescript
const mockPageContext = {
  page: {
    layout: {
      sitecore: {
        context: {
          breadCrumbsContext: [
            { Url: '/', PageTitle: 'Home', HideInBreadcrumb: false },
            { Url: '/products', PageTitle: 'Products', HideInBreadcrumb: false }
          ]
        },
        route: {
          fields: {
            PublishedDate: {
              value: '2024-01-15T00:00:00Z'
            }
          },
          templateName: 'Standard Page'
        }
      }
    },
    mode: {
      isNormal: true,
      isPreview: false,
      isEditing: false,
      isDesignLibrary: false,
    },
    siteName: 'fastlane',
    locale: 'en'
  }
};
```

**Used in**: ArticleDate, Breadcrumb, PageTitleBanner

### Pattern 3: Module-Level Mock

For consistent mocking across all tests in a file:

```typescript
vi.mock('@sitecore-content-sdk/nextjs', async () => {
  const actual = await vi.importActual<typeof import('@sitecore-content-sdk/nextjs')>(
    '@sitecore-content-sdk/nextjs'
  );
  return {
    ...actual,
    Text: ({ field }: any) => <span data-testid="text-field">{field?.value}</span>,
    RichText: ({ field }: any) => (
      <div data-testid="rich-text-field" dangerouslySetInnerHTML={{ __html: field?.value || '' }} />
    ),
    useSitecore: vi.fn(() => ({
      page: { 
        mode: { 
          isEditing: false,
          isPreview: false,
          isNormal: true,
          isDesignLibrary: false,
        }
      },
    })),
  };
});
```

**Used in**: Accordion, components with consistent mock needs

## 🎭 Testing Page Modes

### Testing Edit Mode Behavior

```typescript
describe('Edit Mode Behavior', () => {
  it('should show component in edit mode when no data', () => {
    mockUseSitecore.mockReturnValue({
      page: {
        layout: { sitecore: { context: {} } },
        mode: { isEditing: true }
      }
    });

    render(<MyComponent params={{}} />);
    
    // Component should render editing view even with no data
    expect(screen.getByTestId('editing-view')).toBeInTheDocument();
  });
});
```

### Testing Design Library Mode

```typescript
describe('Design Library Mode', () => {
  it('should render Design Library showcase when in Design Library mode', () => {
    mockUseSitecore.mockReturnValue({
      page: {
        layout: { sitecore: { context: {} } },
        mode: { 
          isDesignLibrary: true,
          isEditing: false 
        }
      }
    });

    render(<MyComponent params={{}} />);
    
    // Should render Design Library optimized view
    expect(screen.getByTestId('design-library-showcase')).toBeInTheDocument();
  });
});
```

## 🎨 Testing Content SDK Fields

### Mocking Sitecore Fields

**Image Fields:**
```typescript
const mockImageField = {
  value: {
    src: '/test-image.png',
    alt: 'Test Image',
    width: 24,
    height: 24,
  },
  editable: '',
};
```

**Link Fields:**
```typescript
const mockLinkField = {
  value: {
    href: '/test-link',
    text: 'Test Link',
    title: 'Test Link',
    target: '',
  },
  editable: '',
};
```

**Text Fields:**
```typescript
const mockTextField = {
  value: 'Test Text Content',
  editable: '',
};
```

**Rich Text Fields:**
```typescript
const mockRichTextField = {
  value: '<p>Rich text <strong>content</strong></p>',
  editable: '',
};
```

### Testing DateField Components

```typescript
// ArticleDate.test.tsx - Real FastLane example
describe('ArticleDate Component', () => {
  it('should format and display date correctly', () => {
    const mockProps = {
      fields: {
        PublishedDate: {
          value: '2024-01-15T00:00:00Z'
        }
      },
      params: { styles: 'test-style' }
    };

    mockUseSitecore.mockReturnValue({
      page: {
        layout: { sitecore: { route: { fields: {} } } },
        mode: { isEditing: false }
      }
    });

    render(<Default {...mockProps} />);
    
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
  });

  it('should show fallback when no date provided', () => {
    const mockProps = {
      fields: {},
      params: { styles: 'test-style' }
    };

    mockUseSitecore.mockReturnValue({
      page: {
        layout: { sitecore: { route: { fields: {} } } },
        mode: { isEditing: false }
      }
    });

    render(<Default {...mockProps} />);
    
    expect(screen.getByText('[Article Date]')).toBeInTheDocument();
  });
});
```

### Testing Conditional Rendering

```typescript
describe('Conditional Rendering', () => {
  it('should hide component when no breadcrumbs and not editing', () => {
    mockUseSitecore.mockReturnValue({
      page: {
        layout: {
          sitecore: {
            context: { breadCrumbsContext: [] }
          }
        },
        mode: { isEditing: false }
      }
    });

    const { container } = render(<MyComponent params={{}} />);
    
    // Component should not render anything
    expect(container.firstChild).toBeNull();
  });

  it('should show component in edit mode even with no data', () => {
    mockUseSitecore.mockReturnValue({
      page: {
        layout: {
          sitecore: {
            context: { breadCrumbsContext: [] }
          }
        },
        mode: { isEditing: true }
      }
    });

    render(<MyComponent params={{}} />);
    
    // Should render something for editors
    expect(screen.getByTestId('editing-placeholder')).toBeInTheDocument();
  });
});
```

## 🧱 Testing FastLane's Atomic Architecture

### Testing Atoms (Base Components)

```typescript
// Testing SitecoreImage atom
describe('SitecoreImage Atom', () => {
  it('should render image with correct attributes', () => {
    const mockImageField = {
      value: { src: '/test.jpg', alt: 'Test Image' }
    };

    render(<SitecoreImage field={mockImageField} className="test-class" />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/test.jpg');
    expect(image).toHaveAttribute('alt', 'Test Image');
    expect(image).toHaveClass('test-class');
  });
});
```

### Testing Molecules (Complex Components)

```typescript
// ContentCard.test.tsx - Real FastLane molecule
describe('ContentCard Molecule', () => {
  const mockCardProps = {
    fields: {
      Title: { value: 'Test Title' },
      Description: { value: 'Test Description' },
      Image: { value: { src: '/test-image.jpg' } },
      Icon: { value: { src: '/test-icon.svg' } }
    },
    CardOrientation: 'vertical',
    ImageOrder: 'left',
    headingTag: 'h3',
    LinkType: 'Button'
  };

  it('should render all content fields', () => {
    render(<CardItem {...mockCardProps} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', '/test-image.jpg');
  });

  it('should apply correct orientation classes', () => {
    render(<CardItem {...mockCardProps} />);
    
    const container = screen.getByTestId('card-content');
    expect(container).toHaveClass('flex-col', 'md:items-start');
  });
});
```

### Testing UI Components (Design System)

```typescript
// Testing pure UI components (no Sitecore dependencies)
describe('Breadcrumb UI Component', () => {
  it('should render breadcrumb navigation', () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Current')).toBeInTheDocument();
  });
});
```

## 🎯 Testing Component Props

### Testing ComponentProps Interface

```typescript
describe('Component Props', () => {
  it('should apply styles from params', () => {
    const mockProps = {
      params: {
        styles: 'custom-style-class',
        RenderingIdentifier: 'test-id'
      },
      fields: { /* field data */ }
    };

    render(<MyComponent {...mockProps} />);
    
    const element = screen.getByTestId('component-wrapper');
    expect(element).toHaveClass('custom-style-class');
    expect(element).toHaveAttribute('id', 'test-id');
  });
});
```

## 🔧 Mocking External Dependencies

### Mocking Lucide Icons

```typescript
// Mock icons used by components
vi.mock('lucide-react', async (importOriginal) => {
  const actual = (await importOriginal()) as any;
  return {
    ...actual,
    ChevronRight: (props: any) => <svg {...props} data-testid="chevron-right" />,
    MoreHorizontal: (props: any) => <svg {...props} data-testid="more-horizontal" />,
  };
});
```

### Mocking Next.js Components

```typescript
// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));
```

## 🚀 User Interaction Testing

```typescript
import userEvent from '@testing-library/user-event';

it('handles user interactions', async () => {
  const user = userEvent.setup();
  
  mockUseSitecore.mockReturnValue({
    page: { mode: { isEditing: false } },
  });

  render(<Component />);
  
  const button = screen.getByRole('button');
  await user.click(button);
  
  expect(screen.getByText('Clicked!')).toBeInTheDocument();
});
```

## ⏱️ Testing Async Operations

```typescript
it('handles async operations', async () => {
  mockUseSitecore.mockReturnValue({
    page: { mode: { isEditing: false } },
  });

  render(<Component />);
  
  // Wait for async content to load
  await screen.findByText('Loaded Content');
  
  expect(screen.getByText('Loaded Content')).toBeInTheDocument();
});
```

## ⚡ Performance Testing

### Testing Component Rendering Performance

```typescript
describe('Performance', () => {
  it('should render efficiently with large datasets', () => {
    const largeBreadcrumbList = Array.from({ length: 100 }, (_, i) => ({
      Url: `/page-${i}`,
      PageTitle: `Page ${i}`,
      HideInBreadcrumb: false
    }));

    mockUseSitecore.mockReturnValue({
      page: {
        layout: {
          sitecore: {
            context: { breadCrumbsContext: largeBreadcrumbList }
          }
        },
        mode: { isEditing: false }
      }
    });

    const startTime = performance.now();
    render(<BreadCrumb params={{}} />);
    const endTime = performance.now();

    // Should render quickly even with large datasets
    expect(endTime - startTime).toBeLessThan(100);
  });
});
```

## 🎯 Testing Utilities

### Custom Render Function for FastLane

Create a custom render function for FastLane components:

```typescript
// test-utils.ts
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';

export const mockUseSitecore = vi.fn();

vi.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: mockUseSitecore,
  Text: ({ field, tag: Tag = 'div', className, children }: any) => (
    <Tag className={className}>{field?.value || children}</Tag>
  ),
  RichText: ({ field, className }: any) => (
    <div className={className} dangerouslySetInnerHTML={{ __html: field?.value }} />
  ),
  DateField: ({ field, render }: any) => (
    <span>{render ? render(new Date(field?.value)) : field?.value}</span>
  ),
}));

export const renderWithDefaults = (
  ui: React.ReactElement,
  options?: RenderOptions
) => {
  // Set default mock values for FastLane
  mockUseSitecore.mockReturnValue({
    page: {
      layout: { sitecore: { context: {}, route: { fields: {} } } },
      mode: { isEditing: false, isDesignLibrary: false }
    }
  });

  return render(ui, options);
};
```

## 🚀 Best Practices

### 1. Mock Strategy
- **Use `vi.clearAllMocks()`** in `beforeEach` to prevent test interference
- **Include `mode: { isEditing: false }`** for components that check editing state
- **Use module-level mocks** for consistent behavior across all tests in a file
- **Use spy mocks** for test-specific variations

### 2. Test Organization
- **Group related tests** in describe blocks
- **Use descriptive test names** that explain the scenario
- **Test one behavior per test** to maintain clarity
- **Include edge cases** like empty data, missing fields

### 3. Test Component Behavior, Not Implementation

```typescript
// ❌ Bad - Testing implementation details
expect(component.state.isVisible).toBe(true);

// ✅ Good - Testing behavior
expect(screen.getByText('Content')).toBeInTheDocument();
```

### 4. Use Meaningful Test Data

```typescript
// ❌ Bad - Generic test data
const mockData = { Title: { value: 'Test' } };

// ✅ Good - Descriptive test data
const mockData = {
  Title: { value: 'Annual Report 2024' },
  PublishedDate: { value: '2024-01-15T00:00:00Z' }
};
```

### 5. Test Edge Cases

```typescript
describe('Edge Cases', () => {
  it('should handle null field values gracefully', () => {
    const mockProps = {
      fields: { Title: null },
      params: {}
    };

    expect(() => render(<Component {...mockProps} />)).not.toThrow();
  });

  it('should handle empty arrays', () => {
    mockUseSitecore.mockReturnValue({
      page: {
        layout: {
          sitecore: { context: { breadCrumbsContext: [] } }
        },
        mode: { isEditing: false }
      }
    });

    const { container } = render(<BreadCrumb params={{}} />);
    expect(container.firstChild).toBeNull();
  });
});
```

### 6. Accessibility Testing
- **Use semantic queries** (`getByRole`, `getByLabelText`) over test IDs when possible
- **Test keyboard navigation** for interactive components
- **Verify ARIA attributes** are properly set

## 🔧 Common Issues & Solutions

### Issue: "Cannot access property of undefined"
**Solution**: Ensure your `useSitecore` mock includes all properties the component accesses:

```typescript
mockUseSitecore.mockReturnValue({
  page: {
    layout: { sitecore: { route: { fields: {} } } },
    mode: { isEditing: false },
  },
});
```

### Issue: "Mock not applying to all tests"
**Solution**: Use `vi.clearAllMocks()` in `beforeEach`:

```typescript
beforeEach(() => {
  vi.clearAllMocks();
});
```

### Issue: "Field rendering not working"
**Solution**: Mock the Content SDK components at module level:

```typescript
vi.mock('@sitecore-content-sdk/nextjs', async () => {
  const actual = await vi.importActual<typeof import('@sitecore-content-sdk/nextjs')>(
    '@sitecore-content-sdk/nextjs'
  );
  return {
    ...actual,
    Text: ({ field }: any) => <span data-testid="text-field">{field?.value}</span>,
    // ... other mocks
  };
});
```

## 📊 Coverage Goals

Aim for these coverage targets in FastLane components:

- **Statements**: 90%+
- **Branches**: 85%+
- **Functions**: 90%+
- **Lines**: 90%+

## 🛠️ Running Tests

### Development Commands

```bash
# All tests
npm test

# Watch mode with UI
npm run test:watch

# Coverage report
npm run test:coverage

# Lint code
npm run lint
```

## 🎯 Next Steps

- **Component Development**: See the [FastLane Component Development Guide](./component-development.md)
- **Design Library**: See the [FastLane Design Library Setup](./design-library.md)
- **Core Architecture**: See the [FastLane Core Architecture](./core-architecture.md)

---

This comprehensive testing guide ensures FastLane components are **reliable**, **maintainable**, and work correctly across all page modes and content scenarios.

> **Quick Reference**: For immediate setup in the `headapps/nextjs-starter` environment, see the /headapps/nextjs-starter/TESTING.md. 