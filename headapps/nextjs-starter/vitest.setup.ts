import '@testing-library/jest-dom';
import { vi } from 'vitest';

// ✅ Mock Lucide React to avoid import issues
vi.mock('lucide-react', () => {
  return {
    ChevronDown: () => `<svg data-testid="mock-chevron-down" />`,
  };
});

// ✅ Mock @sitecore-feaas/clientside to avoid ESM import issues
vi.mock('@sitecore-feaas/clientside', () => ({
  renderDOMContent: vi.fn(),
  renderDOMElement: vi.fn(),
  renderHTMLContent: vi.fn(),
  setDOMAttribute: vi.fn(),
}));

// ✅ Mock @sitecore-search/react to avoid control.isInitialized errors
vi.mock('@sitecore-search/react', () => ({
  useSearchResults: vi.fn(),
  widget: vi.fn((component) => component),
  WidgetDataType: {
    SEARCH_RESULTS: 'SEARCH_RESULTS',
  },
}));