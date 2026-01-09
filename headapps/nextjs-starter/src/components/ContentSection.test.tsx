import React from 'react';
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Default as ContentSection } from './ContentSection';
import * as SitecoreContentSdk from '@sitecore-content-sdk/nextjs';

// Mock PlaceholderBanner component
vi.mock('src/core/molecules/PageTitleBanner/PlaceholderBanner', () => ({
  default: ({ fields, params, rendering, headerTag }: any) => (
    <div data-testid="placeholder-banner">
      <div data-testid="fields">{JSON.stringify(fields)}</div>
      <div data-testid="params">{JSON.stringify(params)}</div>
      <div data-testid="rendering">{JSON.stringify(rendering)}</div>
      <div data-testid="header-tag">{headerTag}</div>
    </div>
  ),
}));

// Mock data for testing
const mockFields = {
  Image: {
    value: {
      src: '/test-image.jpg',
      alt: 'Test Image',
      width: 1920,
      height: 1080,
    },
  },
  Category: {
    value: 'Test Category',
  },
  Title: {
    value: 'Test Title',
  },
  IntroText: {
    value: '<p>Test intro text</p>',
  },
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

const mockParams = {
  HeaderTag: 'h2' as const,
  BackgroundColor: 'primary' as const,
  VerticalAlignment: 'center' as const,
  VerticalTextAlignment: 'center' as const,
  DynamicPlaceholderId: 'test-placeholder',
  ComponentType: 'ContentSection',
  ImageOrder: 'left' as const,
  CardOrientation: 'horizontal' as const,
  GridParameters: 'test-grid',
  styles: 'test-styles',
  RenderingIdentifier: 'content-section-1',
};

const mockRendering = {
  componentName: 'ContentSection',
  params: mockParams,
  uid: 'test-uid',
  dataSource: 'test-datasource',
};

describe('ContentSection', () => {
  beforeAll(() => {
    // Mock useSitecore to prevent pageEditing error
    vi.spyOn(SitecoreContentSdk, 'useSitecore').mockReturnValue({
      page: {
        mode: {
          isEditing: false,
        },
      },
    });
  });

  it('renders with required props', () => {
    render(<ContentSection fields={mockFields} params={mockParams} rendering={mockRendering} />);

    // Check that the wrapper div is rendered with correct props
    const wrapper = screen.getByTestId('placeholder-banner').parentElement;
    expect(wrapper).toHaveAttribute('id', 'content-section-1');
    expect(wrapper).toHaveClass('test-styles');
  });

  it('passes correct props to PlaceholderBanner', () => {
    render(<ContentSection fields={mockFields} params={mockParams} rendering={mockRendering} />);

    // Check that PlaceholderBanner receives correct props
    expect(screen.getByTestId('fields')).toHaveTextContent(JSON.stringify(mockFields));
    expect(screen.getByTestId('params')).toHaveTextContent(JSON.stringify(mockParams));
    expect(screen.getByTestId('rendering')).toHaveTextContent(JSON.stringify(mockRendering));
    expect(screen.getByTestId('header-tag')).toHaveTextContent('h2');
  });

  it('uses default HeaderTag when not provided', () => {
    const paramsWithoutHeaderTag = { ...mockParams };
    // Use type assertion to allow deletion of optional property
    delete (paramsWithoutHeaderTag as any).HeaderTag;

    render(
      <ContentSection
        fields={mockFields}
        params={paramsWithoutHeaderTag}
        rendering={mockRendering}
      />
    );

    // Should default to 'h2' when HeaderTag is not provided
    expect(screen.getByTestId('header-tag')).toHaveTextContent('h2');
  });

  it('handles empty fields gracefully', () => {
    const emptyFields = {
      Title: { value: '' },
      IntroText: { value: '' },
      CalltoActionLinkMain: { value: { href: '', text: '', title: '', target: '' } },
      CalltoActionLinkSecondary: { value: { href: '', text: '', title: '', target: '' } },
    };

    render(<ContentSection fields={emptyFields} params={mockParams} rendering={mockRendering} />);

    // Should render without crashing
    expect(screen.getByTestId('placeholder-banner')).toBeInTheDocument();
    expect(screen.getByTestId('fields')).toHaveTextContent(JSON.stringify(emptyFields));
  });

  it('handles empty params gracefully', () => {
    const emptyParams = {};

    render(<ContentSection fields={mockFields} params={emptyParams} rendering={mockRendering} />);

    // Should render without crashing
    expect(screen.getByTestId('placeholder-banner')).toBeInTheDocument();
    expect(screen.getByTestId('params')).toHaveTextContent('{}');
  });

  it('renders with different HeaderTag values', () => {
    const testCases = ['h1', 'h3', 'h4', 'h5', 'h6'] as const;

    testCases.forEach((headerTag) => {
      const paramsWithHeaderTag = { ...mockParams, HeaderTag: headerTag };

      const { unmount } = render(
        <ContentSection
          fields={mockFields}
          params={paramsWithHeaderTag}
          rendering={mockRendering}
        />
      );

      expect(screen.getByTestId('header-tag')).toHaveTextContent(headerTag);
      unmount();
    });
  });
});
