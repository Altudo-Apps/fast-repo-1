import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';
import { Default as LinkListDefault } from '../components/sxa/LinkList';
import { apiStub, mockPage } from './stubs';
import componentMap from '../../.sitecore/component-map';
import { canvasWithin, expect } from './testUtils';

const meta = {
  title: 'Components/LinkList',
  component: LinkListDefault,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  argTypes: {
    level: {
      control: 'select',
      options: ['one', 'two'],
      description: 'Controls the style level of the link list',
      table: {
        category: 'Styling',
      },
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
} satisfies Meta<typeof LinkListDefault>;

export default meta;

const Template: StoryFn = (args) => (
  <LinkListDefault
    rendering={{
      componentName: 'LinkList',
      dataSource: '',
      uid: 'link-list-1',
      placeholders: {},
      params: {},
    }}
    params={{
      Level: args.level || 'one',
      RenderingIdentifier: 'link-list-1',
      id: 'link-list-1',
      styles: '',
    }}
    fields={{
      data: {
        datasource: {
          children: {
            results: [
              {
                field: {
                  link: {
                    value: {
                      href: 'https://www.example.com/1',
                      text: 'First Link',
                      target: '_blank',
                    },
                  },
                },
              },
              {
                field: {
                  link: {
                    value: {
                      href: 'https://www.example.com/2',
                      text: 'Second Link',
                      target: '_self',
                    },
                  },
                },
              },
              {
                field: {
                  link: {
                    value: {
                      href: 'https://www.example.com/3',
                      text: 'Third Link',
                      target: '_blank',
                    },
                  },
                },
              },
            ],
          },
          field: {
            title: {
              value: 'Featured Links',
            },
          },
        },
      },
    }}
  />
);

export const DefaultStory = Template.bind({});
DefaultStory.args = {
  level: 'one',
  figmaUrl:
    'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=66-1555&p=f&t=qcJyLF5xZpLACTft-0',
};

DefaultStory.parameters = {
  design: {
    type: 'figma',
    url: DefaultStory.args.figmaUrl,
  },
};

DefaultStory.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);
  const heading = await canvas.findByRole('heading', { name: /featured links/i });
  await expect(heading).toBeVisible();

  const links = canvas.getAllByRole('link');
  await expect(links).toHaveLength(3);
};
