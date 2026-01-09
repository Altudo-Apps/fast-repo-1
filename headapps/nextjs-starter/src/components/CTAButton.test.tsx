import React from 'react';
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Default as CTAButton } from './CTAButton';
import * as SitecoreContentSdk from '@sitecore-content-sdk/nextjs';

// Minimal mock for ImageField and LinkField
const mockImageField = {
  value: {
    src: '/test-image.png',
    alt: 'Test Image',
    width: 24,
    height: 24,
  },
};
const mockLinkField = {
  value: {
    href: '/test-link',
    text: 'Test CTA',
    title: 'Test CTA',
    target: '',
  },
};

describe('CTAButton', () => {
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
    render(
      <CTAButton
        fields={{
          ButtonImage: mockImageField,
          ButtonLink: mockLinkField,
        }}
        params={{
          ButtonStyle: 'primary',
          Styles: '',
          RenderingIdentifier: 'cta-btn-1',
        }}
        rendering={{ componentName: 'CTAButton', params: {} }}
      />
    );
    // Check for the button text
    expect(screen.getByText('Test CTA')).toBeInTheDocument();
    // Check for the image alt text
    expect(screen.getByAltText('Test Image')).toBeInTheDocument();
    // Check for the wrapper div with the correct id
    expect(screen.getByRole('link').parentElement).toHaveAttribute('id', 'cta-btn-1');
  });
});
