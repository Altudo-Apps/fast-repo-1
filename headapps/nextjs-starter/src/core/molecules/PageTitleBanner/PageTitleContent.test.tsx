import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { mockCn } from 'src/test-utils';
import type { PageTitleBannerProps } from './PageTitleBanner.type';
import PageTitleContent from './PageTitleContent';

// Explicitly mock RichText and Text from Sitecore JSS
vi.mock('@sitecore-content-sdk/nextjs', () => ({
  RichText: ({ field }: any) =>
    field?.value ? <div data-testid="rich-text">{field.value}</div> : null,
  Text: ({ tag = 'span', field, className }: any) => {
    const Tag = tag;
    return (
      <Tag data-testid="text" className={className}>
        {field?.value}
      </Tag>
    );
  },
}));

// Mock CustomButtonLink
vi.mock('src/core/atom/CustomButtonLink', () => ({
  CustomButtonLink: ({ children, variant, field, className, ...props }: any) => {
    if (variant === 'default') {
      return (
        <button data-testid="custom-button-link-default" className={className} {...props}>
          {field?.value?.text || 'Download'}
        </button>
      );
    }
    if (variant === 'secondary') {
      return (
        <button data-testid="custom-button-link-secondary" className={className} {...props}>
          {children}
        </button>
      );
    }
    return (
      <button data-testid="custom-button-link" className={className} {...props}>
        {children}
      </button>
    );
  },
}));

// Use shared mockCn utility
mockCn();

const mockFields: PageTitleBannerProps['fields'] = {
  Image: {
    value: {
      src: '/test-image.jpg',
      alt: 'Test Image',
      width: 1920,
      height: 1080,
    },
  },
  Category: { value: 'Test Category' },
  Title: { value: 'Test Title' },
  IntroText: { value: '<p>Test intro text</p>' },
  CalltoActionLinkMain: {
    value: {
      href: '/test-link',
      text: 'Test CTA',
      title: 'Test CTA',
      target: '',
    },
  },
  CalltoActionLinkSecondary: {
    value: {
      href: '/test-secondary-link',
      text: 'Test Secondary CTA',
      title: 'Test Secondary CTA',
      target: '',
    },
  },
};

const mockParams: PageTitleBannerProps['params'] = {
  HeaderTag: 'h1',
  BackgroundColor: 'primary',
  VerticalAlignment: 'center',
  VerticalTextAlignment: 'center',
  DynamicPlaceholderId: 'test-placeholder',
  ComponentType: 'PageTitleBanner',
  ImageOrder: 'left',
  CardOrientation: 'horizontal',
  GridParameters: 'test-grid',
  styles: 'bg-primary position-center',
};

const mockRendering: PageTitleBannerProps['rendering'] = {
  componentName: 'PageTitleBanner',
  params: mockParams,
  uid: 'test-uid',
  dataSource: 'test-datasource',
} as any;

