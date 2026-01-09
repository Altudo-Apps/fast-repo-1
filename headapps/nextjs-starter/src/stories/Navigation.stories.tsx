import React, { useEffect } from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import MegaNavItem from 'src/components/MegaNavItem';
import {
  ComponentParams,
  ComponentRendering,
  Field,
  NextjsContentSdkComponent,
  SitecoreProvider,
} from '@sitecore-content-sdk/nextjs';
import { Default as FLRichText } from 'src/components/FLRichText';
import { apiStub, mockPage } from './stubs';
import { canvasWithin, expect } from './testUtils';

type StoryProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: {
    id: string;
    NavTabTitle: Field<string>;
  };
};

const componentFactory = new Map<string, NextjsContentSdkComponent>([['FLRichText', FLRichText]]);

const placeholderEntries: ComponentRendering[] = [
  {
    uid: 'meganav-richtext-1',
    componentName: 'FLRichText',
    params: { styles: 'text-sm text-muted-foreground space-y-3' },
    fields: {
      Text: {
        value:
          '<h3 class="text-primary text-base font-semibold mb-2">Featured Resources</h3><p>Explore component variations, authoring tips, and performance guides to make the most of the FastLane accelerator.</p>',
      },
    },
  },
  {
    uid: 'meganav-richtext-2',
    componentName: 'FLRichText',
    params: { styles: 'text-sm text-muted-foreground space-y-2' },
    fields: {
      Text: {
        value:
          '<ul class="space-y-1"><li><a href="/components" class="underline">Component Library</a></li><li><a href="/docs" class="underline">Developer Docs</a></li><li><a href="/support" class="underline">Support Center</a></li></ul>',
      },
    },
  },
];

const params: ComponentParams = {
  DynamicPlaceholderId: 'nav',
  styles: '',
  Styles: '',
  RenderingIdentifier: 'storybook-meganav',
};

const rendering: ComponentRendering & { params: ComponentParams } = {
  componentName: 'MegaNavItem',
  dataSource: '{22222222-2222-2222-2222-222222222222}',
  uid: 'storybook-meganav-uid',
  params,
  placeholders: {
    'meganavcontent-nav': placeholderEntries,
  },
};

const baseArgs: StoryProps = {
  rendering,
  params,
  fields: {
    id: 'navigation-item-1',
    NavTabTitle: { value: 'Resources' },
  },
};

const Template: StoryFn<StoryProps> = (args: StoryProps) => {
  useEffect(() => {
    localStorage.setItem('active-menu-item', args.rendering.uid ?? '');
    return () => localStorage.removeItem('active-menu-item');
  }, [args.rendering.uid]);

  return (
    <SitecoreProvider componentMap={componentFactory} api={apiStub} page={mockPage}>
      <div className="bg-slate-50 p-6 min-h-[400px] w-full max-w-4xl mx-auto">
        <MegaNavItem {...args} />
      </div>
    </SitecoreProvider>
  );
};

const meta: Meta<typeof MegaNavItem> = {
  title: 'Components/MegaNavItem',
  component: MegaNavItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    params: { control: 'object' },
    fields: { control: 'object' },
  },
};

export default meta;

export const Default = Template.bind({});
Default.args = baseArgs;
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=221-3604&t=UMEjrtOKmNdHlXif-4',
  },
};

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);
  const heading = await canvas.findByRole('heading', { name: /featured resources/i });
  await expect(heading).toBeVisible();

  const linksList = canvas.getAllByRole('link');
  await expect(
    linksList.some((link: HTMLElement) => /component library/i.test(link.textContent ?? ''))
  ).toBe(true);
};
