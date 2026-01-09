import React from 'react';
import { describe, it, expect, beforeAll, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Default as ContentCard } from './ContentCard';
import * as SitecoreContentSdk from '@sitecore-content-sdk/nextjs';
import { ContentCardFields } from 'src/core/molecules/ContentCard/ContentCard.type';

let useSitecoreSpy: any;

// Mock NextLink component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock CardItem component
vi.mock('src/core/molecules/ContentCard/CardItem', () => ({
  default: ({ fields, CardOrientation, ImageOrder, headingTag, LinkType }: any) => (
    <div data-testid="card-item">
      <h3>{fields.Title?.value}</h3>
      <p>{fields.Category?.value}</p>
      <div>{fields.IntroText?.value}</div>
      <img src={fields.Image?.value?.src} alt={fields.Image?.value?.alt} />
      <div data-testid="card-orientation">{CardOrientation}</div>
      <div data-testid="image-order">{ImageOrder}</div>
      <div data-testid="heading-tag">{headingTag}</div>
      <div data-testid="link-type">{LinkType}</div>
    </div>
  ),
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
    value: 'This is a test intro text for the content card.',
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

const mockParams = {
  RenderingIdentifier: 'content-card-1',
  CardOrientation: 'vertical',
  ImageOrder: 'left',
  LinkType: 'Card',
  HeaderTag: 'h2',
  GridParameters: 'grid-cols-1',
  styles: 'test-styles',
};

const mockRendering = {
  componentName: 'ContentCard',
  params: mockParams,
};

// Helper function to find the wrapper element with id
const findWrapperElement = () => {
  const cardItem = screen.getByTestId('card-item');
  // Navigate up the DOM tree to find the div with an id attribute
  let element = cardItem.parentElement;
  while (element && element.tagName !== 'BODY') {
    if (element.hasAttribute('id')) {
      return element;
    }
    element = element.parentElement;
  }
  return null;
};

describe('ContentCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeAll(() => {
    // Mock useSitecore to control editing mode
    const makeMode = (isEditing: boolean) => ({
      isEditing,
      name: isEditing ? 'editing' : 'normal',
      isPreview: false,
      isDesignLibrary: false,
      isNormal: !isEditing,
      designLibrary: undefined,
    });
    useSitecoreSpy = vi.spyOn(SitecoreContentSdk, 'useSitecore').mockReturnValue({
      page: {
        mode: makeMode(false),
      },
    } as any);
  });

  it('renders with required props', () => {
    const props: ContentCardFields = {
      fields: mockFields,
      params: mockParams,
      rendering: mockRendering,
    };

    render(<ContentCard {...props} />);

    // Check for the wrapper div with correct id and styles
    const wrapper = findWrapperElement();
    expect(wrapper).toHaveAttribute('id', 'content-card-1');
    expect(wrapper).toHaveClass('test-styles');

    // Check that CardItem is rendered
    expect(screen.getByTestId('card-item')).toBeInTheDocument();
  });

  it('renders card as a link when LinkType is Card and href exists and not editing', async () => {
    useSitecoreSpy.mockReturnValue({
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
    } as any);

    const props: ContentCardFields = {
      fields: mockFields,
      params: { ...mockParams, LinkType: 'Card' },
      rendering: mockRendering,
    };

    render(<ContentCard {...props} />);

    // Check that the card is wrapped in a link
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test-link');
    expect(link).toContainElement(screen.getByTestId('card-item'));
  });

  it('renders card without link when LinkType is not Card', async () => {
    useSitecoreSpy.mockReturnValue({
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
    } as any);

    const props: ContentCardFields = {
      fields: mockFields,
      params: { ...mockParams, LinkType: 'Button' },
      rendering: mockRendering,
    };

    render(<ContentCard {...props} />);

    // Check that no link is rendered
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByTestId('card-item')).toBeInTheDocument();
  });

  it('renders card without link when href is missing', async () => {
    useSitecoreSpy.mockReturnValue({
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
    } as any);

    const props: ContentCardFields = {
      fields: {
        ...mockFields,
        CalltoActionLinkMain: {
          value: {
            href: '',
            text: 'Learn More',
            title: 'Learn More',
            target: '',
          },
        },
      },
      params: { ...mockParams, LinkType: 'Card' },
      rendering: mockRendering,
    };

    render(<ContentCard {...props} />);

    // Check that no link is rendered
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByTestId('card-item')).toBeInTheDocument();
  });

  it('renders card without link when in editing mode', async () => {
    useSitecoreSpy.mockReturnValue({
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
    } as any);

    const props: ContentCardFields = {
      fields: mockFields,
      params: { ...mockParams, LinkType: 'Card' },
      rendering: mockRendering,
    };

    render(<ContentCard {...props} />);

    // Check that no link is rendered when editing
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByTestId('card-item')).toBeInTheDocument();
  });

  it('passes correct props to CardItem component', () => {
    const props: ContentCardFields = {
      fields: mockFields,
      params: mockParams,
      rendering: mockRendering,
    };

    render(<ContentCard {...props} />);

    // Check that CardItem receives the correct props
    expect(screen.getByTestId('card-orientation')).toHaveTextContent('vertical');
    expect(screen.getByTestId('image-order')).toHaveTextContent('left');
    expect(screen.getByTestId('heading-tag')).toHaveTextContent('h2');
    expect(screen.getByTestId('link-type')).toHaveTextContent('Card');
  });

  it('handles missing optional fields gracefully', () => {
    const minimalFields = {
      Title: mockFields.Title,
      CalltoActionLinkMain: mockFields.CalltoActionLinkMain,
      Image: mockFields.Image,
      Category: mockFields.Category,
    };

    const props: ContentCardFields = {
      fields: minimalFields,
      params: mockParams,
      rendering: mockRendering,
    };

    render(<ContentCard {...props} />);

    // Should still render without errors
    expect(screen.getByTestId('card-item')).toBeInTheDocument();
    const wrapper = findWrapperElement();
    expect(wrapper).toHaveAttribute('id', 'content-card-1');
  });

  it('handles missing CalltoActionLinkMain field', () => {
    const fieldsWithoutLink = {
      Title: mockFields.Title,
      Image: mockFields.Image,
      Category: mockFields.Category,
    };

    const props: ContentCardFields = {
      fields: fieldsWithoutLink as any,
      params: mockParams,
      rendering: mockRendering,
    };

    render(<ContentCard {...props} />);

    // Should still render without errors
    expect(screen.getByTestId('card-item')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('handles different CardOrientation values', () => {
    const orientations = ['vertical', 'horizontalequal', 'horizontalflex'];

    orientations.forEach((orientation) => {
      const props: ContentCardFields = {
        fields: mockFields,
        params: { ...mockParams, CardOrientation: orientation },
        rendering: mockRendering,
      };

      const { unmount } = render(<ContentCard {...props} />);

      expect(screen.getByTestId('card-orientation')).toHaveTextContent(orientation);
      unmount();
    });
  });

  it('handles different LinkType values', () => {
    const linkTypes = ['Card', 'Button', 'Link'];

    linkTypes.forEach((linkType) => {
      const props: ContentCardFields = {
        fields: mockFields,
        params: { ...mockParams, LinkType: linkType },
        rendering: mockRendering,
      };

      const { unmount } = render(<ContentCard {...props} />);

      expect(screen.getByTestId('link-type')).toHaveTextContent(linkType);
      unmount();
    });
  });

  it('renders with RenderingIdentifier from Sitecore', () => {
    const props: ContentCardFields = {
      fields: mockFields,
      params: { ...mockParams, RenderingIdentifier: 'sitecore-generated-id' },
      rendering: mockRendering,
    };

    render(<ContentCard {...props} />);

    // Should render with the id attribute from Sitecore
    const wrapper = findWrapperElement();
    expect(wrapper).toHaveAttribute('id', 'sitecore-generated-id');
  });

  it('handles empty styles parameter', () => {
    const props: ContentCardFields = {
      fields: mockFields,
      params: { ...mockParams, styles: '' },
      rendering: mockRendering,
    };

    render(<ContentCard {...props} />);

    // Should render without additional classes
    const wrapper = findWrapperElement();
    expect(wrapper).not.toHaveClass('test-styles');
  });
});
