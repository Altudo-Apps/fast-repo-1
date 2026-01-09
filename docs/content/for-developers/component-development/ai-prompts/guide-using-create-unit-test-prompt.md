# Using the Create Unit Test Prompt

## Overview

This guide teaches you how to set up your testing environment and effectively use the [create-unit-test](./templates/create-unit-test) prompt to generate comprehensive unit tests for FastLane components. The prompt itself contains all the technical requirements and patterns—this guide focuses on setup, workflow, and the Vitest Explorer integration.

📍 **Prompt Location**: [create-unit-test](./templates/create-unit-test)

## Prerequisites

Before using the create-unit-test prompt, ensure you have:

- **FastLane project** set up with testing environment
- **Vitest** and **React Testing Library** configured
- **Content SDK** properly integrated
- **Component** already created that needs testing

## Quick Setup

### 1. Install Vitest Explorer (VS Code)

```bash
# Install the Vitest Explorer extension in VS Code
# Extension ID: vitest.explorer
```

**Benefits of Vitest Explorer:**
- **Visual test runner** directly in VS Code
- **Real-time test results** as you type
- **Easy debugging** with breakpoints
- **Test coverage visualization**

### 2. Verify Testing Environment

Ensure your project has the correct testing setup:

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage"
  }
}
```

### 3. Check Test Utils

Verify the shared test utilities exist:

```typescript
// src/test-utils.ts (should exist)
export const mockCn = vi.fn((classes) => classes.filter(Boolean).join(' '));
```

## Using the Prompt

### 1. Prepare Component Information

Before using the prompt, gather:

- **Component name** (exact file name)
- **Component location** (file path)
- **Component props** (interface/type definitions)
- **Key functionality** to test

### 2. Run the Prompt

Replace placeholders in the [create-unit-test](./templates/create-unit-test) prompt:

```markdown
Create a comprehensive unit test for **ArticleDate** using Vitest with the following requirements:

[rest of prompt template...]
```

### 3. Example Usage

**Input to AI:**
```
Create a comprehensive unit test for ArticleDate using Vitest with the following requirements:

[Include full prompt template from create-unit-test.md]

Component details:
- Location: src/components/ArticleDate.tsx
- Props: ArticleDateProps (fields, params)
- Uses useSitecore hook
- Renders DateField from Content SDK
```

**Expected Output:**
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { Default as ArticleDate } from './ArticleDate';

// Complete test implementation following FastLane patterns...
```

## Vitest Explorer Workflow

### 1. Running Tests in VS Code

1. **Open Vitest Explorer** panel in VS Code
2. **View all tests** in a tree structure
3. **Run individual tests** by clicking the play button
4. **See real-time results** as you modify code

### 2. Debugging Tests

```typescript
// Add breakpoints in your test or component
it('should render correctly', () => {
  debugger; // Set breakpoint here
  render(<ArticleDate {...mockProps} />);
  // Test continues...
});
```

### 3. Coverage Analysis

```bash
# Run tests with coverage
npm run test:coverage

# View coverage report in browser
open coverage/index.html
```

## Common Testing Patterns

### 1. Content SDK Mocking

```typescript
// Standard Content SDK mock for FastLane
vi.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: vi.fn(),
  Text: ({ field, tag: Tag = 'div' }) => <Tag>{field?.value}</Tag>,
  DateField: ({ field, render }) => <span>{render ? render(new Date(field?.value)) : field?.value}</span>,
}));
```

### 2. Component Props Testing

```typescript
describe('Component Props', () => {
  it('should handle required props', () => {
    const requiredProps = {
      fields: { /* required fields */ },
      params: { /* required params */ }
    };
    
    render(<Component {...requiredProps} />);
    // Assertions...
  });

  it('should handle optional props', () => {
    const minimalProps = {
      fields: {},
      params: {}
    };
    
    expect(() => render(<Component {...minimalProps} />)).not.toThrow();
  });
});
```

### 3. Page Mode Testing

