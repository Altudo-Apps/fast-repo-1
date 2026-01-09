import React from 'react';
import { describe, it, expect, beforeAll, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import { CardItemProps } from './ContentCard.type';
import { mockCn } from 'src/test-utils';
import CardItem from './CardItem';

// Mock the dependencies
vi.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: vi.fn(({ children, tag, field, className }: any) => {
    const Tag = tag || 'div';
    return <Tag className={className}>{field?.value || children}</Tag>;
  }),
  RichText: vi.fn(({ field, className }: any) => {
    // Strip HTML tags for testing purposes to avoid dangerouslySetInnerHTML security issue
    const textContent = (field?.value || '').replace(/<[^>]*>/g, '');
    return <div className={className}>{textContent}</div>;
  }),
}));

// Use shared cn mock
mockCn();

vi.mock('src/core/ui/card', () => ({
  Card: vi.fn(({ children, className }: any) => (
    <div className={className} data-testid="card">
      {children}
    </div>
  )),
}));

vi.mock('src/core/atom/Images', () => ({
  SitecoreImage: vi.fn(({ field, className }: any) => (
    <img
      src={field?.value?.src}
      alt={field?.value?.alt}
      className={className}
      data-testid={field?.value?.src?.includes('icon') ? 'sitecore-icon' : 'sitecore-image'}
    />
  )),
}));

vi.mock('./ContentCardBtn', () => ({
  default: vi.fn(({ CalltoActionLinkMain, LinkType }: any) => (
    <button data-testid="content-card-btn" data-link-type={LinkType}>
      {CalltoActionLinkMain?.value?.text || 'Button'}
    </button>
  )),
}));

// Mock data
const mockFields = {
  Title: {
    value: 'Test Card Title',
  },
  CalltoActionLinkMain: {
    value: {
      href: '/test-link',
      text: 'Learn More',
      title: 'Learn More',
      target: '',
    },
  },
  IntroText: {
    value: '<p>This is a test intro text for the content card.</p>',
  },
  Image: {
    value: {
      src: '/test-image.jpg',
      alt: 'Test Image',
      width: '800',
      height: '600',
    },
  },
  Category: {
    value: 'Technology',
  },
  Icon: {
    value: {
      src: '/test-icon.png',
      alt: 'Test Icon',
      width: '32',
      height: '32',
    },
  },
};

const defaultProps: CardItemProps = {
  fields: mockFields,
  CardOrientation: 'vertical',
  GridParameters: 'grid-cols-1',
  ImageOrder: 'left',
  headingTag: 'h3',
  LinkType: 'Button',
};

