# Testing Guide - NextJS Starter

This project uses [Vitest](https://vitest.dev/) for unit testing and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for component testing.

## 📚 **Comprehensive Testing Guide**

**For detailed Content SDK testing patterns, best practices, and real-world examples, see:**
**→ [Testing with Content SDK Guide](../../docs/pages/for-developers/guide-testing-with-content-sdk.md)**

This file contains quick setup information specific to the `nextjs-starter` environment.

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode (with UI)
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

## Writing Tests

### Component Test Structure

All component tests should follow this structure:

```typescript
import React from 'react';
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Default as ComponentName } from './ComponentName';
import * as SitecoreContentSdk from '@sitecore-content-sdk/nextjs';

// Mock Sitecore context
beforeAll(() => {
  vi.spyOn(SitecoreContentSdk, 'useSitecore').mockReturnValue({
    page: { 
      layout: { 
        sitecore: { 
          route: { 
            fields: {} 
          } 
        } 
      },
      mode: {
        isEditing: false
      },
    },
  });
});

describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with required props', () => {
    render(
      <ComponentName
        fields={mockFields}
        params={mockParams}
        rendering={{ componentName: 'ComponentName', params: {} }}
      />
    );
    
    // Add assertions here
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Test File Naming

- Test files should be named `ComponentName.test.tsx` or `ComponentName.test.ts`
- Place test files in the same directory as the component being tested

### Common Testing Patterns

#### Mocking useSitecore with Different Contexts

For simple components:
```typescript
vi.spyOn(SitecoreContentSdk, 'useSitecore').mockReturnValue({
  page: {
    mode: { isEditing: false },
  },
});
```

For components that need specific page data:
```typescript
vi.spyOn(SitecoreContentSdk, 'useSitecore').mockReturnValue({
  page: {
    layout: {
      sitecore: {
        route: { fields: { Title: { value: 'Test Title' } } },
        context: { breadCrumbsContext: mockBreadcrumbs }
      }
    },
    mode: { isEditing: false },
  },
});
```

For module-level mocking (when all tests need the same mock):
```typescript
vi.mock('@sitecore-content-sdk/nextjs', async () => {
  const actual = await vi.importActual<typeof import('@sitecore-content-sdk/nextjs')>(
    '@sitecore-content-sdk/nextjs'
  );
  return {
    ...actual,
    useSitecore: vi.fn(() => ({
      page: { mode: { isEditing: false } },
    })),
  };
});
```

#### Mocking Sitecore Fields
```typescript
const mockImageField = {
  value: {
    src: '/test-image.png',
    alt: 'Test Image',
    width: 24,
    height: 24,
  },
};

const mockLinkField = {
  value: {
    href: '/test-link',
    text: 'Test Link',
    title: 'Test Link',
    target: '',
  },
};
```

#### Testing User Interactions
```typescript
import userEvent from '@testing-library/user-event';

it('handles user interactions', async () => {
  const user = userEvent.setup();
  render(<Component />);
  
  const button = screen.getByRole('button');
  await user.click(button);
  
  expect(screen.getByText('Clicked!')).toBeInTheDocument();
});
```

#### Testing Async Operations
```typescript
it('handles async operations', async () => {
  render(<Component />);
  
  // Wait for async content to load
  await screen.findByText('Loaded Content');
  
  expect(screen.getByText('Loaded Content')).toBeInTheDocument();
});
```

## Test Coverage

We aim for at least 80% test coverage. The coverage report will show:
- Statements
- Branches
- Functions
- Lines

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **Use Semantic Queries**: Prefer `getByRole`, `getByLabelText`, `getByText` over `getByTestId`
3. **Test Accessibility**: Ensure components are accessible by testing with screen readers
4. **Mock External Dependencies**: Mock Sitecore context and other external services
5. **Keep Tests Simple**: Each test should test one thing
6. **Use Descriptive Test Names**: Test names should clearly describe what is being tested

**📖 For comprehensive testing patterns and Content SDK mocking strategies, see the [Testing with Content SDK Guide](../../docs/pages/for-developers/guide-testing-with-content-sdk.md)**

## Continuous Integration

Tests are automatically run on:
- Pull requests to `main` and `develop` branches
- Pushes to `main` and `develop` branches

The CI pipeline will:
1. Install dependencies
2. Run type checking
3. Run linting
4. Run tests
5. Build the application
6. Upload coverage reports

## Troubleshooting

### Common Issues

1. **Sitecore Context Errors**: Always mock `useSitecore` in component tests. Include `mode: { isEditing: false }` for components that check editing state
2. **Image/Link Field Errors**: Mock Sitecore field objects with proper structure
3. **Async Rendering**: Use `findBy` queries for async content
4. **Component Props**: Ensure all required props are provided in tests
5. **Mock Scope**: Use `vi.clearAllMocks()` in `beforeEach` to prevent test interference

### Debugging Tests

To debug tests, you can:
1. Use `screen.debug()` to see the rendered output
2. Use `console.log()` statements (they will show in test output)
3. Use the Vitest UI (`npm run test:watch`) for interactive debugging 

---

## 📚 Additional Resources

- **[Testing with Content SDK Guide](../../docs/pages/for-developers/guide-testing-with-content-sdk.md)** - Comprehensive testing patterns and real-world examples
- **[Unit Testing AI Prompt Guide](../../docs/pages/for-developers/guide-using-create-unit-test-prompt.md)** - Using AI to generate tests
- **[Component Examples](./src/components/)** - See actual test implementations 