import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Default as CarouselSlide } from './CarouselSlide';

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
}));

describe('CarouselSlide', () => {
  const makeProps = (dynamicId: string = '123', styles: string = 'cls', id?: string) => ({
    params: { DynamicPlaceholderId: dynamicId, styles, RenderingIdentifier: id },
    rendering: { componentName: 'CarouselSlide', params: {} } as any,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders wrapper with styles and optional id', () => {
    const { container } = render(
      <CarouselSlide {...(makeProps('abc', 'my-styles', 'slide-1') as any)} />
    );
    const wrapper = container.querySelector('div.component') as HTMLElement;
    expect(wrapper).toHaveClass('component', 'my-styles');
    expect(wrapper).toHaveAttribute('id', 'slide-1');
  });

  it('omits id attribute when RenderingIdentifier is not provided', () => {
    const { container } = render(<CarouselSlide {...(makeProps('abc', 'my-styles') as any)} />);
    const wrapper = container.querySelector('div.component') as HTMLElement;
    expect(wrapper).toHaveClass('component', 'my-styles');
    expect(wrapper.hasAttribute('id')).toBe(false);
  });

  it('renders placeholder with correct name', () => {
    render(<CarouselSlide {...(makeProps('xyz') as any)} />);
    const ph = screen.getByTestId('placeholder');
    expect(ph).toHaveAttribute('data-name', 'slide-{*}');
  });
});
