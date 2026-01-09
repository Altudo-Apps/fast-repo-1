import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Default as FLRichText } from './FLRichText';

vi.mock('@sitecore-content-sdk/nextjs', () => ({
  RichText: ({ field, className }: any) =>
    field?.value ? (
      <div data-testid="rich-text" className={className}>
        {field.value}
      </div>
    ) : null,
}));

describe('FLRichText', () => {
  const makeProps = (overrides: Partial<any> = {}) => ({
    fields: {
      Text: { value: 'Hello world' },
    },
    params: {
      RenderingIdentifier: 'rt-1',
      styles: 'custom-class ',
    },
    rendering: {
      componentName: 'FLRichText',
      params: {},
    },
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders rich text with wrapper id and classes (trims trailing styles)', () => {
    render(<FLRichText {...(makeProps() as any)} />);
    const wrapper = document.getElementById('rt-1')!;

    // Fallback to querying by id/class in case role not present
    expect(wrapper).toHaveAttribute('id', 'rt-1');
    expect(wrapper).toHaveClass('component');
    expect(wrapper).toHaveClass('rich-text');
    expect(wrapper).toHaveClass('inline-block');
    // styles trimmed and applied
    expect(wrapper).toHaveClass('custom-class');

    // RichText content rendered via mock
    expect(screen.getByTestId('rich-text')).toHaveTextContent('Hello world');
  });

  it('shows empty hint when fields are missing', () => {
    const props = makeProps({ fields: undefined } as any);
    render(<FLRichText {...(props as any)} />);

    const hint = screen.getByText('Rich text');
    expect(hint).toBeInTheDocument();
    expect(hint).toHaveClass('is-empty-hint');
    expect(screen.queryByTestId('rich-text')).not.toBeInTheDocument();
  });
});
