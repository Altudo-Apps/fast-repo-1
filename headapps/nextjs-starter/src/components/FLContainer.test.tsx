import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { mockCn } from 'src/test-utils';

// Mock Sitecore SDK Placeholder
vi.mock('@sitecore-content-sdk/nextjs', () => ({
  Placeholder: vi.fn(({ name }: { name: string }) => (
    <div data-testid="placeholder" data-name={name} />
  )),
}));

// Component under test
import { Default as FLContainer } from './FLContainer';

describe('FLContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCn();
  });

  const makeProps = (overrides?: Partial<any>) => ({
    params: {
      DynamicPlaceholderId: 'abc',
      GridParameters: 'container grid grid-cols-2',
      Styles: 'position-center sxa-bordered',
      RenderingIdentifier: 'flc-1',
      BackgroundImage: 'mediaurl="https://example.com/bg.jpg"',
      ...(overrides?.params || {}),
    },
    rendering: {
      componentName: 'FLContainer',
      params: { DynamicPlaceholderId: 'abc' },
      ...(overrides?.rendering || {}),
    },
  });

  it('renders with required props and passes correct placeholder name', () => {
    const props = makeProps();
    const { container } = render(<FLContainer {...(props as any)} />);

    const ph = screen.getByTestId('placeholder');
    expect(ph).toHaveAttribute('data-name', 'container-abc');

    // wrapper id is RenderingIdentifier
    const outer = container.querySelector('#flc-1');
    expect(outer).toBeInTheDocument();
  });

  it('applies background image style from params.BackgroundImage', () => {
    const props = makeProps();
    const { container } = render(<FLContainer {...(props as any)} />);

    const bgHost = container.querySelector('div.w-full') as HTMLElement;
    expect(bgHost).toBeTruthy();
    expect(bgHost.style.backgroundImage).toContain('https://example.com/bg.jpg');
  });

  it('applies container and centered classes based on GridParameters and Styles', () => {
    const props = makeProps();
    const { container } = render(<FLContainer {...(props as any)} />);

    // The inner layout wrapper should include container and alignment classes
    const inner = container.querySelector('div.container.mx-auto');
    expect(inner).toBeTruthy();
    expect(inner).toHaveClass('flex', 'flex-col', 'items-center');

    // Bordered style adds padding classes
    expect(inner).toHaveClass('lg:px-12', 'px-4');
  });
});
