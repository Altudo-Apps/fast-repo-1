import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { mockCn } from 'src/test-utils';
import { SocialShareProps } from 'src/types/SocialShare.types';
import { Default as SocialShare } from './SocialShare';

// Mock react-share components
vi.mock('react-share', () => ({
  FacebookShareButton: ({ children, url, title }: any) => (
    <button data-testid="facebook-share" data-url={url} data-title={title}>
      {children}
    </button>
  ),
  TwitterShareButton: ({ children, url, title }: any) => (
    <button data-testid="twitter-share" data-url={url} data-title={title}>
      {children}
    </button>
  ),
  LinkedinShareButton: ({ children, url, title }: any) => (
    <button data-testid="linkedin-share" data-url={url} data-title={title}>
      {children}
    </button>
  ),
  PinterestShareButton: ({ children, url, title, media }: any) => (
    <button data-testid="pinterest-share" data-url={url} data-title={title} data-media={media}>
      {children}
    </button>
  ),
  EmailShareButton: ({ children, url, title }: any) => (
    <button data-testid="email-share" data-url={url} data-title={title}>
      {children}
    </button>
  ),
}));

// Mock SitecoreImage component
vi.mock('src/core/atom/Images', () => ({
  SitecoreImage: ({ field, className, style }: any) => (
    <img
      src={field?.value?.src || ''}
      alt={field?.value?.alt || 'social-icon'}
      className={className}
      style={style}
      data-testid="sitecore-image"
    />
  ),
}));

// Mock data
const createMockSocialItem = (name: string, title: string, iconSrc: string, media?: string) => ({
  id: `social-${name.toLowerCase()}`,
  url: `/social/${name.toLowerCase()}`,
  name,
  displayName: name,
  fields: {
    Title: { value: title },
    SocialIcon: {
      value: {
        src: iconSrc,
        alt: `${name} icon`,
        width: '48',
        height: '48',
      },
    },
    ...(media && { Media: media }),
  },
});

const mockSocialItems = [
  createMockSocialItem('Facebook', 'Share on Facebook', '/icons/facebook.png'),
  createMockSocialItem('LinkedIn', 'Share on LinkedIn', '/icons/linkedin.png'),
  createMockSocialItem('X', 'Share on X', '/icons/x.png'),
  createMockSocialItem(
    'Pinterest',
    'Share on Pinterest',
    '/icons/pinterest.png',
    '/media/pinterest-image.jpg'
  ),
  createMockSocialItem('Email', 'Share via Email', '/icons/email.png'),
];

const defaultProps: SocialShareProps = {
  rendering: {
    componentName: 'SocialShare',
    params: {},
  },
  params: {
    styles: 'social-share-container',
    RenderingIdentifier: 'social-share-1',
  },
  fields: {
    items: mockSocialItems,
  },
};

