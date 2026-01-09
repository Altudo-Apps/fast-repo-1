import type { Meta, StoryFn } from '@storybook/react';

import { Default as FLRichText } from 'src/components/FLRichText';

import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';

import componentMap from '../../.sitecore/component-map';

import { apiStub, mockPage } from './stubs';

import { canvasWithin, expect } from './testUtils';

const meta: Meta<typeof FLRichText> = {
  title: 'Components/FL/FLRichText',

  component: FLRichText,

  tags: ['autodocs'],
};

export default meta;

const Template: StoryFn<typeof FLRichText> = (args) => (
  <SitecoreProvider componentMap={componentMap} api={apiStub} page={mockPage}>
    <FLRichText {...args} />
  </SitecoreProvider>
);

export const Default = Template.bind({});

Default.args = {
  params: {
    RenderingIdentifier: 'fl-rich-text-demo',

    styles: 'max-w-2xl prose prose-slate dark:prose-invert bg-white p-6 rounded-lg shadow-sm',
  },

  fields: {
    Text: {
      value:
        '<h3>FastLane FLRichText</h3><p>This story renders the FLRichText component inside a SitecoreProvider so tokens, placeholders, and editing state behave just like XM Cloud. You can update the markup via controls to see typography styles update live.</p><ul><li>Semantic headings</li><li>Links, lists, and emphasis</li><li>Dark mode friendly</li></ul>',
    },
  },
};

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);

  const heading = await canvas.findByRole('heading', { name: /fastlane flrichtext/i });

  await expect(heading).toBeVisible();

  await expect(canvas.getByText(/dark mode friendly/i)).toBeVisible();
};
