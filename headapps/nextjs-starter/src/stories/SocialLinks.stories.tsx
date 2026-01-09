import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { SitecoreProvider, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { Default as SocialLinks } from 'src/components/SocialLinks';
import { apiStub, mockPage } from './stubs';
import componentMap from '../../.sitecore/component-map';
import { canvasWithin, expect } from './testUtils';

type StoryArgs = {
  styles?: string;
};

const meta = {
  title: 'Components/SocialLinks',
  component: SocialLinks,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  argTypes: {},
  decorators: [
    (Story, context) => (
      <SitecoreProvider api={apiStub} page={mockPage} componentMap={componentMap}>
        <div style={{ padding: 20, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
          <Story {...context.args} />
        </div>
      </SitecoreProvider>
    ),
  ],
} satisfies Meta<typeof SocialLinks>;

export default meta;

const socialImage = (url: string): ImageField => ({
  value: {
    src: url,
    alt: 'Social icon',
    width: '48',
    height: '48',
  },
});

const socialLink = (href: string, text: string): LinkField => ({
  value: {
    href,
    text,
    target: '_blank',
    linktype: 'external',
  },
});

const Template: StoryFn<StoryArgs> = (args) => (
  <SocialLinks
    rendering={{
      componentName: 'SocialLinks',
      dataSource: '{00000000-0000-0000-0000-000000000001}',
      uid: 'story-social-links',
      params: {},
      placeholders: {},
    }}
    params={{
      RenderingIdentifier: 'story-social-links',
      styles: args.styles ?? 'justify-center',
    }}
    fields={{
      items: [
        {
          fields: {
            SocialIcon: socialImage('https://s.magecdn.com/social/64w/tc-x.png'),
            SocialLink: socialLink('https://x.com', 'X'),
          },
        },
        {
          fields: {
            SocialIcon: socialImage('https://s.magecdn.com/social/64w/tc-facebook.png'),
            SocialLink: socialLink('https://facebook.com', 'Facebook'),
          },
        },
        {
          fields: {
            SocialIcon: socialImage('https://s.magecdn.com/social/64w/tc-linkedin.png'),
            SocialLink: socialLink('https://linkedin.com', 'LinkedIn'),
          },
        },
      ],
    }}
  />
);

export const DefaultStory = Template.bind({});
DefaultStory.args = {
  styles: 'justify-center gap-4',
};

DefaultStory.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=66-1555&t=UMEjrtOKmNdHlXif-4',
  },
};

DefaultStory.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);
  const links = await canvas.findAllByRole('link');
  await expect(links).toHaveLength(3);

  await expect(links[0]).toHaveAttribute('href', 'https://x.com');
  await expect(links[1]).toHaveAttribute('href', 'https://facebook.com');
  await expect(links[2]).toHaveAttribute('href', 'https://linkedin.com');
};