describe('CardItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeAll(() => {
    // No need to mock useSitecore as CardItem doesn't use it
  });

  it('renders with all required fields', async () => {
    render(<CardItem {...defaultProps} />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByText('Test Card Title')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('This is a test intro text for the content card.')).toBeInTheDocument();
    expect(screen.getByTestId('sitecore-image')).toHaveAttribute('src', '/test-image.jpg');
    expect(screen.getByTestId('content-card-btn')).toBeInTheDocument();
  });

  it('renders icon when Icon field has src value', async () => {
    render(<CardItem {...defaultProps} />);

    const iconImage = screen.getByTestId('sitecore-icon');
    expect(iconImage).toHaveAttribute('src', '/test-icon.png');
    expect(iconImage).toHaveAttribute('alt', 'Test Icon');
  });

  it('does not render icon when Icon field is empty', async () => {
    const propsWithoutIcon = {
      ...defaultProps,
      fields: {
        ...mockFields,
        Icon: { value: { src: '', alt: '', width: '', height: '' } },
      },
    };

    render(<CardItem {...propsWithoutIcon} />);

    expect(screen.queryByTestId('sitecore-icon')).not.toBeInTheDocument();
    expect(screen.getByTestId('sitecore-image')).toBeInTheDocument(); // Only the main image
  });

  it('does not render icon when Icon field has no src', async () => {
    const propsWithoutIcon = {
      ...defaultProps,
      fields: {
        ...mockFields,
        Icon: { value: undefined },
      },
    };

    render(<CardItem {...propsWithoutIcon} />);

    expect(screen.queryByTestId('sitecore-icon')).not.toBeInTheDocument();
    expect(screen.getByTestId('sitecore-image')).toBeInTheDocument(); // Only the main image
  });

  it('renders button when LinkType is not Card', async () => {
    render(<CardItem {...defaultProps} LinkType="Button" />);

    expect(screen.getByTestId('content-card-btn')).toBeInTheDocument();
    expect(screen.getByTestId('content-card-btn')).toHaveAttribute('data-link-type', 'Button');
  });

  it('does not render button when LinkType is Card', async () => {
    render(<CardItem {...defaultProps} LinkType="Card" />);

    expect(screen.queryByTestId('content-card-btn')).not.toBeInTheDocument();
  });

  it('renders button in correct position for vertical orientation', async () => {
    render(<CardItem {...defaultProps} CardOrientation="vertical" />);

    const flexContainer = screen.getByTestId('card').querySelector('.flex.w-full.gap-6');
    expect(flexContainer).toHaveClass('flex-col', 'md:items-start');
    expect(screen.getByTestId('content-card-btn')).toBeInTheDocument();
  });

  it('renders button in correct position for horizontal equal orientation', async () => {
    render(<CardItem {...defaultProps} CardOrientation="horizontalequal" />);

    const flexContainer = screen.getByTestId('card').querySelector('.flex.w-full.gap-6');
    expect(flexContainer).toHaveClass('md:flex-row max-md:flex-col item-start');
    expect(screen.getByTestId('content-card-btn')).toBeInTheDocument();
  });

  it('renders button in correct position for horizontal flex orientation', async () => {
    render(<CardItem {...defaultProps} CardOrientation="horizontalflex" />);

    const flexContainer = screen.getByTestId('card').querySelector('.flex.w-full.gap-6');
    expect(flexContainer).toHaveClass('md:flex-row max-md:flex-col item-start');
    expect(screen.getByTestId('content-card-btn')).toBeInTheDocument();
  });

  it('renders image with correct order when ImageOrder is right', async () => {
    render(<CardItem {...defaultProps} ImageOrder="right" />);

    const imageContainer = screen.getByTestId('sitecore-image').parentElement;
    expect(imageContainer).toHaveClass('order-1');
  });

  it('renders image with correct order when ImageOrder is left', async () => {
    render(<CardItem {...defaultProps} ImageOrder="left" />);

    const imageContainer = screen.getByTestId('sitecore-image').parentElement;
    expect(imageContainer).not.toHaveClass('order-1');
  });

  it('uses correct heading tag when provided', async () => {
    render(<CardItem {...defaultProps} headingTag="h2" />);

    expect(Text).toHaveBeenCalledWith(
      expect.objectContaining({
        tag: 'h2',
        field: mockFields.Title,
      }),
      undefined
    );
  });

  it('uses h3 as default heading tag when not provided', async () => {
    const propsWithoutHeadingTag = { ...defaultProps };
    delete propsWithoutHeadingTag.headingTag;

    render(<CardItem {...propsWithoutHeadingTag} />);

    expect(Text).toHaveBeenCalledWith(
      expect.objectContaining({
        tag: 'h3',
        field: mockFields.Title,
      }),
      undefined
    );
  });

  it('renders category when Category field has value', async () => {
    render(<CardItem {...defaultProps} />);

    expect(Text).toHaveBeenCalledWith(
      expect.objectContaining({
        tag: 'div',
        field: mockFields.Category,
      }),
      undefined
    );
  });

  it('does not render category when Category field is empty', async () => {
    const propsWithoutCategory = {
      ...defaultProps,
      fields: {
        ...mockFields,
        Category: { value: '' },
      },
    };

    render(<CardItem {...propsWithoutCategory} />);

    // Category should not be rendered when value is empty
    expect(screen.queryByText('Technology')).not.toBeInTheDocument();
  });

  it('renders intro text when IntroText field has value', async () => {
    render(<CardItem {...defaultProps} />);

    expect(RichText).toHaveBeenCalledWith(
      expect.objectContaining({
        field: mockFields.IntroText,
      }),
      undefined
    );
  });

  it('does not render intro text when IntroText field is empty', async () => {
    const propsWithoutIntroText = {
      ...defaultProps,
      fields: {
        ...mockFields,
        IntroText: { value: '' },
      },
    };

    render(<CardItem {...propsWithoutIntroText} />);

    expect(
      screen.queryByText('This is a test intro text for the content card.')
    ).not.toBeInTheDocument();
  });

  it('renders image when Image field has value', async () => {
    render(<CardItem {...defaultProps} />);

    const image = screen.getByTestId('sitecore-image');
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Image');
  });

  it('does not render image when Image field is empty', async () => {
    const propsWithoutImage = {
      ...defaultProps,
      fields: {
        ...mockFields,
        Image: { value: undefined },
        Icon: { value: undefined },
      },
    };

    render(<CardItem {...propsWithoutImage} />);

    expect(screen.queryByTestId('sitecore-image')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sitecore-icon')).not.toBeInTheDocument();
  });

  it('applies correct CSS classes for vertical orientation', async () => {
    render(<CardItem {...defaultProps} CardOrientation="vertical" />);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass(
      'font-satoshi',
      'overflow-hidden',
      'p-6',
      'bg-base-card',
      'rounded-lg'
    );
  });

  it('applies correct CSS classes for horizontal equal orientation', async () => {
    render(<CardItem {...defaultProps} CardOrientation="horizontalequal" />);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass(
      'font-satoshi',
      'overflow-hidden',
      'p-6',
      'bg-base-card',
      'rounded-lg'
    );
  });

  it('applies correct CSS classes for horizontal flex orientation', async () => {
    render(<CardItem {...defaultProps} CardOrientation="horizontalflex" />);

    const card = screen.getByTestId('card');
    expect(card).toHaveClass(
      'font-satoshi',
      'overflow-hidden',
      'p-6',
      'bg-base-card',
      'rounded-lg'
    );
  });

  it('handles missing optional fields gracefully', async () => {
    const minimalFields = {
      Title: mockFields.Title,
      CalltoActionLinkMain: mockFields.CalltoActionLinkMain,
      Image: mockFields.Image,
      Category: mockFields.Category,
    };

    const minimalProps = {
      ...defaultProps,
      fields: minimalFields,
    };

    render(<CardItem {...minimalProps} />);

    // Should still render without errors
    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByText('Test Card Title')).toBeInTheDocument();
  });

  it('passes correct props to ContentCardBtn component', async () => {
    const ContentCardBtn = await import('./ContentCardBtn');

    render(<CardItem {...defaultProps} LinkType="Button" />);

    expect(ContentCardBtn.default).toHaveBeenCalledWith(
      {
        CalltoActionLinkMain: mockFields.CalltoActionLinkMain,
        LinkType: 'Button',
      },
      undefined
    );
  });

  it('handles different CardOrientation values correctly', async () => {
    const orientations = ['vertical', 'horizontalequal', 'horizontalflex'];

    orientations.forEach((orientation) => {
      const { unmount } = render(<CardItem {...defaultProps} CardOrientation={orientation} />);

      expect(screen.getByTestId('card')).toBeInTheDocument();
      unmount();
    });
  });

  it('handles different LinkType values correctly', async () => {
    const linkTypes = ['Card', 'Button', 'Link'];

    linkTypes.forEach((linkType) => {
      const { unmount } = render(<CardItem {...defaultProps} LinkType={linkType} />);

      if (linkType === 'Card') {
        expect(screen.queryByTestId('content-card-btn')).not.toBeInTheDocument();
      } else {
        expect(screen.getByTestId('content-card-btn')).toBeInTheDocument();
      }
      unmount();
    });
  });
});
