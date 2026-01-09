import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Default as Carousel } from './Carousel';
import * as SitecoreContentSdk from '@sitecore-content-sdk/nextjs';

vi.mock('react-slick', () => ({
  default: ({ children, slidesToShow, slidesToScroll, dots }: any) => (
    <div
      data-testid="slider"
      data-slides-to-show={slidesToShow}
      data-slides-to-scroll={slidesToScroll}
      data-dots={dots}
    >
      {children}
    </div>
  ),
}));

vi.mock('@sitecore-content-sdk/nextjs', () => ({
  Placeholder: vi.fn(({ name, rendering, children, ...rest }: any) => (
    <div
      data-testid="placeholder"
      data-name={name}
      data-rendering={JSON.stringify(rendering)}
      {...rest}
    >
      {children}
    </div>
  )),
  useSitecore: vi.fn(() => ({
    page: {
      mode: {
        isEditing: false,
        name: 'normal',
        isPreview: false,
        isDesignLibrary: false,
        isNormal: true,
        designLibrary: undefined,
      },
    },
  })),
}));

describe('Carousel', () => {
  const makeSlide = (uid: string) => ({ uid, componentName: 'CarouselSlide' });
  const makeProps = (slides: any[] = [], dynamicId: string = '123', params: any = {}) => ({
    params: { DynamicPlaceholderId: dynamicId, SlidesToShow: '1', SlidesToScroll: '1', ...params },
    rendering: {
      componentName: 'Carousel',
      params: {},
      placeholders: { 'carouselslides-{*}': slides },
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
    // Ensure we default to non-editing between tests
    (SitecoreContentSdk.useSitecore as any).mockReturnValue({
      page: {
        mode: {
          isEditing: false,
          name: 'normal',
          isPreview: false,
          isDesignLibrary: false,
          isNormal: true,
          designLibrary: undefined,
        },
      },
    });
  });

  it('renders a slider and one placeholder per slide with correct names and rendering', () => {
    const slides = [makeSlide('s1'), makeSlide('s2')];
    render(<Carousel {...(makeProps(slides, 'abc') as any)} />);

    // Slider exists
    expect(screen.getByTestId('slider')).toBeInTheDocument();

    // Two slide placeholders rendered
    const placeholders = screen.getAllByTestId('placeholder');
    expect(placeholders.length).toBe(2);
    placeholders.forEach((ph) => {
      expect(ph).toHaveAttribute('data-name', 'carouselcontent-abc');
      const rendering = JSON.parse(ph.getAttribute('data-rendering') || '{}');
      expect(rendering.placeholders['carouselcontent-abc']).toHaveLength(1);
    });
  });

  it('passes slider settings derived from params', () => {
    const props = makeProps([makeSlide('s1')], 'xyz', {
      SlidesToShow: '2',
      SlidesToScroll: '2',
      ArrowPosition: 'Bottom',
    });
    render(<Carousel {...(props as any)} />);

    const slider = screen.getByTestId('slider');
    expect(slider.getAttribute('data-slides-to-show')).toBe('2');
    expect(slider.getAttribute('data-slides-to-scroll')).toBe('2');
    // When ArrowPosition is Bottom, dots should be false
    expect(slider.getAttribute('data-dots')).toBe('false');
  });

  it('renders the edit-only placeholder when in editing mode', () => {
    (SitecoreContentSdk.useSitecore as any).mockReturnValue({
      page: {
        mode: {
          isEditing: true,
          name: 'editing',
          isPreview: false,
          isDesignLibrary: false,
          isNormal: false,
          designLibrary: undefined,
        },
      },
    });
    render(<Carousel {...(makeProps([makeSlide('s1')]) as any)} />);

    // Should include one extra placeholder for 'carouselslides-{*}'
    const editPlaceholder = screen
      .getAllByTestId('placeholder')
      .find((p) => p.getAttribute('data-name') === 'carouselslides-{*}');
    expect(editPlaceholder).toBeTruthy();
  });

  it('handles no slides gracefully', () => {
    (SitecoreContentSdk.useSitecore as any).mockReturnValue({
      page: {
        mode: {
          isEditing: false,
          name: 'normal',
          isPreview: false,
          isDesignLibrary: false,
          isNormal: true,
          designLibrary: undefined,
        },
      },
    });
    render(<Carousel {...(makeProps([], 'id') as any)} />);
    expect(screen.getByTestId('slider')).toBeInTheDocument();
    // No slide placeholders when not editing and no slides
    expect(screen.queryByTestId('placeholder')).not.toBeInTheDocument();
  });
});
