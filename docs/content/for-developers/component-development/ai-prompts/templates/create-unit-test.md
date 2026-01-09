# Unit Test Creation Prompt

Create a comprehensive unit test for [COMPONENT] using Vitest with the following requirements:

## Testing Standards

1. **Component under test should be imported at the top of the test file using top level imports**
2. **When it is necessary to use module level imports, use `await import` pattern instead of `require`**
3. **Use the shared `mockCn()` utility** from `~/headapps/nextjs-starter/src/test-utils.ts` for the `cn` function
4. **Keep all other mocks explicit in the test file** (don't move atoms, molecules, or hooks to shared utilities)

## Test Coverage Requirements

5. **Test all major functionality** including but not limited to:
   - Basic rendering with required props
   - Optional field handling
   - Different prop combinations
   - Edge cases and error states
   - Content SDK integration (if applicable)
   - Page mode detection (editing, Design Library, etc.)

## FastLane-Specific Patterns

6. **Follow FastLane testing patterns**:
   - Mock `useSitecore` hook appropriately
   - Test Content SDK field rendering
   - Include responsive behavior testing
   - Test accessibility compliance
   - Handle empty/null field values

## Test Structure

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentName } from './ComponentName';

// Mock Content SDK
vi.mock('@sitecore-content-sdk/nextjs', () => ({
  useSitecore: vi.fn(),
  // Add other mocks as needed
}));

const mockUseSitecore = useSitecore as ReturnType<typeof vi.fn>;

describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with required props', () => {
    // Test implementation
  });

  // Additional test cases...
});
```

Replace `[COMPONENT]` with the actual component name and ensure all tests follow the FastLane testing conventions documented in the [Testing Guide](../fastlane/testing). 