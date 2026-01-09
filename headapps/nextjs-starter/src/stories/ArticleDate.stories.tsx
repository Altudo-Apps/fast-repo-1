import type { Meta, StoryFn } from '@storybook/react';

import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';

import { Default as ArticleDate } from 'src/components/ArticleDate';

import { DateFieldProps } from '@sitecore-content-sdk/react';

import componentMap from '../../.sitecore/component-map';

import { apiStub, mockPage } from './stubs';

import { canvasWithin, expect } from './testUtils';

const meta: Meta<typeof ArticleDate> = {
  title: 'Components/FL/ArticleDate',

  component: ArticleDate,

  tags: ['autodocs'],
};

export default meta;

const Template: StoryFn<typeof ArticleDate> = (args) => (
  <SitecoreProvider componentMap={componentMap} api={apiStub} page={mockPage}>
    <ArticleDate {...args} />
  </SitecoreProvider>
);

export const Default = Template.bind({});

Default.args = {
  params: {
    RenderingIdentifier: 'article-date',

    styles: 'text-muted-foreground',
  },

  fields: {
    PublishedDate: {
      field: {
        value: '2024-07-04T00:00:00Z',
      },

      value: '2024-07-04T00:00:00Z',
    } as DateFieldProps,
  },
};

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);

  await expect(canvas.getByText(/july 4, 2024/i)).toBeVisible();
};
