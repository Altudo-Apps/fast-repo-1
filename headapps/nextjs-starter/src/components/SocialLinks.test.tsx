import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { mockCn } from 'src/test-utils';
import type { SocialLinksProps, SocialLink } from 'src/types/SocialLinks.types';
import { Default as SocialLinks } from './SocialLinks';

// Explicitly mock SitecoreLink and SitecoreImage
vi.mock('src/core/atom/Link', () => ({
  SitecoreLink: ({ field, className, children }: any) => (
    <a href={field?.value?.href || '#'} className={className} data-testid="sitecore-link">
      {children}
    </a>
  ),
}));
vi.mock('src/core/atom/Images', () => ({
  SitecoreImage: ({ field, className, editable, width, height }: any) => (
    <img
      src={field?.value?.src || ''}
      alt={field?.value?.alt || 'icon'}
      className={className}
      data-editable={editable}
      width={width}
      height={height}
      data-testid="sitecore-image"
    />
  ),
}));

// Use shared cn mock
beforeEach(() => {
  vi.clearAllMocks();
  mockCn();
});

const mockSocialLink = (overrides?: Partial<SocialLink>): SocialLink => ({
  fields: {
    SocialIcon: {
      value: {
        src: '/icon.png',
        alt: 'Test Icon',
        width: 48,
        height: 48,
      },
    },
    SocialLink: {
      value: {
        href: 'https://twitter.com',
        text: 'Twitter',
        title: 'Twitter',
        target: '_blank',
      },
    },
    ...(overrides?.fields || {}),
  },
  ...overrides,
});

const baseProps: SocialLinksProps = {
  fields: {
    items: [
      mockSocialLink(),
      mockSocialLink({
        fields: {
          SocialIcon: { value: { src: '/icon2.png', alt: 'Icon2', width: 48, height: 48 } },
          SocialLink: {
            value: {
              href: 'https://facebook.com',
              text: 'Facebook',
              title: 'Facebook',
              target: '_blank',
            },
          },
        },
      }),
    ],
  },
  params: {
    styles: 'custom-style',
    RenderingIdentifier: 'social-links-1',
  },
  rendering: { componentName: 'SocialLinks', params: {} },
};

describe('SocialLinks', () => {
  it('renders with required props', async () => {
    render(<SocialLinks {...baseProps} />);
    const links = screen.getAllByTestId('sitecore-link');
    expect(links).toHaveLength(2);
    const images = screen.getAllByTestId('sitecore-image');
    expect(images).toHaveLength(2);
    expect(screen.getByRole('img', { name: 'Test Icon' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Icon2' })).toBeInTheDocument();
    // Check wrapper div class and id
    const wrapper = links[0].parentElement?.parentElement;
    expect(wrapper).toHaveClass('custom-style');
    expect(wrapper).toHaveAttribute('id', 'social-links-1');
  });

  it('handles empty items array gracefully', async () => {
    render(<SocialLinks {...{ ...baseProps, fields: { items: [] } }} />);
    // Should render the wrapper but no links/images
    expect(screen.queryByTestId('sitecore-link')).not.toBeInTheDocument();
    expect(screen.queryByTestId('sitecore-image')).not.toBeInTheDocument();
  });

  it('handles missing SocialIcon or SocialLink fields', async () => {
    const items = [
      mockSocialLink({
        fields: {
          SocialIcon: undefined as any,
          SocialLink: {
            value: {
              href: 'https://twitter.com',
              text: 'Twitter',
              title: 'Twitter',
              target: '_blank',
            },
          },
        },
      }),
      mockSocialLink({
        fields: {
          SocialIcon: {
            value: {
              src: '/icon2.png',
              alt: 'Icon2',
              width: 48,
              height: 48,
            },
          },
          SocialLink: undefined as any,
        },
      }),
    ];
    render(<SocialLinks {...{ ...baseProps, fields: { items } }} />);
    // Should still render links/images for valid entries
    expect(
      screen.getAllByTestId('sitecore-link').length + screen.getAllByTestId('sitecore-image').length
    ).toBeGreaterThan(0);
  });

  it('handles missing params.styles and RenderingIdentifier', async () => {
    render(
      <SocialLinks
        {...{
          ...baseProps,
          params: { styles: undefined as any, RenderingIdentifier: undefined as any },
        }}
      />
    );
    // Should render without crashing
    const links = screen.getAllByTestId('sitecore-link');
    expect(links).toHaveLength(2);
    const wrapper = links[0].parentElement?.parentElement;
    expect(wrapper).not.toHaveAttribute('id');
  });

  it('passes correct props to SitecoreLink and SitecoreImage', async () => {
    render(<SocialLinks {...baseProps} />);
    const links = screen.getAllByTestId('sitecore-link');
    const images = screen.getAllByTestId('sitecore-image');
    expect(links[0]).toHaveAttribute('href', 'https://twitter.com');
    expect(links[1]).toHaveAttribute('href', 'https://facebook.com');
    expect(images[0]).toHaveAttribute('src', '/icon.png');
    expect(images[1]).toHaveAttribute('src', '/icon2.png');
    expect(images[0]).toHaveAttribute('width', '48');
    expect(images[0]).toHaveAttribute('height', '48');
  });

  it('handles edge case: items is undefined', async () => {
    render(
      <SocialLinks
        {...{
          ...baseProps,
          fields: {} as any, // simulate missing items
        }}
      />
    );
    // Should not throw, but render nothing inside the flex div
    expect(screen.queryByTestId('sitecore-link')).not.toBeInTheDocument();
  });

  it('handles edge case: fields is undefined', async () => {
    render(
      <SocialLinks
        {...{
          ...baseProps,
          fields: undefined as any,
        }}
      />
    );
    // Should not throw, but render nothing inside the flex div
    expect(screen.queryByTestId('sitecore-link')).not.toBeInTheDocument();
  });
});