describe('SocialShare', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCn();
  });

  it('renders with required props', async () => {
    const { container } = render(<SocialShare {...defaultProps} />);

    // Check container using the specific id
    const socialShareContainer = container.querySelector('#social-share-1');
    expect(socialShareContainer).toBeInTheDocument();
    expect(socialShareContainer).toHaveClass('social-share-container');

    // Check all social share buttons are rendered
    expect(screen.getByTestId('facebook-share')).toBeInTheDocument();
    expect(screen.getByTestId('linkedin-share')).toBeInTheDocument();
    expect(screen.getByTestId('twitter-share')).toBeInTheDocument();
    expect(screen.getByTestId('pinterest-share')).toBeInTheDocument();
    expect(screen.getByTestId('email-share')).toBeInTheDocument();

    // Check all images are rendered
    const images = screen.getAllByTestId('sitecore-image');
    expect(images).toHaveLength(5);
  });

  it('passes correct URL and title to share buttons', async () => {
    render(<SocialShare {...defaultProps} />);

    // Check Facebook share button
    const facebookButton = screen.getByTestId('facebook-share');
    expect(facebookButton).toHaveAttribute('data-title', 'Share on Facebook');
    expect(facebookButton).toHaveAttribute('data-url');

    // Check LinkedIn share button
    const linkedinButton = screen.getByTestId('linkedin-share');
    expect(linkedinButton).toHaveAttribute('data-title', 'Share on LinkedIn');
    expect(linkedinButton).toHaveAttribute('data-url');

    // Check X share button
    const twitterButton = screen.getByTestId('twitter-share');
    expect(twitterButton).toHaveAttribute('data-title', 'Share on X');
    expect(twitterButton).toHaveAttribute('data-url');

    // Check Email share button
    const emailButton = screen.getByTestId('email-share');
    expect(emailButton).toHaveAttribute('data-title', 'Share via Email');
    expect(emailButton).toHaveAttribute('data-url');
  });

  it('passes media prop to Pinterest share button', async () => {
    render(<SocialShare {...defaultProps} />);

    const pinterestButton = screen.getByTestId('pinterest-share');
    expect(pinterestButton).toHaveAttribute('data-title', 'Share on Pinterest');
    expect(pinterestButton).toHaveAttribute('data-url');
    expect(pinterestButton).toHaveAttribute('data-media', '/media/pinterest-image.jpg');
  });

  it('renders images with correct props', async () => {
    render(<SocialShare {...defaultProps} />);

    const images = screen.getAllByTestId('sitecore-image');

    // Check Facebook image
    expect(images[0]).toHaveAttribute('src', '/icons/facebook.png');
    expect(images[0]).toHaveAttribute('alt', 'Facebook icon');
    expect(images[0]).toHaveClass(
      'max-w-12',
      'h-auto',
      'rounded-full',
      'dark:bg-secondary-foreground',
      'hover:opacity-80',
      'transition-opacity'
    );
    expect(images[0]).toHaveStyle({
      maxWidth: '48px',
      width: '100%',
      height: 'auto',
      borderRadius: '50%',
    });

    // Check LinkedIn image
    expect(images[1]).toHaveAttribute('src', '/icons/linkedin.png');
    expect(images[1]).toHaveAttribute('alt', 'LinkedIn icon');
  });

  it('handles empty items array', async () => {
    const propsWithEmptyItems = {
      ...defaultProps,
      fields: { items: [] },
    };

    const { container } = render(<SocialShare {...propsWithEmptyItems} />);

    // Container should still render
    const socialShareContainer = container.querySelector('#social-share-1');
    expect(socialShareContainer).toBeInTheDocument();

    // No share buttons should be rendered
    expect(screen.queryByTestId('facebook-share')).not.toBeInTheDocument();
    expect(screen.queryByTestId('linkedin-share')).not.toBeInTheDocument();
    expect(screen.queryByTestId('twitter-share')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pinterest-share')).not.toBeInTheDocument();
    expect(screen.queryByTestId('email-share')).not.toBeInTheDocument();
  });

  it('handles missing optional fields gracefully', async () => {
    const propsWithMissingFields = {
      ...defaultProps,
      fields: {
        items: [
          {
            id: 'social-facebook',
            url: '/social/facebook',
            name: 'Facebook',
            displayName: 'Facebook',
            fields: {
              Title: { value: 'Share on Facebook' },
              SocialIcon: {
                value: {
                  src: '/icons/facebook.png',
                  alt: 'Facebook icon',
                  width: '48',
                  height: '48',
                },
              },
            },
          },
        ],
      },
    };

    render(<SocialShare {...propsWithMissingFields} />);

    // Should still render the Facebook button
    expect(screen.getByTestId('facebook-share')).toBeInTheDocument();
    expect(screen.getByTestId('sitecore-image')).toBeInTheDocument();
  });

  it('handles missing params gracefully', async () => {
    const propsWithMissingParams = {
      ...defaultProps,
      params: {},
    };

    render(<SocialShare {...propsWithMissingParams} />);

    // Should still render without crashing
    expect(screen.getByTestId('facebook-share')).toBeInTheDocument();
  });

  it('handles missing rendering prop gracefully', async () => {
    const propsWithMissingRendering = {
      ...defaultProps,
      rendering: undefined as any,
    };

    render(<SocialShare {...propsWithMissingRendering} />);

    // Should still render without crashing
    expect(screen.getByTestId('facebook-share')).toBeInTheDocument();
  });

  it('handles empty title values', async () => {
    const propsWithEmptyTitles = {
      ...defaultProps,
      fields: {
        items: [
          {
            id: 'social-facebook',
            url: '/social/facebook',
            name: 'Facebook',
            displayName: 'Facebook',
            fields: {
              Title: { value: '' },
              SocialIcon: {
                value: {
                  src: '/icons/facebook.png',
                  alt: 'Facebook icon',
                  width: '48',
                  height: '48',
                },
              },
            },
          },
        ],
      },
    };

    render(<SocialShare {...propsWithEmptyTitles} />);

    const facebookButton = screen.getByTestId('facebook-share');
    expect(facebookButton).toHaveAttribute('data-title', '');
  });

  it('handles undefined title values', async () => {
    const propsWithUndefinedTitles = {
      ...defaultProps,
      fields: {
        items: [
          {
            id: 'social-facebook',
            url: '/social/facebook',
            name: 'Facebook',
            displayName: 'Facebook',
            fields: {
              Title: { value: undefined as any },
              SocialIcon: {
                value: {
                  src: '/icons/facebook.png',
                  alt: 'Facebook icon',
                  width: '48',
                  height: '48',
                },
              },
            },
          },
        ],
      },
    };

    render(<SocialShare {...propsWithUndefinedTitles} />);

    const facebookButton = screen.getByTestId('facebook-share');
    expect(facebookButton).toHaveAttribute('data-title', 'undefined');
  });

  it('handles Pinterest without media field', async () => {
    const propsWithPinterestNoMedia = {
      ...defaultProps,
      fields: {
        items: [
          {
            id: 'social-pinterest',
            url: '/social/pinterest',
            name: 'Pinterest',
            displayName: 'Pinterest',
            fields: {
              Title: { value: 'Share on Pinterest' },
              SocialIcon: {
                value: {
                  src: '/icons/pinterest.png',
                  alt: 'Pinterest icon',
                  width: '48',
                  height: '48',
                },
              },
            },
          },
        ],
      },
    };

    render(<SocialShare {...propsWithPinterestNoMedia} />);

    // Pinterest button should not render when Media field is missing
    expect(screen.queryByTestId('pinterest-share')).not.toBeInTheDocument();
  });

  it('handles unknown social platform names', async () => {
    const propsWithUnknownPlatform = {
      ...defaultProps,
      fields: {
        items: [
          {
            id: 'social-unknown',
            url: '/social/unknown',
            name: 'UnknownPlatform',
            displayName: 'Unknown Platform',
            fields: {
              Title: { value: 'Share on Unknown' },
              SocialIcon: {
                value: {
                  src: '/icons/unknown.png',
                  alt: 'Unknown icon',
                  width: '48',
                  height: '48',
                },
              },
            },
          },
        ],
      },
    };

    render(<SocialShare {...propsWithUnknownPlatform} />);

    // Unknown platform should not render any share button
    expect(screen.queryByTestId('facebook-share')).not.toBeInTheDocument();
    expect(screen.queryByTestId('linkedin-share')).not.toBeInTheDocument();
    expect(screen.queryByTestId('twitter-share')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pinterest-share')).not.toBeInTheDocument();
    expect(screen.queryByTestId('email-share')).not.toBeInTheDocument();
  });

  it('handles different URL formats', async () => {
    render(<SocialShare {...defaultProps} />);

    const facebookButton = screen.getByTestId('facebook-share');
    expect(facebookButton).toHaveAttribute('data-url');
  });

  it('renders with custom styles', async () => {
    const propsWithCustomStyles = {
      ...defaultProps,
      params: {
        ...defaultProps.params,
        styles: 'custom-social-share my-custom-class',
      },
    };

    const { container } = render(<SocialShare {...propsWithCustomStyles} />);

    const socialShareContainer = container.querySelector('#social-share-1');
    expect(socialShareContainer).toHaveClass('custom-social-share', 'my-custom-class');
  });

  it('renders with custom rendering identifier', async () => {
    const propsWithCustomId = {
      ...defaultProps,
      params: {
        ...defaultProps.params,
        RenderingIdentifier: 'custom-social-share-id',
      },
    };

    const { container } = render(<SocialShare {...propsWithCustomId} />);

    const socialShareContainer = container.querySelector('#custom-social-share-id');
    expect(socialShareContainer).toBeInTheDocument();
  });

  it('handles mixed social platforms correctly', async () => {
    const propsWithMixedPlatforms = {
      ...defaultProps,
      fields: {
        items: [
          createMockSocialItem('Facebook', 'Share on Facebook', '/icons/facebook.png'),
          createMockSocialItem('LinkedIn', 'Share on LinkedIn', '/icons/linkedin.png'),
          createMockSocialItem('UnknownPlatform', 'Share on Unknown', '/icons/unknown.png'),
          createMockSocialItem('Email', 'Share via Email', '/icons/email.png'),
        ],
      },
    };

    render(<SocialShare {...propsWithMixedPlatforms} />);

    // Should render only valid platforms
    expect(screen.getByTestId('facebook-share')).toBeInTheDocument();
    expect(screen.getByTestId('linkedin-share')).toBeInTheDocument();
    expect(screen.getByTestId('email-share')).toBeInTheDocument();

    // Should not render unknown platform
    expect(screen.queryByTestId('twitter-share')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pinterest-share')).not.toBeInTheDocument();

    // Should render correct number of images
    const images = screen.getAllByTestId('sitecore-image');
    expect(images).toHaveLength(3);
  });
});
