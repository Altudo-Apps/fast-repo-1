import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { mockCn } from 'src/test-utils';
import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import { Default as MegaNavLinkList } from './MegaNavLinkList';

// Mock SitecoreLink component
vi.mock('src/core/atom/Link', () => ({
  SitecoreLink: ({ field, className, children }: any) => (
    <a href={field?.value?.href || '#'} className={className} data-testid="sitecore-link">
      {children}
    </a>
  ),
}));

// Use shared cn mock
beforeEach(() => {
  vi.clearAllMocks();
  mockCn();
});

// Define types to match the component
type ResultsFieldLink = {
  field: {
    link: LinkField & {
      target?: {
        linkTitle: TextField;
        linkDescription: TextField;
      };
    };
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

type MegaNavLinkListProps = {
  params: { [key: string]: string };
  fields: Fields;
  level?: 'one' | 'two';
};

// Mock data helpers
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

const createMockTextField = (value: string): TextField => ({
  value,
});

const createMockTarget = (title: string, description: string) => ({
  linkTitle: createMockTextField(title),
  linkDescription: createMockTextField(description),
});

const createMockResult = (
  linkOverrides?: Partial<LinkField>,
  target?: { linkTitle: TextField; linkDescription: TextField }
): ResultsFieldLink => ({
  field: {
    link: createMockLinkField(linkOverrides),
    ...(target && { target }),
  },
});

const baseProps: MegaNavLinkListProps = {
  params: {
    styles: 'custom-style',
    id: 'mega-nav-link-list-1',
  },
  fields: {
    data: {
      datasource: {
        children: {
          results: [
            createMockResult(
              { value: { href: '/link1', text: 'Link 1', linktype: 'internal' } },
              createMockTarget('Link 1 Title', 'Link 1 Description')
            ),
            createMockResult(
              { value: { href: '/link2', text: 'Link 2', linktype: 'external' } },
              createMockTarget('Link 2 Title', 'Link 2 Description')
            ),
            createMockResult(
              { value: { href: '/link3', text: 'Link 3', linktype: 'internal' } },
              createMockTarget('Link 3 Title', 'Link 3 Description')
            ),
          ],
        },
        field: {
          title: createMockTextField('Mega Nav Title'),
        },
      },
    },
  },
};

describe('MegaNavLinkList', () => {
  it('renders with required props', async () => {
    render(<MegaNavLinkList {...baseProps} />);

    const links = screen.getAllByTestId('sitecore-link');
    expect(links).toHaveLength(3);

    // Check wrapper div class and id
    const wrapper = links[0].closest('.mega-nav-link-list');
    expect(wrapper).toHaveClass('custom-style');
    expect(wrapper).toHaveAttribute('id', 'mega-nav-link-list-1');

    // Check that links are rendered with correct text
    expect(screen.getByText('Link 1 Title')).toBeInTheDocument();
    expect(screen.getByText('Link 2')).toBeInTheDocument(); // External link uses text as title
    expect(screen.getByText('Link 3 Title')).toBeInTheDocument();

    // Check descriptions are rendered (external links don't show description)
    expect(screen.getByText('Link 1 Description')).toBeInTheDocument();
    expect(screen.queryByText('Link 2 Title')).not.toBeInTheDocument(); // External link doesn't show description
    expect(screen.getByText('Link 3 Description')).toBeInTheDocument();
  });

  it('handles external links correctly', async () => {
    const externalLinkProps = {
      ...baseProps,
      fields: {
        data: {
          datasource: {
            children: {
              results: [
                createMockResult(
                  {
                    value: {
                      href: 'https://external.com',
                      text: 'External Link',
                      linktype: 'external',
                    },
                  },
                  createMockTarget('External Link Title', 'External Link Description')
                ),
              ],
            },
            field: {
              title: createMockTextField('External Links'),
            },
          },
        },
      },
    };

    render(<MegaNavLinkList {...externalLinkProps} />);

    const link = screen.getByTestId('sitecore-link');
    expect(link).toHaveAttribute('href', 'https://external.com');
    expect(screen.getByText('External Link')).toBeInTheDocument(); // For external links, text is used as title
    expect(screen.queryByText('External Link Title')).not.toBeInTheDocument(); // External links don't show description
  });

  it('handles empty results array gracefully', async () => {
    const emptyProps = {
      ...baseProps,
      fields: {
        data: {
          datasource: {
            children: {
              results: [],
            },
            field: {
              title: createMockTextField('Empty List'),
            },
          },
        },
      },
    };

    render(<MegaNavLinkList {...emptyProps} />);

    // Should render the wrapper but no links
    expect(screen.queryByTestId('sitecore-link')).not.toBeInTheDocument();
    // Should render empty ul when datasource exists but has no results
    const wrapper = screen.getByRole('list');
    expect(wrapper).toBeInTheDocument();
  });

  it('handles missing link fields gracefully', async () => {
    const missingLinkProps = {
      ...baseProps,
      fields: {
        data: {
          datasource: {
            children: {
              results: [
                createMockResult(),
                { field: { link: undefined as any } }, // Missing link
                createMockResult(
                  { value: { href: '/link3', text: 'Link 3', linktype: 'internal' } },
                  createMockTarget('Link 3 Title', 'Link 3 Description')
                ),
              ],
            },
            field: {
              title: createMockTextField('Partial Links'),
            },
          },
        },
      },
    };

    render(<MegaNavLinkList {...missingLinkProps} />);

    // Should only render valid links
    const links = screen.getAllByTestId('sitecore-link');
    expect(links).toHaveLength(2);
  });

  it('handles missing target fields gracefully', async () => {
    const missingTargetProps = {
      ...baseProps,
      fields: {
        data: {
          datasource: {
            children: {
              results: [
                createMockResult(
                  { value: { href: '/link1', text: 'Link 1', linktype: 'internal' } }
                  // No target field
                ),
                createMockResult(
                  { value: { href: '/link2', text: 'Link 2', linktype: 'internal' } },
                  createMockTarget('Link 2 Title', 'Link 2 Description')
                ),
              ],
            },
            field: {
              title: createMockTextField('Mixed Targets'),
            },
          },
        },
      },
    };

    render(<MegaNavLinkList {...missingTargetProps} />);

    const links = screen.getAllByTestId('sitecore-link');
    expect(links).toHaveLength(2);

    // First link should have empty title and description
    const firstLink = screen.getAllByTestId('sitecore-link')[0];
    expect(firstLink).toHaveTextContent(''); // Empty title
    expect(screen.queryByText('Link 1 Description')).not.toBeInTheDocument(); // No description

    // Second link should have proper title and description
    expect(screen.getByText('Link 2 Title')).toBeInTheDocument();
    expect(screen.getByText('Link 2 Description')).toBeInTheDocument();
  });

  it('handles missing params gracefully', async () => {
    const missingParamsProps = {
      ...baseProps,
      params: {},
    };

    render(<MegaNavLinkList {...missingParamsProps} />);

    const links = screen.getAllByTestId('sitecore-link');
    expect(links).toHaveLength(3);

    // Should render without crashing, but without custom styles or id
    const wrapper = links[0].closest('.mega-nav-link-list');
    expect(wrapper).not.toHaveAttribute('id');
  });

  it('handles missing datasource gracefully', async () => {
    const missingDatasourceProps = {
      ...baseProps,
      fields: {
        data: {
          datasource: undefined as any,
        },
      },
    };

    render(<MegaNavLinkList {...missingDatasourceProps} />);

    // Should render fallback content
    expect(screen.getByText('Mega Nav Link List')).toBeInTheDocument();
    expect(screen.queryByTestId('sitecore-link')).not.toBeInTheDocument();
  });

  it('handles missing fields gracefully', async () => {
    const missingFieldsProps = {
      ...baseProps,
      fields: undefined as any,
    };

    render(<MegaNavLinkList {...missingFieldsProps} />);

    // Should render fallback content
    expect(screen.getByText('Mega Nav Link List')).toBeInTheDocument();
    expect(screen.queryByTestId('sitecore-link')).not.toBeInTheDocument();
  });

  it('applies correct CSS classes to list items', async () => {
    render(<MegaNavLinkList {...baseProps} />);

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);

    // Check CSS classes are applied correctly
    expect(listItems[0]).toHaveClass('item0', 'odd', 'first');
    expect(listItems[1]).toHaveClass('item1', 'even');
    expect(listItems[2]).toHaveClass('item2', 'odd', 'last');
  });

  it('handles different link types correctly', async () => {
    const mixedLinkTypesProps = {
      ...baseProps,
      fields: {
        data: {
          datasource: {
            children: {
              results: [
                createMockResult(
                  { value: { href: '/internal', text: 'Internal', linktype: 'internal' } },
                  createMockTarget('Internal Title', 'Internal Description')
                ),
                createMockResult(
                  {
                    value: { href: 'https://external.com', text: 'External', linktype: 'external' },
                  },
                  createMockTarget('External Title', 'External Description')
                ),
                createMockResult(
                  { value: { href: '/anchor', text: 'Anchor', linktype: 'anchor' } },
                  createMockTarget('Anchor Title', 'Anchor Description')
                ),
              ],
            },
            field: {
              title: createMockTextField('Mixed Types'),
            },
          },
        },
      },
    };

    render(<MegaNavLinkList {...mixedLinkTypesProps} />);

    const links = screen.getAllByTestId('sitecore-link');
    expect(links).toHaveLength(3);

    // Internal and anchor links should use target fields
    expect(screen.getByText('Internal Title')).toBeInTheDocument();
    expect(screen.getByText('Anchor Title')).toBeInTheDocument();

    // External link should use text as title and not show description
    expect(screen.getByText('External')).toBeInTheDocument();
    expect(screen.queryByText('External Title')).not.toBeInTheDocument(); // External links don't show description
  });

  it('handles numeric values in text fields', async () => {
    const numericProps = {
      ...baseProps,
      fields: {
        data: {
          datasource: {
            children: {
              results: [
                createMockResult(
                  { value: { href: '/numeric', text: '123', linktype: 'internal' } },
                  {
                    linkTitle: { value: '456' },
                    linkDescription: { value: '789' },
                  }
                ),
              ],
            },
            field: {
              title: createMockTextField('Numeric Values'),
            },
          },
        },
      },
    };

    render(<MegaNavLinkList {...numericProps} />);

    // Should convert numeric values to strings
    expect(screen.getByText('456')).toBeInTheDocument();
    expect(screen.getByText('789')).toBeInTheDocument();
  });

  it('handles undefined values gracefully', async () => {
    const undefinedProps = {
      ...baseProps,
      fields: {
        data: {
          datasource: {
            children: {
              results: [
                createMockResult(
                  { value: { href: '/undefined', text: undefined, linktype: 'internal' } },
                  {
                    linkTitle: { value: undefined },
                    linkDescription: { value: undefined },
                  }
                ),
              ],
            },
            field: {
              title: createMockTextField('Undefined Values'),
            },
          },
        },
      },
    };

    render(<MegaNavLinkList {...undefinedProps} />);

    // Should render empty strings for undefined values
    const link = screen.getByTestId('sitecore-link');
    expect(link).toHaveTextContent('');
  });

  it('passes correct props to SitecoreLink', async () => {
    render(<MegaNavLinkList {...baseProps} />);

    const links = screen.getAllByTestId('sitecore-link');
    expect(links[0]).toHaveAttribute('href', '/link1');
    expect(links[1]).toHaveAttribute('href', '/link2');
    expect(links[2]).toHaveAttribute('href', '/link3');

    // Check that className is passed correctly
    expect(links[0]).toHaveClass('mr-2', 'text-sm', 'font-medium', '!text-popover-foreground');
  });

  it('renders with level prop', async () => {
    const levelProps = {
      ...baseProps,
      level: 'two' as const,
    };

    render(<MegaNavLinkList {...levelProps} />);

    // Should render the same way regardless of level (level is not used in current implementation)
    const links = screen.getAllByTestId('sitecore-link');
    expect(links).toHaveLength(3);
  });

  it('handles malformed link field values', async () => {
    const malformedProps = {
      ...baseProps,
      fields: {
        data: {
          datasource: {
            children: {
              results: [
                {
                  field: {
                    link: {
                      value: {
                        href: '/malformed1',
                        text: '',
                        linktype: 'internal',
                      },
                    },
                  },
                },
                {
                  field: {
                    link: {
                      value: {
                        href: '/malformed2',
                        text: 'Valid Link',
                        linktype: 'internal',
                      },
                    },
                  },
                },
              ],
            },
            field: {
              title: createMockTextField('Malformed'),
            },
          },
        },
      },
    };

    render(<MegaNavLinkList {...malformedProps} />);

    // Should handle malformed data gracefully
    const links = screen.getAllByTestId('sitecore-link');
    expect(links).toHaveLength(2);
  });
});
