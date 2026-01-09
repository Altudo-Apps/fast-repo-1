import { describe, it, expect, vi } from 'vitest';
import * as SitecoreContentSdk from '@sitecore-content-sdk/nextjs';
import { Default as ArticleDate } from './ArticleDate';
import { render, screen } from '@testing-library/react';

// Mock DateField to just render the formatted date string
vi.mock('@sitecore-content-sdk/nextjs', async () => {
  const actual = await vi.importActual<typeof import('@sitecore-content-sdk/nextjs')>(
    '@sitecore-content-sdk/nextjs'
  );
  return {
    ...actual,
    DateField: ({ field, render }: any) => (
      <span data-testid="date-field">{render(new Date(field.value))}</span>
    ),
    useSitecore: vi.fn(),
  };
});

describe('ArticleDate', () => {
  const defaultParams = { styles: 'custom-style', RenderingIdentifier: 'date-id' };

  it('renders formatted date from props.fields.PublishedDate', () => {
    (SitecoreContentSdk.useSitecore as any).mockReturnValue({
      page: { layout: { sitecore: { route: { fields: {} } } } },
    });
    render(
      <ArticleDate
        params={defaultParams}
        fields={{ PublishedDate: { value: '2024-07-03T00:00:00Z', editable: '' } }}
      />
    );
    expect(screen.getByTestId('date-field')).toHaveTextContent('July 3, 2024');
    expect(screen.getByText('July 3, 2024')).toBeInTheDocument();
  });

  it('renders formatted date from context if props.fields.PublishedDate is missing', () => {
    (SitecoreContentSdk.useSitecore as any).mockReturnValue({
      page: {
        layout: {
          sitecore: {
            route: {
              fields: {
                PublishedDate: { value: '2023-12-25T00:00:00Z', editable: '' },
              },
            },
          },
        },
      },
    });
    render(
      <ArticleDate
        params={defaultParams}
        fields={{ PublishedDate: { value: undefined, editable: '' } }}
      />
    );
    expect(screen.getByTestId('date-field')).toHaveTextContent('December 25, 2023');
    expect(screen.getByText('December 25, 2023')).toBeInTheDocument();
  });

  it('renders placeholder if no valid date is present', () => {
    (SitecoreContentSdk.useSitecore as any).mockReturnValue({
      page: { layout: { sitecore: { route: { fields: {} } } } },
    });
    render(
      <ArticleDate params={defaultParams} fields={{ PublishedDate: { value: '', editable: '' } }} />
    );
    expect(screen.getByText('[Article Date]')).toBeInTheDocument();
  });
});
