import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { Default as ContentCard } from '../../src/components/ContentCard';
import { ContentCardFields } from 'src/core/molecules/ContentCard/ContentCard.type';
import { SitecoreProvider, NextjsContentSdkComponent } from '@sitecore-content-sdk/nextjs';
import { apiStub, mockPage } from './stubs';
import { canvasWithin, expect } from './testUtils';

const componentFactory = new Map<string, NextjsContentSdkComponent>([['ContentCard', ContentCard]]);

// Extend ContentCardFields with Storybook-specific props
interface StoryProps extends ContentCardFields {
  CardOrientation?: 'horizontal' | 'vertical' | 'horizontalflex';
  ShowDescription?: boolean;
  ShowImageOnRight?: boolean;
  GridParameters?: string;
  LinkType?: 'Card' | 'Link' | 'Button';
  figmaUrl?: string;
}

export default {
  title: 'Components/ContentCard',
  component: ContentCard,
  tags: ['autodocs'],
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
  argTypes: {
    CardOrientation: {
      control: 'select',
      options: ['horizontal', 'vertical', 'horizontalflex'] as const,
      description: 'Controls the orientation of the content card',
      defaultValue: 'horizontal',
      table: {
        category: 'Layout',
      },
    },
    ShowDescription: {
      control: 'boolean',
      description: 'Toggle description visibility',
      defaultValue: true,
      table: {
        category: 'Content',
      },
    },
    ShowImageOnRight: {
      control: 'boolean',
      description: 'Toggle image position (left/right)',
      defaultValue: false,
      table: {
        category: 'Layout',
      },
    },
    GridParameters: {
      control: 'text',
      description: 'Controls the grid layout parameters',
      defaultValue: 'xl:basis-1/2 2xl:basis-1/2',
      table: {
        category: 'Layout',
      },
    },
    LinkType: {
      control: 'select',
      options: ['Link', 'Button', 'Card'],
      description: 'Determines CTA rendering style',
      table: {
        category: 'Content',
      },
    },
    figmaUrl: {
      control: 'text',
      description: 'Figma Design URL',
      table: {
        category: 'Design',
      },
    },
  },
} as Meta<StoryProps>;

const Template: StoryFn<StoryProps> = (args) => {
  const {
    CardOrientation,
    ShowDescription,
    ShowImageOnRight,
    GridParameters,
    LinkType,
    ...storyArgs
  } = args;

  const description = {
    Description: ShowDescription
      ? {
          value:
            '<p><span style="color: rgb(100, 107, 107); background-color: rgb(255, 255, 255);">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </span></p>',
        }
      : { value: '' },
  };

  const imageOrder = ShowImageOnRight ? 'right' : 'left';

  const componentParams = {
    CTAButton: '1',
    CardOrientation: CardOrientation || 'horizontal',
    ImageOrder: imageOrder,
    GridParameters: GridParameters || 'xl:basis-1/2 2xl:basis-1/2',
    LinkType: LinkType || 'Link',
    DynamicPlaceholderId: '5',
    FieldNames: 'Default',
    styles: GridParameters || 'xl:basis-1/2 2xl:basis-1/2',
  };

  return (
    <SitecoreProvider componentMap={componentFactory} api={apiStub} page={mockPage}>
      <ContentCard
        {...storyArgs}
        rendering={{
          uid: '340653a2-627c-462d-923f-c12585792c2d',
          componentName: 'ContentCard',
          dataSource: '{4F15BF38-351D-4539-8D3A-E84BB3DC2F4C}',
          params: componentParams,
        }}
        params={componentParams}
        fields={{
          ...description,
          Image: {
            value: {
              src: 'https://images.unsplash.com/photo-1512289984044-071903207f5e',
              alt: 'industries-energy',
              width: '1200',
              height: '675',
            },
          },
          CalltoActionLinkMain: {
            value: {
              href: 'https://www.altudo.co',
              text: 'Learn More',
              linktype: 'external',
              url: 'https://www.altudo.co',
              anchor: '',
              title: 'Learn More',
              target: '',
            },
          },
          Category: {
            value: 'Technology',
          },
          Title: {
            value: 'Lorem ipsum dolor sit amzet',
          },
        }}
      />
    </SitecoreProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  CardOrientation: 'horizontal',
  ShowDescription: true,
  ShowImageOnRight: false,
  GridParameters: 'xl:basis-1/2 2xl:basis-1/2',
  LinkType: 'Link',
  figmaUrl:
    'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=59-589&p=f&t=YzwVcZ9bEClPPSBD-0',
};
Default.parameters = {
  design: {
    type: 'figma',
    url: Default.args.figmaUrl,
  },
};

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);
  const heading = await canvas.findByRole('heading', { name: /lorem ipsum dolor/i });
  await expect(heading).toBeVisible();

  const cta = canvas.getByRole('link', { name: /learn more/i });
  await expect(cta).toHaveAttribute('href', expect.stringContaining('altudo.co'));
};

export const Vertical = Template.bind({});
Vertical.args = {
  CardOrientation: 'vertical',
  ShowDescription: true,
  ShowImageOnRight: false,
  GridParameters: 'xl:basis-1/2 2xl:basis-1/2',
  figmaUrl:
    'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=2448-1005&t=UMEjrtOKmNdHlXif-4',
};
Vertical.parameters = {
  design: {
    type: 'figma',
    url: Vertical.args.figmaUrl,
  },
};

export const ImageRight = Template.bind({});
ImageRight.args = {
  CardOrientation: 'horizontal',
  ShowDescription: true,
  ShowImageOnRight: true,
  GridParameters: 'xl:basis-1/2 2xl:basis-1/2',
  figmaUrl:
    'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=109-648&t=UMEjrtOKmNdHlXif-4',
};
ImageRight.parameters = {
  design: {
    type: 'figma',
    url: ImageRight.args.figmaUrl,
  },
};

export const HorizontalFlex = Template.bind({});
HorizontalFlex.args = {
  CardOrientation: 'horizontalflex',
  ShowDescription: true,
  ShowImageOnRight: false,
  GridParameters: 'xl:basis-1/2 2xl:basis-1/2',
  figmaUrl:
    'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=59-589&p=f&t=YzwVcZ9bEClPPSBD-0',
};
HorizontalFlex.parameters = {
  design: {
    type: 'figma',
    url: HorizontalFlex.args.figmaUrl,
  },
};
