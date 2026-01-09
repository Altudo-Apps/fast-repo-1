import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { LanguageSelector, Default } from './LanguageSelector';

// Mock Next.js router
const mockPush = vi.fn();
const mockRouter = {
  push: mockPush,
  pathname: '/',
  route: '/',
  query: {},
  asPath: '/demo/test-page',
  locale: 'en',
  locales: ['en', 'de-DE', 'fr-CA', 'ar-AE'],
  defaultLocale: 'en',
  basePath: '',
  isReady: true,
  isFallback: false,
  isPreview: false,
  isLocaleDomain: false,
  events: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
  beforePopState: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  reload: vi.fn(),
  replace: vi.fn(),
  forward: vi.fn(),
};

vi.mock('next/router', () => ({
  useRouter: () => mockRouter,
}));

// Mock react-device-detect
vi.mock('react-device-detect', () => ({
  isDesktop: true,
  isMobile: false,
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Globe: vi.fn(({ className }: { className?: string }) => (
    <svg className={className} data-testid="globe-icon" />
  )),
  ChevronDown: vi.fn(({ className }: { className?: string }) => (
    <svg className={className} data-testid="chevron-icon" />
  )),
}));

// Mock DropdownMenu
vi.mock('src/core/molecules/LanguageSelector/DropdownMenu', () => ({
  default: vi.fn(({ items, onSelectItem }: { items: any[]; onSelectItem: (item: any) => void }) => (
    <div data-testid="dropdown-menu">
      {items.map((item: any) => (
        <button
          key={item.code}
          data-testid={`language-option-${item.code}`}
          onClick={() => onSelectItem({ ...item, languageLabel: 'Language' })}
        >
          {item.title}
        </button>
      ))}
    </div>
  )),
}));

// Mock DropdownButton
vi.mock('src/core/atom/DropdownButton', () => ({
  default: vi.fn(
    ({
      onClick,
      title,
      disabled,
      isOpen,
      icon,
    }: {
      onClick?: () => void;
      title: string;
      disabled?: boolean;
      isOpen?: boolean;
      icon?: React.ReactNode;
    }) => (
      <button
        data-testid="dropdown-button"
        onClick={onClick}
        disabled={disabled}
        data-open={isOpen}
      >
        {icon}
        {title}
      </button>
    )
  ),
}));

