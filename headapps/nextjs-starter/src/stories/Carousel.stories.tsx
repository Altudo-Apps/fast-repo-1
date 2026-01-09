import type { StoryObj } from '@storybook/react';
import React from 'react';
import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';
import { Default as Carousel } from 'src/components/Carousel';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import componentMap from '../../.sitecore/component-map';
import { apiStub, mockPage } from './stubs';

const buildSlide = (
  uid: string,
  title: string,
  body: string,
  bgColor = 'from-indigo-600 to-fuchsia-500'
) => ({
  uid,
  componentName: 'FLRichText',
  dataSource: `{${uid.toUpperCase()}}`,
  params: {
    styles: `!block w-full bg-gradient-to-r ${bgColor} text-white h-[360px]`,
  },
  fields: {
    Text: {
      value: `<div class="h-full flex items-center justify-center"><div class="max-w-xs px-4 text-center"><h2 class="text-xl font-bold mb-3 text-white">${title}</h2><p class="text-sm text-white/90">${body}</p></div></div>`,
    },
  },
});

const defaultSlides = [
  buildSlide(
    'slide-1',
    'Composable experiences',
    'Blend XM Cloud components and custom placeholders inside slick slides.',
    'from-indigo-600 to-fuchsia-500'
  ),
  buildSlide(
    'slide-2',
    'Storybook ready',
    'Swap slide content via args to preview authoring behavior.',
    'from-blue-600 to-cyan-500'
  ),
  buildSlide(
    'slide-3',
    'Fully responsive',
    'Settings mirror react-slick configuration used in production.',
    'from-green-600 to-teal-500'
  ),
  buildSlide(
    'slide-4',
    'Easy to customize',
    'Modify colors, content, and transitions to match your brand.',
    'from-purple-600 to-pink-500'
  ),
];