```typescript
describe('Page Modes', () => {
  it('should render differently in editing mode', () => {
    mockUseSitecore.mockReturnValue({
      page: { mode: { isEditing: true } }
    });

    render(<Component {...props} />);
    expect(screen.getByText(/editing placeholder/i)).toBeInTheDocument();
  });

  it('should render normally in normal mode', () => {
    mockUseSitecore.mockReturnValue({
      page: { mode: { isEditing: false, isNormal: true } }
    });

    render(<Component {...props} />);
    expect(screen.getByText(/actual content/i)).toBeInTheDocument();
  });
});
```

## Quality Checklist

Use this checklist to verify your generated tests:

### ✅ Test Structure
- [ ] Imports are organized correctly
- [ ] Mocks are set up properly
- [ ] `beforeEach` clears mocks
- [ ] Test descriptions are clear

### ✅ Coverage Areas
- [ ] Component rendering with required props
- [ ] Optional prop handling
- [ ] Content SDK integration
- [ ] Page mode variations
- [ ] Edge cases and error states

### ✅ FastLane Patterns
- [ ] Uses `useSitecore` mocking patterns
- [ ] Tests Content SDK field rendering
- [ ] Includes responsive behavior testing
- [ ] Tests accessibility compliance

### ✅ Code Quality
- [ ] No hardcoded test IDs unless necessary
- [ ] Uses semantic queries (`getByRole`, `getByText`)
- [ ] Tests behavior, not implementation
- [ ] Meaningful test data

## Troubleshooting

### Common Issues

#### "Mock not working"
**Solution:** Ensure mocks are defined before imports:
```typescript
// ✅ Good - mock before import
vi.mock('@sitecore-content-sdk/nextjs', () => ({...}));
import { Component } from './Component';

// ❌ Bad - import before mock
import { Component } from './Component';
vi.mock('@sitecore-content-sdk/nextjs', () => ({...}));
```

#### "Tests not found in Explorer"
**Solution:** Check file naming and location:
- Test files must end with `.test.tsx` or `.spec.tsx`
- Must be in the same directory as component or `__tests__` folder

#### "Content SDK field not rendering"
**Solution:** Mock the specific field components:
```typescript
vi.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field }) => <span data-testid="text-field">{field?.value}</span>,
  DateField: ({ field }) => <span data-testid="date-field">{field?.value}</span>,
}));
```

## Advanced Usage

### 1. Component Family Testing

For related components, create shared test utilities:

```typescript
// shared-test-utils.ts
export const createMockArticleProps = (overrides = {}) => ({
  fields: {
    PublishedDate: { value: '2024-01-15T00:00:00Z' },
    ...overrides.fields
  },
  params: {
    styles: 'test-style',
    ...overrides.params
  }
});
```

### 2. Integration Testing

Test component interactions:

```typescript
it('should integrate with parent component', () => {
  render(
    <ParentComponent>
      <ArticleDate {...mockProps} />
    </ParentComponent>
  );
  
  // Test integrated behavior
});
```

### 3. Performance Testing

Test rendering performance:

```typescript
it('should render efficiently', () => {
  const startTime = performance.now();
  render(<Component {...props} />);
  const endTime = performance.now();
  
  expect(endTime - startTime).toBeLessThan(100); // 100ms threshold
});
```

## Best Practices

### 1. Test Naming
```typescript
// ✅ Good - descriptive test names
it('should display formatted date when PublishedDate field has value')
it('should show placeholder when no date provided and not in editing mode')

// ❌ Bad - vague test names  
it('should render')
it('should work')
```

### 2. Test Organization
```typescript
describe('ArticleDate Component', () => {
  describe('Rendering', () => {
    // Rendering tests
  });
  
  describe('Props Handling', () => {
    // Props tests
  });
  
  describe('Page Modes', () => {
    // Mode-specific tests
  });
});
```

### 3. Mock Strategy
- **Mock external dependencies** (Content SDK, APIs)
- **Keep mocks close to tests** that use them
- **Use realistic test data** that matches production
- **Clear mocks between tests** to prevent interference

## Related Resources

- **[FastLane Testing Guide](../fastlane/testing)** - Comprehensive testing patterns
- **[Component Development Guide](../fastlane/component-development)** - Component creation patterns
- **[Create Unit Test Template](./templates/create-unit-test)** - The actual prompt template

---

**Ready to generate comprehensive tests?** Use the create-unit-test prompt with this workflow to ensure your FastLane components are thoroughly tested! 🧪 