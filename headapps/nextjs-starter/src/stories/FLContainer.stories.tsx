import type { Meta, StoryFn } from '@storybook/react';

import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';

import { Default as FLContainer } from 'src/components/FLContainer';

import type { ComponentRendering } from '@sitecore-content-sdk/nextjs';

import componentMap from '../../.sitecore/component-map';

import { apiStub, mockPage } from './stubs';

import { canvasWithin, expect } from './testUtils';

const containerParams = {
  DynamicPlaceholderId: 'main',

  GridParameters: 'container mx-auto',

  Styles: 'bg-slate-50 border border-slate-200 rounded-2xl shadow-sm',

  RenderingIdentifier: 'storybook-flcontainer',
};

const makeContainerRendering = (children: ComponentRendering[], idSuffix: string) => ({
  componentName: 'FLContainer',

  dataSource: `{00000000-0000-0000-0000-00000000000${idSuffix}}`,

  uid: `storybook-flcontainer-rendering-${idSuffix}`,

  params: containerParams,

  placeholders: {
    'container-main': children,
  },
});

const meta: Meta<typeof FLContainer> = {
  title: 'Components/FL/FLContainer',

  component: FLContainer,

  tags: ['autodocs'],
};

export default meta;

const Template: StoryFn<typeof FLContainer> = (args) => (
  <SitecoreProvider componentMap={componentMap} api={apiStub} page={mockPage}>
    <FLContainer {...args} />
  </SitecoreProvider>
);

export const Default = Template.bind({});

Default.args = {
  rendering: makeContainerRendering(
    [
      {
        uid: 'flcontainer-richtext',

        componentName: 'FLRichText',

        params: { styles: 'prose max-w-none' },

        fields: {
          Text: {
            value:
              '<h2>Container placeholder</h2><p>This FLContainer story renders its placeholder contents using the same SitecoreProvider configuration we use in production. Swap the placeholder children to preview different compositions.</p>',
          },
        },
      },
    ],

    '1'
  ),

  params: containerParams,
};

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);

  await expect(canvas.getByRole('heading', { name: /container placeholder/i })).toBeVisible();
};

const COLUMN_WIDTH_MAP: Record<number, string> = {
  2: 'w-full md:w-1/2',

  3: 'w-full md:w-1/3',

  4: 'w-full md:w-1/4',
};

const buildColumnSplitter = (columns: number) => ({
  uid: `column-splitter-${columns}`,

  componentName: 'ColumnSplitter',

  params: {
    EnabledPlaceholders: Array.from({ length: columns }, (_, i) => `${i + 1}`).join(','),

    RenderingIdentifier: `column-splitter-${columns}`,

    styles: 'bg-white rounded-2xl shadow-sm p-4',

    ...Object.fromEntries(
      Array.from({ length: columns }, (_, i) => [
        `ColumnWidth${i + 1}`,

        COLUMN_WIDTH_MAP[columns] ?? 'w-full',
      ])
    ),
  },

  placeholders: Object.fromEntries(
    Array.from({ length: columns }, (_, i) => [
      `column-${i + 1}-{*}`,

      [
        {
          uid: `col-${columns}-${i + 1}-content`,

          componentName: 'FLRichText',

          params: { styles: 'prose max-w-none' },

          fields: {
            Text: { value: `<h3>Column ${i + 1}</h3><p>Content for column ${i + 1}.</p>` },
          },
        },
      ],
    ])
  ),
});

const columnVariants = {
  twoColumns: buildColumnSplitter(2),

  threeColumns: buildColumnSplitter(3),

  fourColumns: buildColumnSplitter(4),
};

export const TwoColumns = Template.bind({});

TwoColumns.args = {
  rendering: makeContainerRendering([columnVariants.twoColumns], '2'),

  params: containerParams,
};

TwoColumns.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);

  await expect(canvas.getByRole('heading', { name: /column 1/i })).toBeVisible();

  await expect(canvas.getByRole('heading', { name: /column 2/i })).toBeVisible();
};

export const ThreeColumns = Template.bind({});

ThreeColumns.args = {
  rendering: makeContainerRendering([columnVariants.threeColumns], '3'),

  params: containerParams,
};

export const FourColumns = Template.bind({});

FourColumns.args = {
  rendering: makeContainerRendering([columnVariants.fourColumns], '4'),

  params: containerParams,
};

ThreeColumns.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);

  await expect(canvas.getByRole('heading', { name: /column 3/i })).toBeVisible();
};

FourColumns.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);

  await expect(canvas.getByRole('heading', { name: /column 4/i })).toBeVisible();
};