const meta = {
  title: 'Components/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    // Slides to Show control
    slidesToShow: {
      control: { type: 'number', min: 1, max: 5 },
      description: 'Number of slides to show at once',
      table: {
        category: 'Layout',
        defaultValue: { summary: '2' },
      },
    },
    // Slides to Scroll control
    slidesToScroll: {
      control: { type: 'number', min: 1, max: 5 },
      description: 'Number of slides to scroll at once',
      table: {
        category: 'Layout',
        defaultValue: { summary: '1' },
      },
    },
    // Arrow Position control
    arrowPosition: {
      control: { type: 'select' },
      options: ['Top', 'Bottom', 'Side'],
      description: 'Position of navigation arrows',
      table: {
        category: 'Navigation',
        defaultValue: { summary: 'Bottom' },
      },
    },
    // Center Zoom control
    enableCenterZoom: {
      control: { type: 'boolean' },
      description: 'Enable center mode with zoom effect',
      table: {
        category: 'Effects',
        defaultValue: { summary: 'false' },
      },
    },
    // Autoplay control
    autoplay: {
      control: { type: 'boolean' },
      description: 'Enable automatic slide advancement',
      table: {
        category: 'Behavior',
        defaultValue: { summary: 'false' },
      },
    },
    // Infinite Loop control
    infinite: {
      control: { type: 'boolean' },
      description: 'Enable infinite looping of slides',
      table: {
        category: 'Behavior',
        defaultValue: { summary: 'true' },
      },
    },
    // Number of Slides control
    numberOfSlides: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'Total number of slides to display',
      table: {
        category: 'Content',
        defaultValue: { summary: '3' },
      },
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <SitecoreProvider componentMap={componentMap} api={apiStub} page={mockPage}>
        <div className="max-w-5xl mx-auto p-4">
          <Story />
        </div>
      </SitecoreProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Carousel>;

// Interactive story with controls
export const Playground: Story = {
  args: {
    slidesToShow: 2,
    slidesToScroll: 1,
    arrowPosition: 'Bottom',
    enableCenterZoom: false,
    autoplay: false,
    infinite: true,
    numberOfSlides: 3,
  } as Record<string, unknown>,
  render: (args) => {
    const { slidesToShow, slidesToScroll, arrowPosition, enableCenterZoom, numberOfSlides } =
      args as unknown as {
        slidesToShow: number;
        slidesToScroll: number;
        arrowPosition: string;
        enableCenterZoom: boolean;
        autoplay: boolean;
        infinite: boolean;
        numberOfSlides: number;
      };

    const slides = defaultSlides.slice(0, numberOfSlides);

    const params = {
      RenderingIdentifier: 'carousel-demo',
      DynamicPlaceholderId: 'hero',
      SlidesToShow: String(slidesToShow),
      SlidesToScroll: String(slidesToScroll),
      EnableCenterZoom: enableCenterZoom ? '1' : '0',
      ArrowPosition: arrowPosition,
      textAlignment: 'left',
      styles: 'w-full',
    };

    const rendering = {
      componentName: 'Carousel',
      dataSource: '{AAAAAAA1-AAAA-AAAA-AAAA-AAAAAAAAAAA1}',
      uid: 'storybook-carousel',
      params,
      placeholders: {
        'carouselslides-{*}': slides,
        'carouselslides-hero': slides,
      },
    };

    return <Carousel fields={{ items: [] }} params={params} rendering={rendering} />;
  },
};

// Static preset stories
export const Default: Story = {
  args: {
    params: {
      RenderingIdentifier: 'carousel-demo',
      DynamicPlaceholderId: 'hero',
      SlidesToShow: '2',
      SlidesToScroll: '1',
      EnableCenterZoom: '0',
      ArrowPosition: 'Bottom',
      textAlignment: 'left',
      styles: 'w-full',
    },
    rendering: {
      componentName: 'Carousel',
      dataSource: '{AAAAAAA1-AAAA-AAAA-AAAA-AAAAAAAAAAA1}',
      uid: 'storybook-carousel',
      params: {
        RenderingIdentifier: 'carousel-demo',
        DynamicPlaceholderId: 'hero',
        SlidesToShow: '2',
        SlidesToScroll: '1',
        EnableCenterZoom: '0',
        ArrowPosition: 'Bottom',
        styles: 'w-full',
      },
      placeholders: {
        'carouselslides-{*}': defaultSlides.slice(0, 3),
        'carouselslides-hero': defaultSlides.slice(0, 3),
      },
    },
  },
};

export const SingleSlide: Story = {
  args: {
    params: {
      RenderingIdentifier: 'carousel-demo',
      DynamicPlaceholderId: 'hero',
      SlidesToShow: '1',
      SlidesToScroll: '1',
      EnableCenterZoom: '0',
      ArrowPosition: 'Bottom',
      textAlignment: 'left',
      styles: 'w-full',
    },
    rendering: {
      componentName: 'Carousel',
      dataSource: '{AAAAAAA1-AAAA-AAAA-AAAA-AAAAAAAAAAA1}',
      uid: 'storybook-carousel',
      params: {
        SlidesToShow: '1',
        SlidesToScroll: '1',
        ArrowPosition: 'Bottom',
      },
      placeholders: {
        'carouselslides-{*}': defaultSlides,
        'carouselslides-hero': defaultSlides,
      },
    },
  },
};

export const CenterZoom: Story = {
  args: {
    params: {
      RenderingIdentifier: 'carousel-demo',
      DynamicPlaceholderId: 'hero',
      SlidesToShow: '3',
      SlidesToScroll: '1',
      EnableCenterZoom: '1',
      ArrowPosition: 'Bottom',
      textAlignment: 'center',
      styles: 'w-full',
    },
    rendering: {
      componentName: 'Carousel',
      dataSource: '{AAAAAAA1-AAAA-AAAA-AAAA-AAAAAAAAAAA1}',
      uid: 'storybook-carousel',
      params: {
        SlidesToShow: '3',
        EnableCenterZoom: '1',
        ArrowPosition: 'Bottom',
      },
      placeholders: {
        'carouselslides-{*}': defaultSlides,
        'carouselslides-hero': defaultSlides,
      },
    },
  },
};

export const ArrowsOnTop: Story = {
  args: {
    params: {
      RenderingIdentifier: 'carousel-demo',
      DynamicPlaceholderId: 'hero',
      SlidesToShow: '2',
      SlidesToScroll: '1',
      EnableCenterZoom: '0',
      ArrowPosition: 'Top',
      textAlignment: 'left',
      styles: 'w-full',
    },
    rendering: {
      componentName: 'Carousel',
      dataSource: '{AAAAAAA1-AAAA-AAAA-AAAA-AAAAAAAAAAA1}',
      uid: 'storybook-carousel',
      params: {
        SlidesToShow: '2',
        ArrowPosition: 'Top',
      },
      placeholders: {
        'carouselslides-{*}': defaultSlides.slice(0, 3),
        'carouselslides-hero': defaultSlides.slice(0, 3),
      },
    },
  },
};
