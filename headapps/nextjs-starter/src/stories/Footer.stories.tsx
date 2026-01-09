import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Footer as FooterComponent } from 'src/components/FLContainer';
import { Default as FLRichText } from 'src/components/FLRichText';
import {
  ComponentParams,
  ComponentRendering,
  NextjsContentSdkComponent,
  SitecoreProvider,
} from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import { apiStub, mockPage } from './stubs';
import { canvasWithin, expect } from './testUtils';

type FooterStoryProps = ComponentProps;

const componentFactory = new Map<string, NextjsContentSdkComponent>([['FLRichText', FLRichText]]);

const footerParams: ComponentParams = {
  DynamicPlaceholderId: 'footer',
  GridParameters: 'container mx-auto',
  Styles: 'bg-slate-900 text-white py-12',
  styles: 'bg-slate-900 text-white py-12',
  RenderingIdentifier: 'storybook-footer',
};

const footerPlaceholderItems = [
  {
    uid: 'footer-col-1',
    componentName: 'FLRichText',
    params: { styles: 'text-sm text-white/80 max-w-xs' },
    fields: {
      Text: {
        value:
          '<h3 class="text-base font-semibold text-white mb-3">About Us</h3><p>Altudo FastLane enables Sitecore XM Cloud builds with a rich component library and authoring tooling.</p>',
      },
    },
  },
  {
    uid: 'footer-col-2',
    componentName: 'FLRichText',
    params: { styles: 'text-sm text-white/80 max-w-xs' },
    fields: {
      Text: {
        value:
          '<h3 class="text-base font-semibold text-white mb-3">Resources</h3><ul class="space-y-2"><li><a href="/components" class="underline">Components</a></li><li><a href="/docs" class="underline">Docs</a></li><li><a href="/support" class="underline">Support</a></li></ul>',
      },
    },
  },
  {
    uid: 'footer-col-3',
    componentName: 'FLRichText',
    params: { styles: 'text-sm text-white/80 max-w-xs' },
    fields: {
      Text: {
        value:
          '<h3 class="text-base font-semibold text-white mb-3">Contact</h3><p>1234 Cloud Drive<br/>Chicago, IL<br/>support@altudo.com</p>',
      },
    },
  },
] as ComponentRendering[];

const footerRendering: ComponentRendering & { params: ComponentParams } = {
  componentName: 'Footer',
  dataSource: '{00000000-0000-0000-0000-000000000000}',
  uid: 'storybook-footer-rendering',
  params: footerParams,
  placeholders: {
    'container-footer': footerPlaceholderItems,
  },
};

const baseFooterArgs: FooterStoryProps = {
  rendering: footerRendering,
  params: footerParams,
};

const Template: StoryFn<FooterStoryProps> = (args) => (
  <SitecoreProvider componentMap={componentFactory} api={apiStub} page={mockPage}>
    <FooterComponent {...args} />
  </SitecoreProvider>
);

const meta: Meta<typeof FooterComponent> = {
  title: 'Components/Footer',
  component: FooterComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;

export const Default = Template.bind({});
Default.args = baseFooterArgs;
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=66-1593&t=Sy6eJEw6npM1ik1O-4',
  },
};

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);

  await expect(canvas.getByRole('heading', { name: /about us/i })).toBeVisible();
  await expect(canvas.getByRole('heading', { name: /resources/i })).toBeVisible();
  await expect(canvas.getByRole('heading', { name: /contact/i })).toBeVisible();
  await expect(canvas.getByText(/support@altudo\.com/i)).toBeVisible();
};