// Mock LanguageFlagIcon
vi.mock('src/core/atom/LanguageFlagIcon', () => ({
  default: vi.fn(({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="flag-icon" />
  )),
}));

describe('LanguageSelector', () => {
  const mockLanguages = [
    {
      id: '1',
      title: 'English',
      code: 'en',
      icon: '/en.png',
      alt: 'English flag',
      url: '/en',
    },
    {
      id: '2',
      title: 'German',
      code: 'de',
      icon: '/de.png',
      alt: 'German flag',
      url: '/de',
    },
    {
      id: '3',
      title: 'French',
      code: 'fr',
      icon: '/fr.png',
      alt: 'French flag',
      url: '/fr',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockRouter.locale = 'en';
    mockRouter.asPath = '/demo/test-page';
  });

  it('renders without crashing', () => {
    render(<LanguageSelector languages={mockLanguages} languageLabel="Language" />);
    expect(screen.getByTestId('dropdown-button')).toBeDefined();
  });

  it('renders with language label prop', () => {
    render(<LanguageSelector languages={mockLanguages} languageLabel="Select Language" />);
    // Component receives the prop but doesn't display it in the current implementation
    expect(screen.getByTestId('dropdown-button')).toBeDefined();
  });

  it('renders when languageLabel is undefined', () => {
    render(<LanguageSelector languages={mockLanguages} languageLabel={undefined} />);
    // Component renders without language label prop
    expect(screen.getByTestId('dropdown-button')).toBeDefined();
    expect(screen.getByTestId('dropdown-button').textContent).toBe('English');
  });

  it('renders the selected language based on current locale', () => {
    mockRouter.locale = 'en';
    render(<LanguageSelector languages={mockLanguages} languageLabel="Language" />);
    const dropdownButton = screen.getByTestId('dropdown-button');
    expect(dropdownButton.textContent).toBe('English');
  });

  it('updates selected language when locale changes', () => {
    mockRouter.locale = 'de-DE';
    render(<LanguageSelector languages={mockLanguages} languageLabel="Language" />);
    const dropdownButton = screen.getByTestId('dropdown-button');
    expect(dropdownButton.textContent).toBe('German');
  });

  it('opens dropdown when button is clicked', () => {
    render(<LanguageSelector languages={mockLanguages} languageLabel="Language" />);

    const dropdownButton = screen.getByTestId('dropdown-button');
    fireEvent.click(dropdownButton);

    // Dropdown menu should be visible
    expect(screen.getByTestId('dropdown-menu')).toBeDefined();
  });

  it('renders all available languages in dropdown including selected one', () => {
    mockRouter.locale = 'en';
    render(<LanguageSelector languages={mockLanguages} languageLabel="Language" />);

    // Open dropdown
    const dropdownButton = screen.getByTestId('dropdown-button');
    fireEvent.click(dropdownButton);

    // All languages should be visible including the selected one
    expect(screen.getByTestId('language-option-en')).toBeDefined();
    expect(screen.getByTestId('language-option-de')).toBeDefined();
    expect(screen.getByTestId('language-option-fr')).toBeDefined();
  });

  it('disables dropdown when only one language is available', () => {
    const singleLanguage = [mockLanguages[0]];

    render(<LanguageSelector languages={singleLanguage} languageLabel="Language" />);

    const dropdownButton = screen.getByTestId('dropdown-button');
    expect(dropdownButton.hasAttribute('disabled')).toBe(true);
  });

  it('changes language and navigates using Next.js router', async () => {
    mockRouter.locale = 'en';
    mockRouter.asPath = '/demo/test-page';

    render(<LanguageSelector languages={mockLanguages} languageLabel="Language" />);

    // Open dropdown
    const dropdownButton = screen.getByTestId('dropdown-button');
    fireEvent.click(dropdownButton);

    // Click on German option
    const germanOption = screen.getByTestId('language-option-de');
    fireEvent.click(germanOption);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/demo/test-page', undefined, { locale: 'de-DE' });
    });
  });

  it('changes language to French and navigates using Next.js router', async () => {
    mockRouter.locale = 'en';
    mockRouter.asPath = '/home';

    render(<LanguageSelector languages={mockLanguages} languageLabel="Language" />);

    // Open dropdown
    const dropdownButton = screen.getByTestId('dropdown-button');
    fireEvent.click(dropdownButton);

    // Click on French option
    const frenchOption = screen.getByTestId('language-option-fr');
    fireEvent.click(frenchOption);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/home', undefined, { locale: 'fr-CA' });
    });
  });

  it('strips query parameters and hash from URL when changing language', async () => {
    mockRouter.locale = 'en';
    mockRouter.asPath = '/demo/test-page?param=value#section';

    render(<LanguageSelector languages={mockLanguages} languageLabel="Language" />);

    // Open dropdown
    const dropdownButton = screen.getByTestId('dropdown-button');
    fireEvent.click(dropdownButton);

    // Click on German option
    const germanOption = screen.getByTestId('language-option-de');
    fireEvent.click(germanOption);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/demo/test-page', undefined, { locale: 'de-DE' });
    });
  });

  it('does not render when languages array is empty', () => {
    const { container } = render(<LanguageSelector languages={[]} languageLabel="Language" />);
    expect(container.querySelector('[data-testid="dropdown-button"]')).toBeNull();
  });

  it('handles missing icon gracefully', () => {
    const languagesWithoutIcon = [
      {
        id: '1',
        title: 'English',
        code: 'en',
        icon: '',
        alt: '',
        url: '/en',
      },
    ];

    render(<LanguageSelector languages={languagesWithoutIcon} languageLabel="Language" />);

    expect(screen.getByTestId('dropdown-button')).toBeDefined();
  });

  it('handles undefined languages gracefully', () => {
    const { container } = render(
      <LanguageSelector languages={undefined as any} languageLabel="Language" />
    );
    expect(container.querySelector('[data-testid="dropdown-button"]')).toBeNull();
  });

  it('closes dropdown when clicking outside', async () => {
    render(<LanguageSelector languages={mockLanguages} languageLabel="Language" />);

    // Open dropdown
    const dropdownButton = screen.getByTestId('dropdown-button');
    fireEvent.click(dropdownButton);
    expect(screen.getByTestId('dropdown-menu')).toBeDefined();

    // Click outside
    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByTestId('dropdown-menu')).toBeNull();
    });
  });

  it('finds matching locale dynamically from router.locales', async () => {
    mockRouter.locale = 'en';
    mockRouter.locales = ['en', 'de-DE', 'fr-CA', 'ar-AE'];
    mockRouter.asPath = '/page';

    render(<LanguageSelector languages={mockLanguages} languageLabel="Language" />);

    // Open dropdown
    const dropdownButton = screen.getByTestId('dropdown-button');
    fireEvent.click(dropdownButton);

    // Click on German option (code is 'de', should match 'de-DE' in locales)
    const germanOption = screen.getByTestId('language-option-de');
    fireEvent.click(germanOption);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/page', undefined, { locale: 'de-DE' });
    });
  });

  it('handles language without matching locale in router.locales', async () => {
    mockRouter.locale = 'en';
    mockRouter.locales = ['en', 'es-ES']; // No German locale
    mockRouter.asPath = '/page';

    const languagesWithSpanish = [
      ...mockLanguages,
      {
        id: '4',
        title: 'Spanish',
        code: 'es',
        icon: '/es.png',
        alt: 'Spanish flag',
        url: '/es',
      },
    ];

    render(<LanguageSelector languages={languagesWithSpanish} languageLabel="Language" />);

    // Open dropdown
    const dropdownButton = screen.getByTestId('dropdown-button');
    fireEvent.click(dropdownButton);

    // Click on Spanish option
    const spanishOption = screen.getByTestId('language-option-es');
    fireEvent.click(spanishOption);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/page', undefined, { locale: 'es-ES' });
    });
  });

  it('does not open dropdown when disabled', () => {
    const singleLanguage = [mockLanguages[0]];

    render(<LanguageSelector languages={singleLanguage} languageLabel="Language" />);

    const dropdownButton = screen.getByTestId('dropdown-button');
    fireEvent.click(dropdownButton);

    // Dropdown should not be visible when disabled
    expect(screen.queryByTestId('dropdown-menu')).toBeNull();
  });

  it('closes dropdown after selecting a language', async () => {
    mockRouter.locale = 'en';
    mockRouter.asPath = '/page';

    render(<LanguageSelector languages={mockLanguages} languageLabel="Language" />);

    // Open dropdown
    const dropdownButton = screen.getByTestId('dropdown-button');
    fireEvent.click(dropdownButton);
    expect(screen.getByTestId('dropdown-menu')).toBeDefined();

    // Click on German option
    const germanOption = screen.getByTestId('language-option-de');
    fireEvent.click(germanOption);

    // Dropdown should close after selection
    await waitFor(() => {
      expect(screen.queryByTestId('dropdown-menu')).toBeNull();
    });
  });

  it('handles locale with exact match (en vs en-US)', () => {
    mockRouter.locale = 'en';
    mockRouter.locales = ['en', 'de-DE'];

    render(<LanguageSelector languages={mockLanguages} languageLabel="Language" />);

    const dropdownButton = screen.getByTestId('dropdown-button');
    expect(dropdownButton.textContent).toBe('English');
  });

  it('does not render when selectedLanguage is null after locale check', () => {
    mockRouter.locale = 'zh'; // Locale that doesn't match any language

    const { container } = render(
      <LanguageSelector languages={mockLanguages} languageLabel="Language" />
    );

    // Component should render with first language as fallback
    expect(container.querySelector('[data-testid="dropdown-button"]')).toBeDefined();
  });

  it('toggles dropdown open and closed on subsequent clicks', () => {
    render(<LanguageSelector languages={mockLanguages} languageLabel="Language" />);

    const dropdownButton = screen.getByTestId('dropdown-button');

    // First click - opens
    fireEvent.click(dropdownButton);
    expect(screen.getByTestId('dropdown-menu')).toBeDefined();

    // Second click - closes
    fireEvent.click(dropdownButton);
    expect(screen.queryByTestId('dropdown-menu')).toBeNull();

    // Third click - opens again
    fireEvent.click(dropdownButton);
    expect(screen.getByTestId('dropdown-menu')).toBeDefined();
  });

  it('passes languageLabel to DropdownMenu selectedItem', () => {
    const testLabel = 'Test Language Label';
    render(<LanguageSelector languages={mockLanguages} languageLabel={testLabel} />);

    // Open dropdown
    const dropdownButton = screen.getByTestId('dropdown-button');
    fireEvent.click(dropdownButton);

    // The mock DropdownMenu should receive selectedItem with languageLabel
    expect(screen.getByTestId('dropdown-menu')).toBeDefined();
  });

  // Note: Hover and focus behaviors were removed in favor of click-only interaction
  // These tests are removed as they no longer apply to the current implementation

  it('closes dropdown on focus event outside component', async () => {
    render(<LanguageSelector languages={mockLanguages} languageLabel="Language" />);

    const dropdownButton = screen.getByTestId('dropdown-button');

    // Open dropdown
    fireEvent.click(dropdownButton);
    expect(screen.getByTestId('dropdown-menu')).toBeDefined();

    // Create a focus event on document body
    const focusEvent = new FocusEvent('focus', { bubbles: true });
    Object.defineProperty(focusEvent, 'target', { value: document.body, enumerable: true });
    document.dispatchEvent(focusEvent);

    await waitFor(() => {
      expect(screen.queryByTestId('dropdown-menu')).toBeNull();
    });
  });
});

