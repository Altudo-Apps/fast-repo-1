import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import NavTabs from 'src/components/NavTabs';
import {
  ComponentParams,
  ComponentRendering,
  Field,
  SitecoreProvider,
} from '@sitecore-content-sdk/nextjs';
import { apiStub, mockPage } from './stubs';
import componentMap from '../../.sitecore/component-map';
import { canvasWithin, expect, resetStorageKeys, userEvent } from './testUtils';

type TabStoryProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: {
    id: string;
  };
};

const navTabEntries = [
  {
    uid: 'tab-1',
    componentName: 'NavTab',
    dataSource: '{11111111-1111-1111-1111-111111111111}',
    params: { DynamicPlaceholderId: 'tabcontent-1' },
    fields: {
      id: 'navtab-1',
      NavTabTitle: { value: 'Overview' } as Field<string>,
    },
    placeholders: {
      'navtabcontent-tabcontent-1': [
        {
          uid: 'tab-1-content',
          componentName: 'FLRichText',
          params: { styles: 'text-sm' },
          fields: {
            Text: {
              value:
                '<p>Use this space to highlight product value, adoption stats, or onboarding guidance.</p>',
            },
          },
        },
      ],
    },
  },
  {
    uid: 'tab-2',
    componentName: 'NavTab',
    dataSource: '{22222222-2222-2222-2222-222222222222}',
    params: { DynamicPlaceholderId: 'tabcontent-2' },
    fields: {
      id: 'navtab-2',
      NavTabTitle: { value: 'Integrations' } as Field<string>,
    },
    placeholders: {
      'navtabcontent-tabcontent-2': [
        {
          uid: 'tab-2-content',
          componentName: 'FLRichText',
          params: { styles: 'text-sm' },
          fields: {
            Text: {
              value:
                '<ul><li>Sitecore XM Cloud</li><li>Personalize</li><li>Search & Content</li></ul>',
            },
          },
        },
      ],
    },
  },
  {
    uid: 'tab-3',
    componentName: 'NavTab',
    dataSource: '{33333333-3333-3333-3333-333333333333}',
    params: { DynamicPlaceholderId: 'tabcontent-3' },
    fields: {
      id: 'navtab-3',
      NavTabTitle: { value: 'Support' } as Field<string>,
    },
    placeholders: {
      'navtabcontent-tabcontent-3': [
        {
          uid: 'tab-3-content',
          componentName: 'FLRichText',
          params: { styles: 'text-sm' },
          fields: {
            Text: {
              value:
                '<p>24/7 concierge with component documentation, authoring tips, and migration guides.</p>',
            },
          },
        },
      ],
    },
  },
];

const typedNavTabEntries = navTabEntries as unknown as ComponentRendering[];

const tabPlaceholders: Record<string, ComponentRendering[]> = {
  'navtab-{*}': typedNavTabEntries,
  'navtab-tabs': typedNavTabEntries,
};

const tabParams: ComponentParams = {
  DynamicPlaceholderId: 'tabs',
  styles: 'max-w-4xl mx-auto',
  RenderingIdentifier: 'storybook-navtabs',
};

const tabRendering: ComponentRendering & { params: ComponentParams } = {
  componentName: 'NavTabs',
  dataSource: '{33333333-3333-3333-3333-333333333333}',
  uid: 'storybook-navtabs-uid',
  params: tabParams,
  placeholders: tabPlaceholders,
};

const baseArgs: TabStoryProps = {
  rendering: tabRendering,
  params: tabParams,
  fields: {
    id: 'story-navtabs',
  },
};

const Template: StoryFn<TabStoryProps> = (args) => (
  <SitecoreProvider componentMap={componentMap} api={apiStub} page={mockPage}>
    <NavTabs {...args} />
  </SitecoreProvider>
);

const meta: Meta<typeof NavTabs> = {
  title: 'Components/NavTabs',
  component: NavTabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const Default = Template.bind({});
Default.args = baseArgs;
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=298-971&t=BsOOMRsPFkuNiXem-4',
  },
};

Default.play = async ({ canvasElement }) => {
  resetStorageKeys('active-tab');

  const canvas = canvasWithin(canvasElement);
  const tabs = await canvas.findAllByRole('tab');
  await userEvent.click(tabs[1]);

  await expect(tabs[1]).toHaveAttribute('aria-selected', 'true');

  await expect(canvas.getByText(/sitecore xm cloud/i)).toBeVisible();
};

export const RightAlignedTabs = Template.bind({});
RightAlignedTabs.args = {
  ...baseArgs,
  params: {
    ...tabParams,
    styles: 'max-w-4xl mx-auto text-right',
  },
};
