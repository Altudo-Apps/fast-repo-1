import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Default as Promo } from '../components/sxa/Promo';
import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { SitecoreProvider, NextjsContentSdkComponent } from '@sitecore-content-sdk/nextjs';
import { apiStub, mockPage } from './stubs';
import { canvasWithin, expect } from './testUtils';

const componentFactory = new Map<string, NextjsContentSdkComponent>([['Promo', Promo]]);

export default {
  title: 'Components/Promo',
  component: Promo,
  tags: ['autodocs'],
  argTypes: {
    promoIconSrc: {
      control: 'text',
    },
    promoText: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'],
    },
    promoLinkHref: {
      control: 'text',
    },
    promoLinkText: {
      control: 'text',
    },
    promoText2: {
      control: 'text',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
    },
    width: {
      control: 'number',
    },
    height: {
      control: 'number',
    },
    figmaUrl: {
      control: 'text',
      description: 'Figma design URL for this component',
    },
  },
} as Meta;

const Template: StoryFn = (args) => {
  return (
    <SitecoreProvider componentMap={componentFactory} api={apiStub} page={mockPage}>
      <div>
        <Promo
          rendering={{
            componentName: 'Promo',
            dataSource: '',
            uid: 'promo-1',
            placeholders: {},
            params: {},
          }}
          params={{ styles: `text-${args.color} text-${args.promoText}` }}
          fields={{
            PromoIcon: {
              value: { src: args.promoIconSrc, alt: '', width: args.width, height: args.height },
            } as ImageField,
            PromoText: { value: 'Promo Title' } as Field<string>,
            PromoLink: {
              value: { href: args.promoLinkHref, text: args.promoLinkText },
            } as LinkField,
            PromoText2: { value: args.promoText2 } as Field<string>,
          }}
        />
      </div>
    </SitecoreProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  promoIconSrc: 'https://picsum.photos/200',
  promoText: 'h1',
  promoLinkHref: '#',
  promoLinkText: 'learn more',
  promoText2: 'Additional promo text.',
  color: 'primary',
  width: 150,
  height: 150,
  figmaUrl:
    'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=59-429&t=Vc3qd11g1zwPq73Y-4',
};

export const Custom = Template.bind({});
Custom.args = {
  promoIconSrc: 'https://picsum.photos/200',
  promoText: 'This is custom promo text with different styles.',
  promoLinkHref: '#',
  promoLinkText: 'Discover more',
  promoText2: 'Additional custom promo text.',
  color: 'secondary',
  width: 250,
  height: 150,
  figmaUrl:
    'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=59-429&t=Vc3qd11g1zwPq73Y-4',
};

export const EditingMode = Template.bind({});
EditingMode.args = {
  promoIconSrc: 'https://picsum.photos/200',
  promoText: 'This is promo text in editing mode.',
  promoLinkHref: '#',
  promoLinkText: 'Find out more',
  promoText2: 'Additional promo text in editing mode.',
  color: 'tertiary',
  width: 320,
  height: 240,
  sitecore: {
    pageEditing: true,
  },
  figmaUrl:
    'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=59-429&t=Vc3qd11g1zwPq73Y-4',
};

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);
  const title = await canvas.findByText(/promo title/i);
  await expect(title).toBeVisible();

  const learnMoreLink = canvas.getByRole('link', { name: /learn more/i });
  await expect(learnMoreLink).toHaveAttribute('href', '/#');
};
