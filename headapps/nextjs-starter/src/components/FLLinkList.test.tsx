import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { Default as FLLinkList } from './FLLinkList';

// Mock SitecoreLink used by FLLinkList
vi.mock('src/core/atom/Link', () => ({
  SitecoreLink: ({ field, className }: any) => (
    <a href={field?.value?.href || '#'} className={className} data-testid="sitecore-link">
      {field?.value?.text || ''}
    </a>
  ),
}));

// Mock Text from content SDK
vi.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag: Tag = 'div' }: any) => <Tag>{field?.value || ''}</Tag>,
}));

type ResultsFieldLink = {
  field: {
    link?: LinkField;
  };
};

interface Fields {
  data: {
    datasource: {
      children: {
        results: ResultsFieldLink[];
      };
      field: {
        title: TextField;
      };
    };
  };
}

const createMockLinkField = (overrides?: Partial<LinkField>): LinkField => ({
  value: {
    href: '/test-link',
    text: 'Test Link',
    title: 'Test Link Title',
    linktype: 'internal',
    ...overrides?.value,
  },
  ...overrides,
});

const createMockTextField = (value: string): TextField => ({ value });

const baseProps = {
  params: {
    styles: 'custom-style ', // note trailing space to verify trim
    RenderingIdentifier: 'fl-link-list-1',
  },
  fields: {
    data: {
      datasource: {
        children: {
          results: [
            { field: { link: createMockLinkField({ value: { href: '/link1', text: 'Link 1' } }) } },
            { field: { link: createMockLinkField({ value: { href: '/link2', text: 'Link 2' } }) } },
            { field: { link: createMockLinkField({ value: { href: '/link3', text: 'Link 3' } }) } },
          ],
        },
        field: {
          title: createMockTextField('List Title'),
        },
      },
    },
  } as Fields,
};

describe('FLLinkList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with required props and trims styles', async () => {
    render(<FLLinkList {...(baseProps as any)} />);

    // 3 links rendered
    const links = screen.getAllByTestId('sitecore-link');
    expect(links).toHaveLength(3);

    // wrapper has classes and id
    const wrapper = links[0].closest('.fl-linklist');
    expect(wrapper).toBeTruthy();
    expect(wrapper!).toHaveClass('component');
    expect(wrapper!).toHaveClass('fl-link-list');
    expect(wrapper!).toHaveClass('custom-style');
    expect(wrapper!).toHaveAttribute('id', 'fl-link-list-1');

    // list exists
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('applies correct classes to list items', () => {
    render(<FLLinkList {...(baseProps as any)} />);
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
    expect(listItems[0]).toHaveClass('item0', 'odd', 'first');
    expect(listItems[1]).toHaveClass('item1', 'even');
    expect(listItems[2]).toHaveClass('item2', 'odd', 'last');
  });

  it('filters out items without a link field', () => {
    const props = {
      ...baseProps,
      fields: {
        data: {
          datasource: {
            children: {
              results: [
                { field: { link: createMockLinkField({ value: { href: '/ok', text: 'OK' } }) } },
                { field: { link: undefined as any } },
                { field: { link: createMockLinkField({ value: { href: '/ok2', text: 'OK 2' } }) } },
              ],
            },
            field: { title: createMockTextField('Title') },
          },
        },
      },
    } as any;

    render(<FLLinkList {...props} />);
    const links = screen.getAllByTestId('sitecore-link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/ok');
    expect(links[1]).toHaveAttribute('href', '/ok2');
  });

  it('renders fallback when datasource is missing', () => {
    const props = {
      params: { RenderingIdentifier: 'no-ds' },
      fields: { data: { datasource: undefined } },
    } as any;

    render(<FLLinkList {...props} />);
    expect(screen.getByText('FL Link List')).toBeInTheDocument();
  });
});