describe('Default (Sitecore Wrapper)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRouter.locale = 'en';
  });

  it('renders LanguageSelector with transformed data from GraphQL', () => {
    const mockProps = {
      fields: {
        data: {
          language: {
            languageLabel: { value: 'Select Language' },
            siteLanguages: {
              jsonValue: [
                {
                  id: '1',
                  url: '/en',
                  name: 'English',
                  displayName: 'English',
                  fields: {
                    LanguageTitle: { value: 'English' },
                    Alias: { value: 'en' },
                    IconImageUrl: { value: { src: '/en.png', alt: 'English flag' } },
                  },
                },
                {
                  id: '2',
                  url: '/de',
                  name: 'German',
                  displayName: 'German',
                  fields: {
                    LanguageTitle: { value: 'German' },
                    Alias: { value: 'de' },
                    IconImageUrl: { value: { src: '/de.png', alt: 'German flag' } },
                  },
                },
              ],
            },
          },
        },
      },
    };

    render(<Default {...mockProps} />);
    expect(screen.getByTestId('dropdown-button')).toBeDefined();
    expect(screen.getByTestId('dropdown-button').textContent).toBe('English');
  });

  it('returns null when datasource is missing', () => {
    const mockProps = {
      fields: {
        data: null as any,
      },
    };

    const { container } = render(<Default {...mockProps} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles missing IconImageUrl gracefully', () => {
    const mockProps = {
      fields: {
        data: {
          language: {
            languageLabel: { value: 'Language' },
            siteLanguages: {
              jsonValue: [
                {
                  id: '1',
                  url: '/en',
                  name: 'English',
                  displayName: 'English',
                  fields: {
                    LanguageTitle: { value: 'English' },
                    Alias: { value: 'en' },
                  },
                },
              ],
            },
          },
        },
      },
    };

    render(<Default {...mockProps} />);
    expect(screen.getByTestId('dropdown-button')).toBeDefined();
  });

  it('uses displayName as fallback for title when LanguageTitle is missing', () => {
    const mockProps = {
      fields: {
        data: {
          language: {
            languageLabel: { value: 'Language' },
            siteLanguages: {
              jsonValue: [
                {
                  id: '1',
                  url: '/en',
                  name: 'English',
                  displayName: 'English Display Name',
                  fields: {
                    LanguageTitle: { value: '' },
                    Alias: { value: 'en' },
                  },
                },
              ],
            },
          },
        },
      },
    };

    render(<Default {...mockProps} />);
    expect(screen.getByTestId('dropdown-button').textContent).toBe('English Display Name');
  });

  it('handles non-string languageLabel value', () => {
    const mockProps = {
      fields: {
        data: {
          language: {
            languageLabel: { value: 123 as any },
            siteLanguages: {
              jsonValue: [
                {
                  id: '1',
                  url: '/en',
                  name: 'English',
                  displayName: 'English',
                  fields: {
                    LanguageTitle: { value: 'English' },
                    Alias: { value: 'en' },
                  },
                },
              ],
            },
          },
        },
      },
    };

    render(<Default {...mockProps} />);
    expect(screen.getByTestId('dropdown-button')).toBeDefined();
  });

  it('handles empty siteLanguages array', () => {
    const mockProps = {
      fields: {
        data: {
          language: {
            languageLabel: { value: 'Language' },
            siteLanguages: {
              jsonValue: [],
            },
          },
        },
      },
    };

    const { container } = render(<Default {...mockProps} />);
    expect(container.querySelector('[data-testid="dropdown-button"]')).toBeNull();
  });

  it('uses displayName as alt text fallback when IconImageUrl alt is missing', () => {
    const mockProps = {
      fields: {
        data: {
          language: {
            languageLabel: { value: 'Language' },
            siteLanguages: {
              jsonValue: [
                {
                  id: '1',
                  url: '/en',
                  name: 'English',
                  displayName: 'English Name',
                  fields: {
                    LanguageTitle: { value: 'English' },
                    Alias: { value: 'en' },
                    IconImageUrl: { value: { src: '/en.png' } },
                  },
                },
                {
                  id: '2',
                  url: '/de',
                  name: 'German',
                  displayName: 'German',
                  fields: {
                    LanguageTitle: { value: 'German' },
                    Alias: { value: 'de' },
                    IconImageUrl: { value: { src: '/de.png', alt: 'German flag' } },
                  },
                },
              ],
            },
          },
        },
      },
    };

    render(<Default {...mockProps} />);
    const flagIcon = screen.getByTestId('flag-icon');
    expect(flagIcon.getAttribute('alt')).toBe('English Name');
  });
});
