import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CustomButton from './CustomButton';
import { mockCn } from 'src/test-utils';

// Mock dependencies
vi.mock('@sitecore-content-sdk/nextjs', () => ({
  Link: ({ field, children }: any) => <a href={field?.value?.href || '#'}>{children}</a>,
}));
vi.mock('src/core/ui/button', () => ({
  Button: ({ asChild, size, variant, className, children }: any) => (
    <button className={className}>{children}</button>
  ),
}));
vi.mock('src/core/atom/Images', () => ({
  SitecoreImage: ({ field, alt, className, 'aria-hidden': ariaHidden }: any) => {
    // Only render if field has a value
    if (!field?.value) return null;
    return (
      <img
        src={field.value.src || ''}
        alt={alt}
        className={className}
        aria-hidden={ariaHidden}
        data-testid="sitecore-image"
      />
    );
  },
}));

// Use shared cn mock
mockCn();

describe('CustomButton', () => {
  const baseProps = {
    params: { ButtonStyle: 'primary', Styles: '' },
    fields: {
      ButtonLink: { value: { href: '/test', title: 'Test Title', text: 'Test Text' } },
      ButtonImage: { value: undefined },
    },
    rendering: {
      componentName: 'CTAButton',
      params: { ButtonStyle: 'primary', Styles: '' },
    },
  };

  it('renders with title if present', () => {
    render(<CustomButton {...baseProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.queryByText('Test Text')).not.toBeInTheDocument();
  });

  it('renders with text if title is missing', () => {
    const props = {
      ...baseProps,
      fields: {
        ...baseProps.fields,
        ButtonLink: { value: { href: '/test', title: '', text: 'Test Text' } },
      },
    };
    render(<CustomButton {...props} />);
    expect(screen.getByText('Test Text')).toBeInTheDocument();
  });

  it('renders image if ButtonImage is provided', () => {
    const props = {
      ...baseProps,
      fields: {
        ...baseProps.fields,
        ButtonImage: { value: { src: '/img.png' } },
      },
    };
    render(<CustomButton {...props} />);
    const img = screen.getByTestId('sitecore-image');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/img.png');
  });

  it('renders image with proper accessibility attributes', () => {
    const props = {
      ...baseProps,
      fields: {
        ...baseProps.fields,
        ButtonImage: { value: { src: '/img.png' } },
      },
    };
    render(<CustomButton {...props} />);
    const img = screen.getByTestId('sitecore-image');
    expect(img).toHaveAttribute('alt', '');
    expect(img).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies flex-row-reverse when position-right', () => {
    const props = {
      ...baseProps,
      params: { ...baseProps.params, Styles: 'position-right' },
    };
    render(<CustomButton {...props} />);
    const flexDiv = screen.getByText('Test Title').parentElement;
    expect(flexDiv?.className).toContain('flex-row-reverse');
  });

  it('applies flex-col when position-center', () => {
    const props = {
      ...baseProps,
      params: { ...baseProps.params, Styles: 'position-center' },
    };
    render(<CustomButton {...props} />);
    const flexDiv = screen.getByText('Test Title').parentElement;
    expect(flexDiv?.className).toContain('flex-col');
  });

  it('handles missing ButtonImage gracefully', () => {
    render(<CustomButton {...baseProps} />);
    expect(screen.queryByTestId('sitecore-image')).not.toBeInTheDocument();
  });

  it('renders button with proper link structure', () => {
    render(<CustomButton {...baseProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test');
    expect(link).toHaveTextContent('Test Title');
  });
});
