/* eslint-disable react/jsx-max-depth -- Storybook wrappers intentionally replicate component structure */
/* eslint-disable @next/next/no-img-element -- Storybook uses plain img to avoid Next.js Image loader issues */
/* eslint-disable react/no-danger -- Storybook mock data is trusted */
import type { StoryObj } from '@storybook/react';
import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';
import { Default as PageTitleBanner } from 'src/components/PageTitleBanner';
import componentMap from '../../.sitecore/component-map';
import { apiStub, mockPage } from './stubs';
import React from 'react';

// Background color mapping for overlay
const bgColorMap: Record<string, string> = {
  primary: 'var(--primary)',
  secondary: 'var(--secondary)',
  tertiary: 'var(--accent)',
  none: 'transparent',
};

// Custom wrapper component for Storybook (uses plain img tags to avoid Next.js Image issues)
const PageTitleBannerWrapper: React.FC<{
  fields: Record<string, unknown>;
  params: Record<string, string>;
  backgroundColor?: string;
}> = ({ fields, params, backgroundColor = 'primary' }) => {
  const hasImage = Boolean(fields.Image);
  const overlayColor = hasImage
    ? 'var(--accent-foreground)'
    : bgColorMap[backgroundColor] || bgColorMap.primary;

  return (
    <section
      className={`w-full relative flex justify-center items-center overflow-hidden min-h-96 ${
        params.styles || ''
      }`}
    >
      {/* Background image */}
      {hasImage && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
          }}
        >
          <img
            src={(fields.Image as { value: { src: string } }).value.src}
            alt={(fields.Image as { value: { alt?: string } }).value.alt || ''}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 z-5"
        style={{
          opacity: hasImage ? 0.7 : 1,
          backgroundColor: overlayColor,
        }}
      />

      {/* Content container */}
      <div className="relative z-10 flex w-full h-full gap-8 container mx-auto py-12 lg:px-12 px-4 max-md:flex-col">
        {/* Text content - full width when no foreground image */}
        <div className="flex flex-col z-20 w-full text-background justify-center">
          {(fields.Category as { value: string })?.value && (
            <span className="text-sm font-medium mb-2 opacity-80">
              {(fields.Category as { value: string }).value}
            </span>
          )}
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {(fields.Title as { value: string }).value}
          </h1>
          <div
            className="text-lg mb-6 opacity-90"
            dangerouslySetInnerHTML={{
              __html: (fields.IntroText as { value: string }).value,
            }}
          />
          <div className="flex gap-4 flex-wrap">
            <a
              href={(fields.CalltoActionLinkMain as { value: { href: string } })?.value?.href}
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90"
            >
              {(fields.CalltoActionLinkMain as { value: { text: string } })?.value?.text}
            </a>
            <a
              href={(fields.CalltoActionLinkSecondary as { value: { href: string } })?.value?.href}
              className="inline-flex items-center justify-center px-6 py-3 border border-background text-background rounded-md font-medium hover:bg-background/10"
            >
              {(fields.CalltoActionLinkSecondary as { value: { text: string } })?.value?.text}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// Custom wrapper component to show foreground image layout (since Storybook Placeholder doesn't render mock content)
const PageTitleBannerWithForegroundImage: React.FC<{
  fields: Record<string, unknown>;
  params: Record<string, string>;
  foregroundImageSrc: string;
  foregroundImageAlt: string;
  imageOrder?: 'left' | 'right';
}> = ({ fields, params, foregroundImageSrc, foregroundImageAlt, imageOrder = 'right' }) => {
  return (
    <section
      className={`w-full relative flex justify-center items-center overflow-hidden lg:min-h-96 ${
        params.styles || ''
      }`}
    >
      {/* Background image */}
      {Boolean(fields.Image) && (
        <div className="absolute inset-0 z-0">
          <img
            src={(fields.Image as { value: { src: string } }).value.src}
            alt={(fields.Image as { value: { alt?: string } }).value.alt || ''}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 z-5"
        style={{
          opacity: 0.7,
          backgroundColor: 'var(--accent-foreground)',
        }}
      />

      {/* Content container */}
      <div
        className={`relative z-10 flex w-full h-full gap-8 container mx-auto py-12 lg:px-12 px-4 ${
          imageOrder === 'left' ? 'flex-row-reverse' : 'flex-row'
        } max-md:flex-col`}
      >
        {/* Text content */}
        <div className="flex flex-col z-20 w-full lg:w-1/2 text-background justify-center">
          {(fields.Category as { value: string })?.value && (
            <span className="text-sm font-medium mb-2 opacity-80">
              {(fields.Category as { value: string }).value}
            </span>
          )}
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {(fields.Title as { value: string }).value}
          </h1>
          <div
            className="text-lg mb-6 opacity-90"
            dangerouslySetInnerHTML={{
              __html: (fields.IntroText as { value: string }).value,
            }}
          />
          <div className="flex gap-4 flex-wrap">
            <a
              href={(fields.CalltoActionLinkMain as { value: { href: string } })?.value?.href}
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90"
            >
              {(fields.CalltoActionLinkMain as { value: { text: string } })?.value?.text}
            </a>
            <a
              href={(fields.CalltoActionLinkSecondary as { value: { href: string } })?.value?.href}
              className="inline-flex items-center justify-center px-6 py-3 border border-background text-background rounded-md font-medium hover:bg-background/10"
            >
              {(fields.CalltoActionLinkSecondary as { value: { text: string } })?.value?.text}
            </a>
          </div>
        </div>

        {/* Foreground image */}
        <div className="w-full lg:w-1/2 relative flex items-center justify-center z-10">
          <div className="w-full rounded-lg overflow-hidden shadow-2xl">
            <img
              src={foregroundImageSrc}
              alt={foregroundImageAlt}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Base fields for all stories
const baseFields = {
  Category: { value: 'Case Study' },
  Title: { value: 'Supercharge XM Cloud delivery' },
  IntroText: {
    value:
      '<p>Reusable banners streamline layout for landing pages, releases, and multi-lingual hero sections.</p>',
  },
  CalltoActionLinkMain: {
    value: {
      href: 'https://www.altudo.co',
      text: 'Contact Altudo',
      linktype: 'external',
      target: '_blank',
    },
  },
  CalltoActionLinkSecondary: {
    value: {
      href: '/components',
      text: 'Browse components',
      linktype: 'internal',
    },
  },
};

// Fields with background image
const fieldsWithImage = {
  ...baseFields,
  Image: {
    value: {
      src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop',
      alt: 'Modern skyscrapers',
      width: '1600',
      height: '900',
    },
  },
};

// Fields without image
const fieldsNoImage = {
  ...baseFields,
  Image: undefined,
};

const meta = {
  title: 'Components/FL/PageTitleBanner',
  component: PageTitleBanner,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    // Background Color control
    backgroundColor: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'none'],
      description: 'Background color of the banner',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'primary' },
      },
    },
    // Has Background Image control
    hasBackgroundImage: {
      control: { type: 'boolean' },
      description: 'Whether to show background image',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'true' },
      },
    },
    // Has Foreground Image control (right side image)
    hasForegroundImage: {
      control: { type: 'boolean' },
      description: 'Whether to show foreground image on the right side',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'false' },
      },
    },
    // Image Order control
    imageOrder: {
      control: { type: 'radio' },
      options: ['left', 'right'],
      description: 'Position of the image relative to content',
      table: {
        category: 'Layout',
        defaultValue: { summary: 'right' },
      },
    },
    // Text Alignment control
    textAlignment: {
      control: { type: 'radio' },
      options: ['left', 'center', 'right'],
      description: 'Horizontal text alignment',
      table: {
        category: 'Layout',
        defaultValue: { summary: 'left' },
      },
    },
    // Vertical Text Alignment control
    verticalTextAlignment: {
      control: { type: 'radio' },
      options: ['top', 'center', 'bottom'],
      description: 'Vertical text alignment',
      table: {
        category: 'Layout',
        defaultValue: { summary: 'center' },
      },
    },
    // Header Tag control
    headerTag: {
      control: { type: 'select' },
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      description: 'HTML heading tag for the title',
      table: {
        category: 'Semantics',
        defaultValue: { summary: 'h1' },
      },
    },
    // Card Orientation control
    cardOrientation: {
      control: { type: 'radio' },
      options: ['horizontal', 'horizontalflex', 'vertical'],
      description: 'Card layout orientation',
      table: {
        category: 'Layout',
        defaultValue: { summary: 'horizontal' },
      },
    },
    // Full Width control
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Whether to use full width without container',
      table: {
        category: 'Layout',
        defaultValue: { summary: 'false' },
      },
    },
    // Rounded Corners control
    rounded: {
      control: { type: 'boolean' },
      description: 'Whether to apply rounded corners',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'true' },
      },
    },
    // Shadow control
    shadow: {
      control: { type: 'boolean' },
      description: 'Whether to apply shadow',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'true' },
      },
    },
    // Content fields
    category: {
      control: { type: 'text' },
      description: 'Category label text',
      table: {
        category: 'Content',
        defaultValue: { summary: 'Case Study' },
      },
    },
    title: {
      control: { type: 'text' },
      description: 'Main title text',
      table: {
        category: 'Content',
        defaultValue: { summary: 'Supercharge XM Cloud delivery' },
      },
    },
    introText: {
      control: { type: 'text' },
      description: 'Introduction text (HTML)',
      table: {
        category: 'Content',
      },
    },
    primaryButtonText: {
      control: { type: 'text' },
      description: 'Primary CTA button text',
      table: {
        category: 'Content',
        defaultValue: { summary: 'Contact Altudo' },
      },
    },
    secondaryButtonText: {
      control: { type: 'text' },
      description: 'Secondary CTA button text',
      table: {
        category: 'Content',
        defaultValue: { summary: 'Browse components' },
      },
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <SitecoreProvider componentMap={componentMap} api={apiStub} page={mockPage}>
        <div className="p-4">
          <Story />
        </div>
      </SitecoreProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PageTitleBanner>;

// Interactive story with controls
export const Playground: Story = {
  args: {
    backgroundColor: 'primary',
    hasBackgroundImage: true,
    hasForegroundImage: false,
    imageOrder: 'right',
    textAlignment: 'left',
    verticalTextAlignment: 'center',
    headerTag: 'h1',
    cardOrientation: 'horizontal',
    fullWidth: false,
    rounded: true,
    shadow: true,
    category: 'Case Study',
    title: 'Supercharge XM Cloud delivery',
    introText:
      '<p>Reusable banners streamline layout for landing pages, releases, and multi-lingual hero sections.</p>',
    primaryButtonText: 'Contact Altudo',
    secondaryButtonText: 'Browse components',
  } as Record<string, unknown>,
  render: (args) => {
    const {
      backgroundColor,
      hasBackgroundImage,
      hasForegroundImage,
      imageOrder,
      textAlignment,
      rounded,
      shadow,
      category,
      title,
      introText,
      primaryButtonText,
      secondaryButtonText,
    } = args as unknown as {
      backgroundColor: string;
      hasBackgroundImage: boolean;
      hasForegroundImage: boolean;
      imageOrder: string;
      textAlignment: string;
      rounded: boolean;
      shadow: boolean;
      category: string;
      title: string;
      introText: string;
      primaryButtonText: string;
      secondaryButtonText: string;
    };

    // Build styles string
    const stylesParts: string[] = [];
    if (backgroundColor !== 'none') {
      stylesParts.push(`bg-${backgroundColor}`);
    }
    if (rounded) {
      stylesParts.push('rounded-[32px] overflow-hidden');
    }
    if (shadow) {
      stylesParts.push('shadow-xl');
    }
    if (textAlignment === 'center') {
      stylesParts.push('position-center');
    } else if (textAlignment === 'left') {
      stylesParts.push('position-left');
    } else if (textAlignment === 'right') {
      stylesParts.push('position-right');
    }

    const fields = {
      ...(hasBackgroundImage ? fieldsWithImage : fieldsNoImage),
      Category: { value: category },
      Title: { value: title },
      IntroText: { value: introText },
      CalltoActionLinkMain: {
        value: {
          href: 'https://www.altudo.co',
          text: primaryButtonText,
          linktype: 'external',
          target: '_blank',
        },
      },
      CalltoActionLinkSecondary: {
        value: {
          href: '/components',
          text: secondaryButtonText,
          linktype: 'internal',
        },
      },
    };

    // Use custom wrapper for foreground image since Storybook Placeholder doesn't render mock content
    if (hasForegroundImage) {
      return (
        <PageTitleBannerWithForegroundImage
          fields={fields}
          params={{ styles: stylesParts.join(' ') }}
          foregroundImageSrc="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop"
          foregroundImageAlt="Family healthcare"
          imageOrder={imageOrder as 'left' | 'right'}
        />
      );
    }

    // Use custom wrapper for Storybook to avoid Next.js Image loader issues
    return (
      <PageTitleBannerWrapper
        fields={fields}
        params={{ styles: stylesParts.join(' ') }}
        backgroundColor={backgroundColor}
      />
    );
  },
};

// Static preset stories
export const Default: Story = {
  args: {
    fields: fieldsWithImage,
    params: {
      RenderingIdentifier: 'page-title-banner',
      HeaderTag: 'h1',
      ImageOrder: 'right',
      GridParameters: 'container mx-auto',
      styles: 'bg-primary rounded-[32px] overflow-hidden shadow-xl',
    },
    rendering: {
      componentName: 'PageTitleBanner',
      dataSource: '{55555555-5555-5555-5555-555555555555}',
      uid: 'storybook-page-title-banner',
      params: {
        RenderingIdentifier: 'page-title-banner',
        HeaderTag: 'h1',
        ImageOrder: 'right',
        GridParameters: 'container mx-auto',
        styles: 'bg-primary rounded-[32px] overflow-hidden shadow-xl',
      },
    },
  },
};

export const SecondaryBackground: Story = {
  args: {
    fields: fieldsWithImage,
    params: {
      RenderingIdentifier: 'page-title-banner',
      HeaderTag: 'h1',
      ImageOrder: 'right',
      GridParameters: 'container mx-auto',
      styles: 'bg-secondary rounded-[32px] overflow-hidden shadow-xl',
    },
    rendering: {
      componentName: 'PageTitleBanner',
      dataSource: '{55555555-5555-5555-5555-555555555555}',
      uid: 'storybook-page-title-banner',
      params: {
        styles: 'bg-secondary rounded-[32px] overflow-hidden shadow-xl',
      },
    },
  },
};

export const TertiaryBackground: Story = {
  args: {
    fields: fieldsWithImage,
    params: {
      RenderingIdentifier: 'page-title-banner',
      HeaderTag: 'h1',
      ImageOrder: 'right',
      GridParameters: 'container mx-auto',
      styles: 'bg-tertiary rounded-[32px] overflow-hidden shadow-xl',
    },
    rendering: {
      componentName: 'PageTitleBanner',
      dataSource: '{55555555-5555-5555-5555-555555555555}',
      uid: 'storybook-page-title-banner',
      params: {
        styles: 'bg-tertiary rounded-[32px] overflow-hidden shadow-xl',
      },
    },
  },
};

export const ImageOnLeft: Story = {
  args: {
    fields: fieldsWithImage,
    params: {
      RenderingIdentifier: 'page-title-banner',
      HeaderTag: 'h1',
      ImageOrder: 'left',
      GridParameters: 'container mx-auto',
      styles: 'bg-primary rounded-[32px] overflow-hidden shadow-xl',
    },
    rendering: {
      componentName: 'PageTitleBanner',
      dataSource: '{55555555-5555-5555-5555-555555555555}',
      uid: 'storybook-page-title-banner',
      params: {
        ImageOrder: 'left',
        styles: 'bg-primary rounded-[32px] overflow-hidden shadow-xl',
      },
    },
  },
};

export const CenteredText: Story = {
  args: {
    fields: fieldsWithImage,
    params: {
      RenderingIdentifier: 'page-title-banner',
      HeaderTag: 'h1',
      ImageOrder: 'right',
      GridParameters: 'container mx-auto',
      styles: 'bg-primary rounded-[32px] overflow-hidden shadow-xl position-center',
    },
    rendering: {
      componentName: 'PageTitleBanner',
      dataSource: '{55555555-5555-5555-5555-555555555555}',
      uid: 'storybook-page-title-banner',
      params: {
        styles: 'bg-primary rounded-[32px] overflow-hidden shadow-xl position-center',
      },
    },
  },
};

export const NoImage: Story = {
  args: {
    fields: fieldsNoImage,
    params: {
      RenderingIdentifier: 'page-title-banner',
      HeaderTag: 'h1',
      ImageOrder: 'right',
      GridParameters: 'container mx-auto',
      styles: 'bg-primary rounded-[32px] overflow-hidden shadow-xl',
    },
    rendering: {
      componentName: 'PageTitleBanner',
      dataSource: '{55555555-5555-5555-5555-555555555555}',
      uid: 'storybook-page-title-banner',
      params: {
        styles: 'bg-primary rounded-[32px] overflow-hidden shadow-xl',
      },
    },
  },
};

export const HeroBanner: Story = {
  args: {
    fields: {
      ...fieldsWithImage,
      Category: { value: 'Welcome' },
      Title: { value: 'Build faster with FastLane' },
      IntroText: {
        value:
          '<p>Accelerate your Sitecore XM Cloud implementation with pre-built components and best practices.</p>',
      },
    },
    params: {
      RenderingIdentifier: 'page-title-banner',
      HeaderTag: 'h1',
      ImageOrder: 'right',
      GridParameters: '',
      styles: 'bg-primary',
    },
    rendering: {
      componentName: 'PageTitleBanner',
      dataSource: '{55555555-5555-5555-5555-555555555555}',
      uid: 'storybook-page-title-banner',
      params: {
        HeaderTag: 'h1',
        GridParameters: '',
        styles: 'bg-primary',
      },
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <SitecoreProvider componentMap={componentMap} api={apiStub} page={mockPage}>
        <Story />
      </SitecoreProvider>
    ),
  ],
};

// Story with foreground image on the right (like homepage hero)
export const WithForegroundImage: Story = {
  render: () => (
    <PageTitleBannerWithForegroundImage
      fields={{
        ...fieldsWithImage,
        Category: { value: 'Thought Leadership' },
        Title: { value: "Who can't afford care?" },
        IntroText: {
          value:
            '<p>Once upon a time, in a far-off land, there was a very lazy king who spent all day lounging on his throne. One day, his advisors came to him with a problem: the kingdom was running out of money.</p>',
        },
      }}
      params={{
        styles: 'rounded-[32px] overflow-hidden shadow-xl',
      }}
      foregroundImageSrc="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop"
      foregroundImageAlt="Family healthcare"
      imageOrder="right"
    />
  ),
};

// Story with foreground image on the left
export const ForegroundImageOnLeft: Story = {
  render: () => (
    <PageTitleBannerWithForegroundImage
      fields={{
        ...fieldsWithImage,
        Category: { value: 'Healthcare Solutions' },
        Title: { value: 'Transforming patient care' },
        IntroText: {
          value:
            '<p>Discover innovative healthcare solutions that put patients first and improve outcomes across the entire care journey.</p>',
        },
      }}
      params={{
        styles: 'rounded-[32px] overflow-hidden shadow-xl',
      }}
      foregroundImageSrc="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop"
      foregroundImageAlt="Healthcare professional"
      imageOrder="left"
    />
  ),
};
