import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContentCardBtn from './ContentCardBtn';
import { mockCn } from 'src/test-utils';
import type { LinkField } from '@sitecore-content-sdk/nextjs';

// Use shared cn mock
mockCn();

// Mock CardFooter
vi.mock('src/core/ui/card', () => ({
  CardFooter: vi.fn(({ children, className }: any) => (
    <div data-testid="card-footer" className={className}>
      {children}
    </div>
  )),
}));

// Mock CustomButtonLink
vi.mock('src/core/atom/CustomButtonLink', () => ({
  CustomButtonLink: vi.fn(({ children, variant, field, className, ...props }: any) => {
    if (variant === 'link') {
      return (
        <a
          data-testid="custom-button-link-link"
          href={field?.value?.href}
          className={className}
          {...props}
        >
          {field?.value?.text || field?.value?.href}
        </a>
      );
    }
    return (
      <button data-testid="custom-button-link-button" className={className} {...props}>
        {children}
      </button>
    );
  }),
}));

// Mock ArrowRight icon
vi.mock('lucide-react', () => ({
  ArrowRight: () => <svg data-testid="arrow-right" />,
}));

const mockLinkField = (overrides?: Partial<LinkField['value']>): LinkField =>
  ({
    value: {
      href: '/test-link',
      text: 'Test Link',
      title: 'Test Link',
      target: '',
      ...overrides,
    },
  } as LinkField);

describe('ContentCardBtn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing if href is missing', () => {
    const props = { CalltoActionLinkMain: mockLinkField({ href: '' }), LinkType: 'Button' };
    const { container } = render(<ContentCardBtn {...props} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing if href is "/"', () => {
    const props = { CalltoActionLinkMain: mockLinkField({ href: '/' }), LinkType: 'Button' };
    const { container } = render(<ContentCardBtn {...props} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing if LinkType is missing', () => {
    const props = { CalltoActionLinkMain: mockLinkField() };
    const { container } = render(<ContentCardBtn {...(props as any)} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders a button with CustomButtonLink and ArrowRight when LinkType is "Button"', () => {
    const props = { CalltoActionLinkMain: mockLinkField(), LinkType: 'Button' };
    render(<ContentCardBtn {...props} />);
    expect(screen.getByTestId('card-footer')).toBeInTheDocument();
    expect(screen.getByTestId('custom-button-link-button')).toBeInTheDocument();
    expect(screen.getByTestId('arrow-right')).toBeInTheDocument();
    // Button should have correct class
    expect(screen.getByTestId('custom-button-link-button')).toHaveClass('w-full', 'px-3');
  });

  it('renders a CustomButtonLink when LinkType is not "Button"', () => {
    const props = { CalltoActionLinkMain: mockLinkField(), LinkType: 'Link' };
    render(<ContentCardBtn {...props} />);
    expect(screen.getByTestId('card-footer')).toBeInTheDocument();
    expect(screen.getByTestId('custom-button-link-link')).toBeInTheDocument();
    expect(screen.queryByTestId('custom-button-link-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('arrow-right')).not.toBeInTheDocument();
    // CustomButtonLink should have correct class
    expect(screen.getByTestId('custom-button-link-link')).toHaveClass(
      'underline',
      'text-foreground'
    );
  });

  it('passes correct props to CustomButtonLink for link variant', () => {
    const props = {
      CalltoActionLinkMain: mockLinkField({ href: '/foo', text: 'Foo' }),
      LinkType: 'Link',
    };
    render(<ContentCardBtn {...props} />);
    const link = screen.getByTestId('custom-button-link-link');
    expect(link).toHaveAttribute('href', '/foo');
    expect(link).toHaveTextContent('Foo');
  });

  it('passes correct props to CustomButtonLink for button variant', () => {
    const props = {
      CalltoActionLinkMain: mockLinkField({ href: '/bar', text: 'Bar', title: 'Bar Title' }),
      LinkType: 'Button',
    };
    render(<ContentCardBtn {...props} />);
    const button = screen.getByTestId('custom-button-link-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Bar Title');
  });

  it('uses fallback text when title and text are missing', () => {
    const props = {
      CalltoActionLinkMain: mockLinkField({ href: '/bar', text: '', title: '' }),
      LinkType: 'Button',
    };
    render(<ContentCardBtn {...props} />);
    const button = screen.getByTestId('custom-button-link-button');
    expect(button).toHaveTextContent('Learn more');
  });

  it('handles edge case: CalltoActionLinkMain.value is undefined', () => {
    const props = { CalltoActionLinkMain: { value: undefined } as any, LinkType: 'Button' };
    const { container } = render(<ContentCardBtn {...props} />);
    expect(container.firstChild).toBeNull();
  });

  it('handles edge case: CalltoActionLinkMain is undefined', () => {
    const props = { CalltoActionLinkMain: undefined as any, LinkType: 'Button' };
    const { container } = render(<ContentCardBtn {...props} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders with additional props combinations', () => {
    // LinkType: "Button" with minimal link
    render(
      <ContentCardBtn
        CalltoActionLinkMain={mockLinkField({ href: '/baz', text: '' })}
        LinkType="Button"
      />
    );
    expect(screen.getByTestId('custom-button-link-button')).toBeInTheDocument();
    // LinkType: "Link" with minimal link
    render(
      <ContentCardBtn
        CalltoActionLinkMain={mockLinkField({ href: '/baz', text: '' })}
        LinkType="Link"
      />
    );
    expect(screen.getAllByTestId('custom-button-link-link').length).toBeGreaterThan(0);
  });

  it('renders correct structure for LinkType "Button"', () => {
    const props = { CalltoActionLinkMain: mockLinkField(), LinkType: 'Button' };
    render(<ContentCardBtn {...props} />);
    // Structure: CardFooter > div > CustomButtonLink (button) + ArrowRight
    const footer = screen.getByTestId('card-footer');
    const div = footer.querySelector('div.flex.items-center.gap-2') as HTMLElement;
    const button = screen.getByTestId('custom-button-link-button');
    const arrow = screen.getByTestId('arrow-right');

    expect(footer).toContainElement(div);
    expect(div).toContainElement(button);
    expect(div).toContainElement(arrow);
  });

  it('does not render anything for invalid prop combinations', () => {
    // No CalltoActionLinkMain
    render(<ContentCardBtn CalltoActionLinkMain={undefined as any} LinkType="Button" />);
    expect(screen.queryByTestId('card-footer')).not.toBeInTheDocument();
    // No LinkType
    render(<ContentCardBtn CalltoActionLinkMain={mockLinkField()} LinkType={undefined} />);
    expect(screen.queryByTestId('card-footer')).not.toBeInTheDocument();
    // href is missing
    render(<ContentCardBtn CalltoActionLinkMain={mockLinkField({ href: '' })} LinkType="Button" />);
    expect(screen.queryByTestId('card-footer')).not.toBeInTheDocument();
  });

  it('button is rendered as a button element', () => {
    const props = { CalltoActionLinkMain: mockLinkField(), LinkType: 'Button' };
    render(<ContentCardBtn {...props} />);
    const button = screen.getByTestId('custom-button-link-button');
    expect(button.tagName.toLowerCase()).toBe('button');
  });

  it('link is rendered as an anchor element', () => {
    const props = { CalltoActionLinkMain: mockLinkField(), LinkType: 'Link' };
    render(<ContentCardBtn {...props} />);
    const link = screen.getByTestId('custom-button-link-link');
    expect(link.tagName.toLowerCase()).toBe('a');
  });
});
