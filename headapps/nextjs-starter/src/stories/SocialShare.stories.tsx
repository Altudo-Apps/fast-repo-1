import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';
import { Default as SocialShare } from 'src/components/SocialShare';
import type { SocialShareProps } from 'src/types/SocialShare.types';
import { apiStub, mockPage } from './stubs';
import componentMap from '../../.sitecore/component-map';
import { canvasWithin, expect } from './testUtils';

type SocialShareStoryArgs = SocialShareProps;

const meta = {
  title: 'Components/SocialShare',
  component: SocialShare,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  decorators: [
    (Story, context) => (
      <SitecoreProvider api={apiStub} page={mockPage} componentMap={componentMap}>
        <div style={{ padding: 20, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
          <Story {...context.args} />
        </div>
      </SitecoreProvider>
    ),
  ],
} satisfies Meta<typeof SocialShare>;

export default meta;

const Template: StoryFn<SocialShareStoryArgs> = (args) => <SocialShare {...args} />;

export const Default = Template.bind({});
Default.args = {
  params: {
    RenderingIdentifier: 'social-share-1',
    styles: 'bg-white text-black',
  },
  fields: {
    items: [
      {
        id: '28defd8b-b321-4e60-922c-219bef3ffbbf',
        url: '/Data/SocialShareSection/Facebook',
        name: 'Facebook',
        displayName: 'Facebook',
        fields: {
          Title: {
            value: 'Facebook',
          },
          SocialIcon: {
            value: {
              src: 'https://ik.imagekit.io/8dh6o9i84u/icons/facebook.png',
              alt: 'facebook',
              width: '48',
              height: '48',
            },
          },
        },
      },
      {
        id: 'e8e1b190-1248-4dda-8972-a5cb121edb54',
        url: '/Data/SocialShareSection/LinkedIn',
        name: 'LinkedIn',
        displayName: 'LinkedIn',
        fields: {
          Title: {
            value: 'LinkedIn',
          },
          SocialIcon: {
            value: {
              src: 'https://ik.imagekit.io/8dh6o9i84u/icons/linkedin.png',
              alt: 'linkedin',
              width: '48',
              height: '48',
            },
          },
        },
      },
      {
        id: 'f564eed4-3ec1-4f11-908c-f0370b6e5735',
        url: '/Data/SocialShareSection/X',
        name: 'X',
        displayName: 'X',
        fields: {
          Title: {
            value: 'X',
          },
          SocialIcon: {
            value: {
              src: 'https://ik.imagekit.io/8dh6o9i84u/icons/twitter.png',
              alt: 'X',
              width: '50',
              height: '50',
            },
          },
        },
      },
      {
        id: '1f965a7f-5ecc-49d4-8bac-6e0c9f9ce592',
        url: '/Data/SocialShareSection/Pinterest',
        name: 'Pinterest',
        displayName: 'Pinterest',
        fields: {
          Title: {
            value: 'Pinterest',
          },
          SocialIcon: {
            value: {
              src: 'https://ik.imagekit.io/8dh6o9i84u/icons/pinterest.png',
              alt: 'pinterest',
              width: '48',
              height: '48',
            },
          },
        },
      },
      {
        id: '2f965a7f-5ecc-49d4-8bac-6e0c9f9ce593',
        url: '/Data/SocialShareSection/Email',
        name: 'Email',
        displayName: 'Email',
        fields: {
          Title: {
            value: 'Email',
          },
          SocialIcon: {
            value: {
              src: 'https://ik.imagekit.io/8dh6o9i84u/icons/email.webp',
              alt: 'Email',
              width: '48',
              height: '48',
            },
          },
        },
      },
    ],
  },
};
Default.parameters = {
  design: {
    type: 'figma',
    url: 'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=298-1139&p=f&t=GtWPlNf2ZrPy8Crk-0',
  },
};

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);
  const facebookButton = await canvas.findByRole('button', { name: /facebook/i });
  await expect(facebookButton).toBeVisible();

  const buttons = canvas.getAllByRole('button');
  await expect(buttons.length).toBeGreaterThanOrEqual(4);
};
