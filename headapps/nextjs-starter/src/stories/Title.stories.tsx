import React from 'react';
import { Default as Title } from '../components/sxa/Title';
import { Meta, StoryFn } from '@storybook/react';
import { SitecoreProvider, NextjsContentSdkComponent } from '@sitecore-content-sdk/nextjs';
import { apiStub, mockPage } from './stubs';
import { canvasWithin, expect } from './testUtils';

const componentFactory = new Map<string, NextjsContentSdkComponent>([['Title', Title]]);

export default {
  title: 'Components/Title',
  component: Title,
  tags: ['autodocs'],
  argTypes: {
    headingTag: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    figmaUrl: {
      control: 'text',
      description: 'URL to the Figma design for this component',
    },
  },
} as Meta;

const Template: StoryFn = (args) => {
  return (
    <SitecoreProvider componentMap={componentFactory} api={apiStub} page={mockPage}>
      <Title
        rendering={{
          componentName: 'Title',
          dataSource: '',
          uid: 'title-1',
          placeholders: {},
          params: {},
        }}
        params={{
          styles: `text-${args.headingTag} text-${args.color}`,
          figmaUrl: args.figmaUrl,
        }}
        fields={{
          data: {
            datasource: {
              url: { path: '#', siteName: 'Demo' },
              field: { jsonValue: { value: 'Sample Title' } },
            },
            contextItem: {
              url: { path: '#', siteName: 'Demo' },
              field: { jsonValue: { value: 'Sample Title' } },
            },
          },
        }}
      />
    </SitecoreProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  headingTag: 'h1',
  color: 'primary',
  figmaUrl:
    'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=177-2570&p=f&t=Vc3qd11g1zwPq73Y-0',
};
Default.parameters = {
  design: {
    type: 'figma',
    url: Default.args.figmaUrl,
  },
};

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);
  const headingLink = await canvas.findByRole('link', { name: /sample title/i });
  await expect(headingLink).toHaveAttribute('href', '/#');
};
