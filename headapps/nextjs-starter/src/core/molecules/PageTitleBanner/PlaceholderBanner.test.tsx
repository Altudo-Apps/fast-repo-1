import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { mockCn } from 'src/test-utils';
import type { PageTitleBannerProps } from './PageTitleBanner.type';
import PlaceholderBanner from './PlaceholderBanner';

// Explicitly mock SitecoreImage
vi.mock('src/core/atom/Images', () => ({
  SitecoreImage: ({ field, ...props }: any) => (
    <img data-testid="sitecore-image" src={field?.value?.src} alt={field?.value?.alt} {...props} />
  ),
}));

vi.mock('./PageTitleContent', () => ({
  __esModule: true,
  default: ({ fields, params, rendering, headerTag, isCentered, isLeft, isRight }: any) => (
    <div data-testid="page-title-content">
      <div data-testid="fields">{JSON.stringify(fields)}</div>
      <div data-testid="params">{JSON.stringify(params)}</div>
      <div data-testid="rendering">{JSON.stringify(rendering)}</div>
      <div data-testid="header-tag">{headerTag}</div>
      <div data-testid="is-centered">{String(isCentered)}</div>
      <div data-testid="is-left">{String(isLeft)}</div>
      <div data-testid="is-right">{String(isRight)}</div>
    </div>
  ),
}));

// Explicitly mock Placeholder from Sitecore JSS
vi.mock('@sitecore-content-sdk/nextjs', async () => {
  return {
    Placeholder: ({ name, rendering }: any) => (
      <div data-testid="placeholder" data-name={name} data-rendering={JSON.stringify(rendering)} />
    ),
  };
});

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
  FieldNames: 'ImageorVideo',
};

const mockRendering: PageTitleBannerProps['rendering'] = {
  componentName: 'PageTitleBanner',
  params: mockParams,
  uid: 'test-uid',
  dataSource: 'test-datasource',
} as any;

describe('PlaceholderBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with required props and image', () => {
    render(
      <PlaceholderBanner
        fields={mockFields}
        params={mockParams}
        rendering={mockRendering}
        headerTag="h1"
      />
    );
    expect(screen.getByTestId('sitecore-image')).toHaveAttribute('src', '/test-image.jpg');
    expect(screen.getByTestId('sitecore-image')).toHaveAttribute('alt', 'Test Image');
    expect(screen.getByTestId('page-title-content')).toBeInTheDocument();
  });

  it('renders background color class when bg-primary is in styles', () => {
    render(
      <PlaceholderBanner
        fields={mockFields}
        params={{ ...mockParams, styles: 'bg-primary' }}
        rendering={mockRendering}
        headerTag="h1"
      />
    );
    // The background color div should have bg-primary class
    const bgDiv = screen.getByText(
      (content, element) => !!element?.className?.includes('bg-primary')
    );
    expect(bgDiv).toBeDefined();
  });

  it('renders with placeholder when FieldNames is ImageorVideo', () => {
    render(
      <PlaceholderBanner
        fields={mockFields}
        params={{ ...mockParams, FieldNames: 'ImageorVideo' }}
        rendering={mockRendering}
        headerTag="h1"
      />
    );
    expect(screen.getByTestId('placeholder')).toHaveAttribute(
      'data-name',
      'bannercontent-test-placeholder'
    );
  });

  it('does not render placeholder when FieldNames is Default', () => {
    render(
      <PlaceholderBanner
        fields={mockFields}
        params={{ ...mockParams, FieldNames: 'Default' }}
        rendering={mockRendering}
        headerTag="h1"
      />
    );
    expect(screen.queryByTestId('placeholder')).not.toBeInTheDocument();
  });

  it('handles missing image gracefully', () => {
    const fieldsNoImage = { ...mockFields };
    delete fieldsNoImage.Image;
    render(
      <PlaceholderBanner
        fields={fieldsNoImage as any}
        params={mockParams}
        rendering={mockRendering}
        headerTag="h1"
      />
    );
    expect(screen.queryByTestId('sitecore-image')).not.toBeInTheDocument();
  });

  it('handles invalid image (missing src, id, alt)', () => {
    const fieldsInvalidImage = {
      ...mockFields,
      Image: { value: { src: '', alt: '', id: undefined } },
    };
    render(
      <PlaceholderBanner
        fields={fieldsInvalidImage as any}
        params={mockParams}
        rendering={mockRendering}
        headerTag="h1"
      />
    );
    expect(screen.queryByTestId('sitecore-image')).not.toBeInTheDocument();
  });

  it('renders with different prop combinations', () => {
    const testCases: Partial<PageTitleBannerProps['params']>[] = [
      { CardOrientation: 'vertical' },
      { CardOrientation: 'horizontalflex' },
      { ImageOrder: 'right' },
      { styles: 'bg-secondary position-left' },
      { styles: 'bg-tertiary position-right' },
      { VerticalTextAlignment: 'top' },
      { VerticalTextAlignment: 'bottom' },
      {},
    ];
    testCases.forEach((params) => {
      const mergedParams = { ...mockParams, ...params } as PageTitleBannerProps['params'];
      const { unmount } = render(
        <PlaceholderBanner
          fields={mockFields}
          params={mergedParams}
          rendering={mockRendering}
          headerTag="h2"
        />
      );
      expect(screen.getByTestId('page-title-content')).toBeInTheDocument();
      unmount();
    });
  });

  it('handles edge case: missing params', () => {
    render(
      <PlaceholderBanner
        fields={mockFields}
        params={{} as any}
        rendering={mockRendering}
        headerTag="h1"
      />
    );
    expect(screen.getByTestId('page-title-content')).toBeInTheDocument();
  });

  it('handles edge case: missing fields', () => {
    render(
      <PlaceholderBanner
        fields={{} as any}
        params={mockParams}
        rendering={mockRendering}
        headerTag="h1"
      />
    );
    expect(screen.getByTestId('page-title-content')).toBeInTheDocument();
  });

  it('passes correct props to PageTitleContent', () => {
    render(
      <PlaceholderBanner
        fields={mockFields}
        params={mockParams}
        rendering={mockRendering}
        headerTag="h3"
      />
    );
    expect(screen.getByTestId('fields')).toHaveTextContent(JSON.stringify(mockFields));
    expect(screen.getByTestId('params')).toHaveTextContent(JSON.stringify(mockParams));
    expect(screen.getByTestId('rendering')).toHaveTextContent(JSON.stringify(mockRendering));
    expect(screen.getByTestId('header-tag')).toHaveTextContent('h3');
  });

  it('handles error condition: missing all props', () => {
    // @ts-expect-error purposely passing empty props
    expect(() => render(<PlaceholderBanner />)).toThrow();
  });
});
