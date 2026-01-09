import type { Meta, StoryFn } from '@storybook/react';

import { SitecoreProvider, type LinkField } from '@sitecore-content-sdk/nextjs';

import { Default as FLLinkList } from 'src/components/FLLinkList';

import componentMap from '../../.sitecore/component-map';

import { apiStub, mockPage } from './stubs';

import { canvasWithin, expect } from './testUtils';

const buildLink = (href: string, text: string): LinkField => ({
  value: {
    href,

    text,

    title: text,

    linktype: href.startsWith('http') ? 'external' : 'internal',

    target: href.startsWith('http') ? '_blank' : '',
  },
});

const listFields = {
  data: {
    datasource: {
      field: {
        title: { value: 'Helpful Resources' },
      },

      children: {
        results: [
          { field: { link: buildLink('https://www.sitecore.com', 'Sitecore.com') } },

          { field: { link: buildLink('https://developers.sitecore.com', 'Developer Portal') } },

          { field: { link: buildLink('/components', 'Component Library') } },
        ],
      },
    },
  },
};

const meta: Meta<typeof FLLinkList> = {
  title: 'Components/FL/FLLinkList',

  component: FLLinkList,

  tags: ['autodocs'],
};

export default meta;

const Template: StoryFn<typeof FLLinkList> = (args) => (
  <SitecoreProvider componentMap={componentMap} api={apiStub} page={mockPage}>
    <FLLinkList {...args} />
  </SitecoreProvider>
);

export const Default = Template.bind({});

Default.args = {
  params: {
    RenderingIdentifier: 'fl-link-list',

    styles: 'max-w-2xl bg-white p-6 rounded-lg shadow-sm',
  },

  fields: listFields,
};

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);

  await expect(canvas.getByRole('heading', { name: /helpful resources/i })).toBeVisible();

  const link = canvas.getByRole('link', { name: /sitecore.com/i });

  await expect(link).toHaveAttribute('href', 'https://www.sitecore.com');
};