describe('PageTitleContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with required props', () => {
    render(
      <PageTitleContent
        fields={mockFields}
        params={mockParams}
        rendering={mockRendering}
        headerTag="h1"
      />
    );
    const texts = screen.getAllByTestId('text');
    expect(texts[0]).toHaveTextContent('Test Category');
    expect(texts[1]).toHaveTextContent('Test Title');
    expect(screen.getByTestId('rich-text')).toHaveTextContent('<p>Test intro text</p>');
    expect(screen.getByTestId('custom-button-link-default')).toHaveTextContent('Test CTA');
    expect(screen.getByTestId('custom-button-link-secondary')).toHaveTextContent(
      'Test Secondary CTA'
    );
  });

  it('renders with only required fields', () => {
    const minimalFields = {
      Title: { value: 'Minimal Title' },
      IntroText: { value: '' },
      CalltoActionLinkMain: { value: { href: '', text: '', title: '', target: '' } },
      CalltoActionLinkSecondary: { value: { href: '', text: '', title: '', target: '' } },
    };
    render(
      <PageTitleContent
        fields={minimalFields as any}
        params={mockParams}
        rendering={mockRendering}
        headerTag="h2"
      />
    );
    const texts = screen.getAllByTestId('text');
    expect(texts[0]).toHaveTextContent('Minimal Title');
    expect(screen.queryByTestId('rich-text')).not.toBeInTheDocument();
    expect(screen.queryByTestId('custom-button-link-default')).not.toBeInTheDocument();
    expect(screen.queryByTestId('custom-button-link-secondary')).not.toBeInTheDocument();
  });

  it('renders with different header tags', () => {
    const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
    tags.forEach((tag) => {
      const { unmount } = render(
        <PageTitleContent
          fields={mockFields}
          params={mockParams}
          rendering={mockRendering}
          headerTag={tag}
        />
      );
      const texts = screen.getAllByTestId('text');
      expect(texts[1].tagName.toLowerCase()).toBe(tag);
      unmount();
    });
  });

  it('renders divider for non-h1 header', () => {
    render(
      <PageTitleContent
        fields={mockFields}
        params={mockParams}
        rendering={mockRendering}
        headerTag="h2"
      />
    );
    // Divider is a <hr> element
    expect(document.querySelector('hr')).toBeInTheDocument();
  });

  it('does not render divider for h1 header', () => {
    render(
      <PageTitleContent
        fields={mockFields}
        params={mockParams}
        rendering={mockRendering}
        headerTag="h1"
      />
    );
    expect(document.querySelector('hr')).not.toBeInTheDocument();
  });

  it('handles missing fields gracefully', () => {
    render(
      <PageTitleContent
        fields={{} as any}
        params={mockParams}
        rendering={mockRendering}
        headerTag="h1"
      />
    );
    // Should not throw and should not render text or rich text
    expect(screen.queryByTestId('text')).not.toBeInTheDocument();
    expect(screen.queryByTestId('rich-text')).not.toBeInTheDocument();
  });

  it('renders only secondary CTA if main CTA is missing', () => {
    const fields = {
      ...mockFields,
      CalltoActionLinkMain: { value: { href: '', text: '', title: '', target: '' } },
    };
    render(
      <PageTitleContent
        fields={fields as any}
        params={mockParams}
        rendering={mockRendering}
        headerTag="h1"
      />
    );
    expect(screen.queryByTestId('custom-button-link-default')).not.toBeInTheDocument();
    expect(screen.getByTestId('custom-button-link-secondary')).toBeInTheDocument();
  });

  it('renders only main CTA if secondary CTA is missing', () => {
    const fields = {
      ...mockFields,
      CalltoActionLinkSecondary: { value: { href: '', text: '', title: '', target: '' } },
    };
    render(
      <PageTitleContent
        fields={fields as any}
        params={mockParams}
        rendering={mockRendering}
        headerTag="h1"
      />
    );
    expect(screen.getByTestId('custom-button-link-default')).toBeInTheDocument();
    expect(screen.queryByTestId('custom-button-link-secondary')).not.toBeInTheDocument();
  });

  it('handles edge case: missing all props', () => {
    // @ts-expect-error purposely passing empty props
    expect(() => render(<PageTitleContent />)).not.toThrow();
    expect(screen.queryByTestId('text')).not.toBeInTheDocument();
    expect(screen.queryByTestId('rich-text')).not.toBeInTheDocument();
  });

  it('applies alignment and text alignment classes based on props', () => {
    const { container: centeredContainer, unmount: unmountCentered } = render(
      <PageTitleContent
        fields={mockFields}
        params={mockParams}
        rendering={mockRendering}
        headerTag="h1"
        isCentered
      />
    );
    // The root div should have items-center and text-center classes
    const root = centeredContainer.firstChild as HTMLElement;
    expect(root?.className).toMatch(/items-center/);
    unmountCentered();
    const { container: rightContainer } = render(
      <PageTitleContent
        fields={mockFields}
        params={mockParams}
        rendering={mockRendering}
        headerTag="h1"
        isRight
      />
    );
    const rightRoot = rightContainer.firstChild as HTMLElement;
    expect(rightRoot?.className).toMatch(/items-end/);
  });

  it('uses fallback text for main CTA when text is missing', () => {
    const fields = {
      ...mockFields,
      CalltoActionLinkMain: { value: { href: '/test', text: '', title: '', target: '' } },
    };
    render(
      <PageTitleContent
        fields={fields as any}
        params={mockParams}
        rendering={mockRendering}
        headerTag="h1"
      />
    );
    expect(screen.getByTestId('custom-button-link-default')).toHaveTextContent('Download');
  });

  it('uses fallback text for secondary CTA when text is missing', () => {
    const fields = {
      ...mockFields,
      CalltoActionLinkSecondary: { value: { href: '/test', text: '', title: '', target: '' } },
    };
    render(
      <PageTitleContent
        fields={fields as any}
        params={mockParams}
        rendering={mockRendering}
        headerTag="h1"
      />
    );
    expect(screen.getByTestId('custom-button-link-secondary')).toHaveTextContent('Learn More');
  });
});
