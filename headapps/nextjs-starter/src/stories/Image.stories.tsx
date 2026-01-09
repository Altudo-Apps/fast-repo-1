import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Default, ImageProps } from '../components/sxa/Image';
import { SitecoreProvider, NextjsContentSdkComponent } from '@sitecore-content-sdk/nextjs';
import { apiStub, mockPage } from './stubs';
import { canvasWithin, expect } from './testUtils';

const componentFactory = new Map<string, NextjsContentSdkComponent>([['Image', Default]]);

interface StorybookArgs extends Partial<ImageProps> {
  headingTag?: string;
  color?: string;
  variant?: string;
  figmaUrl?: string;
}

const mockFields = {
  Image: {
    src: 'https://picsum.photos/200',
    alt: 'Sample Image',
    width: 150,
    height: 150,
    value: {
      src: 'https://picsum.photos/200',
      alt: 'Sample Image',
      width: 150,
      height: 150,
    },
  },
  TargetUrl: {
    value: {
      href: 'https://example.com',
      text: 'Visit Link',
    },
  },
  ImageCaption: {
    value: 'This is an image caption',
  },
};

export default {
  title: 'Components/Image',
  component: Default,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
    layout: 'padded',
  },
  argTypes: {
    headingTag: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
    variant: {
      control: 'select',
      options: ['default', 'rounded', 'shadow'], // Add more variants if needed
    },
    figmaUrl: {
      control: 'text',
      description: 'Figma Design URL',
      table: {
        category: 'Design',
      },
    },
    params: {
      styles: 'default-style',
    },
  },
} as Meta<typeof Default>;

const Template: StoryFn<StorybookArgs> = (args) => {
  const { rendering, ...restArgs } = args;
  const fields = {
    Image: args?.fields?.Image || { value: { src: '', alt: '', width: 0, height: 0 } },
    ImageCaption: {
      value: args?.fields?.ImageCaption?.value || '',
      editable: args?.fields?.ImageCaption?.value || '',
    },
    TargetUrl: args?.fields?.TargetUrl || { value: { href: '' }, editable: '' },
  };

  return (
    <SitecoreProvider componentMap={componentFactory} api={apiStub} page={mockPage}>
      <Default
        {...restArgs}
        rendering={rendering || { componentName: 'Image', placeholders: {}, fields: {} }}
        params={{
          ...restArgs?.params,
          styles: `text-${restArgs?.headingTag} text-${restArgs?.color} ${restArgs?.variant}`,
        }}
        fields={fields}
      />
    </SitecoreProvider>
  );
};

export const Base = Template.bind({});
Base.args = {
  headingTag: 'h3',
  color: 'primary',
  variant: 'default', // Default variant
  figmaUrl:
    'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=59-589&t=YzwVcZ9bEClPPSBD-0',
  params: {
    RenderingIdentifier: 'image-default',
  },
  fields: mockFields,
};

Base.parameters = {
  design: {
    type: 'figma',
    url: Base.args.figmaUrl,
  },
};

Base.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);

  const renderedImage = await canvas.findByRole('img', { name: /sample image/i });
  await expect(renderedImage).toHaveAttribute('src', expect.stringContaining('picsum'));

  const linkWrapper = renderedImage.closest('a');
  expect(linkWrapper).not.toBeNull();
  await expect(linkWrapper as HTMLAnchorElement).toHaveAttribute('href', 'https://example.com');
};
