import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { mockCn } from 'src/test-utils';
import * as SitecoreContentSdk from '@sitecore-content-sdk/nextjs';
import type { PageTitleBannerProps } from 'src/core/molecules/PageTitleBanner/PageTitleBanner.type';
import { Default as PageTitleBanner } from './PageTitleBanner';

// Mock PlaceholderBanner explicitly
vi.mock('src/core/molecules/PageTitleBanner/PlaceholderBanner', () => ({
  __esModule: true,
  default: ({ fields, params, rendering, headerTag }: any) => (
    <div data-testid="placeholder-banner">
      <div data-testid="fields">{JSON.stringify(fields)}</div>
      <div data-testid="params">{JSON.stringify(params)}</div>
      <div data-testid="rendering">{JSON.stringify(rendering)}</div>
      <div data-testid="header-tag">{headerTag}</div>
    </div>
  ),
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
  styles: 'test-styles',
  RenderingIdentifier: 'page-title-banner-1',
};

const mockRendering: PageTitleBannerProps['rendering'] = {
  componentName: 'PageTitleBanner',
  params: mockParams,
  uid: 'test-uid',
  dataSource: 'test-datasource',
} as any;

describe('PageTitleBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock useSitecore to return no page by default
    vi.spyOn(SitecoreContentSdk, 'useSitecore').mockReturnValue({
      page: {},
    });
  });

  it('renders with required props', () => {
    render(<PageTitleBanner fields={mockFields} params={mockParams} rendering={mockRendering} />);
    const wrapper = screen.getByTestId('placeholder-banner').parentElement;
    expect(wrapper).toHaveAttribute('id', 'page-title-banner-1');
    expect(wrapper).toHaveClass('test-styles');
  });

  it('passes correct props to PlaceholderBanner', () => {
    render(<PageTitleBanner fields={mockFields} params={mockParams} rendering={mockRendering} />);
    expect(screen.getByTestId('fields')).toHaveTextContent(JSON.stringify(mockFields));
    expect(screen.getByTestId('params')).toHaveTextContent(JSON.stringify(mockParams));
    expect(screen.getByTestId('rendering')).toHaveTextContent(JSON.stringify(mockRendering));
    expect(screen.getByTestId('header-tag')).toHaveTextContent('h1');
  });

  it('uses sitecoreContext route fields if available', () => {
    const customFields = { ...mockFields, Title: { value: 'From Context' } };
    (SitecoreContentSdk.useSitecore as any).mockReturnValue({
      page: { layout: { sitecore: { route: { fields: customFields } } } },
    });
    render(<PageTitleBanner fields={mockFields} params={mockParams} rendering={mockRendering} />);
    expect(screen.getByTestId('fields')).toHaveTextContent(JSON.stringify(customFields));
  });

  it('handles missing params gracefully', () => {
    const emptyParams = {};
    render(<PageTitleBanner fields={mockFields} params={emptyParams} rendering={mockRendering} />);
    expect(screen.getByTestId('params')).toHaveTextContent('{}');
  });

  it('handles missing fields gracefully', () => {
    const emptyFields = {
      Title: { value: '' },
      IntroText: { value: '' },
      CalltoActionLinkMain: { value: { href: '', text: '', title: '', target: '' } },
      CalltoActionLinkSecondary: { value: { href: '', text: '', title: '', target: '' } },
    };
    render(
      <PageTitleBanner fields={emptyFields as any} params={mockParams} rendering={mockRendering} />
    );
    expect(screen.getByTestId('fields')).toHaveTextContent(JSON.stringify(emptyFields));
  });

  it('renders with different prop combinations', () => {
    const testCases: Partial<PageTitleBannerProps['params']>[] = [
      { HeaderTag: 'h2' },
      { BackgroundColor: 'secondary' },
      { VerticalAlignment: 'top' },
      { CardOrientation: 'vertical' },
      { styles: 'another-style' },
      {},
    ];
    testCases.forEach((params) => {
      // Ensure all values are strings or correct type for params
      const mergedParams = { ...mockParams, ...params } as PageTitleBannerProps['params'];
      const { unmount } = render(
        <PageTitleBanner fields={mockFields} params={mergedParams} rendering={mockRendering} />
      );
      expect(screen.getByTestId('params')).toHaveTextContent(JSON.stringify(mergedParams));
      unmount();
    });
  });

  it('handles edge case: no RenderingIdentifier', () => {
    const paramsWithoutId = { ...mockParams };
    delete (paramsWithoutId as any).RenderingIdentifier;
    render(
      <PageTitleBanner fields={mockFields} params={paramsWithoutId} rendering={mockRendering} />
    );
    const wrapper = screen.getByTestId('placeholder-banner').parentElement;
    expect(wrapper).not.toHaveAttribute('id', 'page-title-banner-1');
  });

  it('handles edge case: no styles', () => {
    const paramsWithoutStyles = { ...mockParams };
    delete (paramsWithoutStyles as any).styles;
    render(
      <PageTitleBanner fields={mockFields} params={paramsWithoutStyles} rendering={mockRendering} />
    );
    const wrapper = screen.getByTestId('placeholder-banner').parentElement;
    expect(wrapper).not.toHaveClass('test-styles');
  });

  it('passes correct rendering prop to PlaceholderBanner', () => {
    render(<PageTitleBanner fields={mockFields} params={mockParams} rendering={mockRendering} />);
    expect(screen.getByTestId('rendering')).toHaveTextContent(JSON.stringify(mockRendering));
  });

  it('always passes headerTag as h1', () => {
    render(<PageTitleBanner fields={mockFields} params={mockParams} rendering={mockRendering} />);
    expect(screen.getByTestId('header-tag')).toHaveTextContent('h1');
  });

  it('handles error condition: missing all props', () => {
    // @ts-expect-error purposely passing empty props
    expect(() => render(<PageTitleBanner />)).toThrow();
  });
});
