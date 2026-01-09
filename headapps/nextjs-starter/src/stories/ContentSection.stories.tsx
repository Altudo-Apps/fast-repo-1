/* eslint-disable react/jsx-max-depth -- Storybook wrappers intentionally replicate component structure */
/* eslint-disable @next/next/no-img-element -- Storybook uses plain img to avoid Next.js Image loader issues */
/* eslint-disable react/no-danger -- Storybook mock data is trusted */
import type { StoryObj } from '@storybook/react';
import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';
import { Default as ContentSection } from 'src/components/ContentSection';
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

// Custom wrapper component to show foreground image layout
const ContentSectionWithForegroundImage: React.FC<{
  fields: Record<string, unknown>;
  params: Record<string, string>;
  foregroundImageSrc: string;
  foregroundImageAlt: string;
  imageOrder?: 'left' | 'right';
  backgroundColor?: string;
}> = ({
  fields,
  params,
  foregroundImageSrc,
  foregroundImageAlt,
  imageOrder = 'right',
  backgroundColor = 'primary',
}) => {
  const hasImage = Boolean(fields.Image);
  const overlayColor = hasImage
    ? 'var(--accent-foreground)'
    : bgColorMap[backgroundColor] || bgColorMap.primary;

  return (
    <section
      className={`w-full relative flex justify-center items-center overflow-hidden lg:min-h-96 ${
        params.styles || ''
      }`}
    >
      {/* Background image */}
      {hasImage && (
        <div className="absolute inset-0 z-0">
          <img
            src={(fields.Image as { value: { src: string } }).value.src}
            alt={(fields.Image as { value: { alt?: string } }).value.alt || ''}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Overlay - uses background color when no image, accent overlay when there is an image */}
      <div
        className="absolute inset-0 z-5"
        style={{
          opacity: hasImage ? 0.7 : 1,
          backgroundColor: overlayColor,
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
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {(fields.Title as { value: string }).value}
          </h2>
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
  Category: { value: 'FastLane' },
  Title: { value: 'Launch Sitecore XM Cloud faster' },
  IntroText: {
    value:
      '<p>ContentSection wraps the PageTitleBanner experience, so this story exercises the same placeholder-driven composition with a SitecoreProvider context.</p>',
  },
  CalltoActionLinkMain: {
    value: {
      href: 'https://www.altudo.co',
      text: 'Talk to Altudo',
      linktype: 'external',
    },
  },
  CalltoActionLinkSecondary: {
    value: {
      href: '/components',
      text: 'Explore components',
      linktype: 'internal',
    },
  },
};

// Fields with background image
const fieldsWithImage = {
  ...baseFields,
  Image: {
    value: {
      src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop',
      alt: 'Team collaboration',
      width: '1200',
      height: '630',
    },
  },
};

// Fields without image
const fieldsNoImage = {
  ...baseFields,
  Image: undefined,
};

const meta = {
  title: 'Components/FL/ContentSection',
  component: ContentSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    // Background Color control
    backgroundColor: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'tertiary', 'none'],
      description: 'Background color of the section',
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
        defaultValue: { summary: 'h2' },
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
        defaultValue: { summary: 'FastLane' },
      },
    },
    title: {
      control: { type: 'text' },
      description: 'Main title text',
      table: {
        category: 'Content',
        defaultValue: { summary: 'Launch Sitecore XM Cloud faster' },
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
        defaultValue: { summary: 'Talk to Altudo' },
      },
    },
    secondaryButtonText: {
      control: { type: 'text' },
      description: 'Secondary CTA button text',
      table: {
        category: 'Content',
        defaultValue: { summary: 'Explore components' },
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

type Story = StoryObj<typeof ContentSection>;

// Interactive story with controls
export const Playground: Story = {
  args: {
    backgroundColor: 'primary',
    hasBackgroundImage: true,
    hasForegroundImage: false,
    imageOrder: 'right',
    textAlignment: 'left',
    verticalTextAlignment: 'center',
    headerTag: 'h2',
    cardOrientation: 'horizontal',
    fullWidth: false,
    rounded: true,
    shadow: true,
    category: 'FastLane',
    title: 'Launch Sitecore XM Cloud faster',
    introText:
      '<p>ContentSection wraps the PageTitleBanner experience, so this story exercises the same placeholder-driven composition with a SitecoreProvider context.</p>',
    primaryButtonText: 'Talk to Altudo',
    secondaryButtonText: 'Explore components',
  } as Record<string, unknown>,
  render: (args) => {
    const {
      backgroundColor,
      hasBackgroundImage,
      hasForegroundImage,
      imageOrder,
      textAlignment,
      verticalTextAlignment,
      headerTag,
      cardOrientation,
      fullWidth,
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
      verticalTextAlignment: string;
      headerTag: string;
      cardOrientation: string;
      fullWidth: boolean;
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
      stylesParts.push('rounded-3xl overflow-hidden');
    }
    if (shadow) {
      stylesParts.push('shadow-lg');
    }
    if (textAlignment === 'center') {
      stylesParts.push('position-center');
    } else if (textAlignment === 'left') {
      stylesParts.push('position-left');
    } else if (textAlignment === 'right') {
      stylesParts.push('position-right');
    }

    const params: Record<string, string> = {
      RenderingIdentifier: 'content-section-demo',
      HeaderTag: headerTag,
      ImageOrder: imageOrder,
      VerticalTextAlignment: verticalTextAlignment,
      CardOrientation: cardOrientation,
      GridParameters: fullWidth ? '' : 'container mx-auto',
      styles: stylesParts.join(' '),
    };

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
        <ContentSectionWithForegroundImage
          fields={fields}
          params={{ styles: stylesParts.join(' ') }}
          foregroundImageSrc="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop"
          foregroundImageAlt="Healthcare professional"
          imageOrder={imageOrder as 'left' | 'right'}
          backgroundColor={backgroundColor}
        />
      );
    }

    const rendering = {
      componentName: 'ContentSection',
      dataSource: '{44444444-4444-4444-4444-444444444444}',
      uid: 'storybook-content-section',
      params,
    };

    return (
      <ContentSection
        fields={fields}
        params={params}
        rendering={rendering as unknown as React.ComponentProps<typeof ContentSection>['rendering']}
      />
    );
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            // Color contrast cannot be accurately measured against background images
            id: 'color-contrast',
            enabled: false,
          },
        ],
      },
    },
  },
};

// Static preset stories
export const Default: Story = {
  args: {
    fields: fieldsWithImage,
    params: {
      RenderingIdentifier: 'content-section-demo',
      HeaderTag: 'h2',
      ImageOrder: 'right',
      GridParameters: 'container mx-auto',
      styles: 'bg-primary rounded-3xl overflow-hidden shadow-lg',
    },
    rendering: {
      componentName: 'ContentSection',
      dataSource: '{44444444-4444-4444-4444-444444444444}',
      uid: 'storybook-content-section',
      params: {
        RenderingIdentifier: 'content-section-demo',
        HeaderTag: 'h2',
        ImageOrder: 'right',
        GridParameters: 'container mx-auto',
        styles: 'bg-primary rounded-3xl overflow-hidden shadow-lg',
      },
    },
  },
};

export const SecondaryBackground: Story = {
  args: {
    fields: fieldsWithImage,
    params: {
      RenderingIdentifier: 'content-section-demo',
      HeaderTag: 'h2',
      ImageOrder: 'right',
      GridParameters: 'container mx-auto',
      styles: 'bg-secondary rounded-3xl overflow-hidden shadow-lg',
    },
    rendering: {
      componentName: 'ContentSection',
      dataSource: '{44444444-4444-4444-4444-444444444444}',
      uid: 'storybook-content-section',
      params: {
        styles: 'bg-secondary rounded-3xl overflow-hidden shadow-lg',
      },
    },
  },
};

export const TertiaryBackground: Story = {
  args: {
    fields: fieldsWithImage,
    params: {
      RenderingIdentifier: 'content-section-demo',
      HeaderTag: 'h2',
      ImageOrder: 'right',
      GridParameters: 'container mx-auto',
      styles: 'bg-tertiary rounded-3xl overflow-hidden shadow-lg',
    },
    rendering: {
      componentName: 'ContentSection',
      dataSource: '{44444444-4444-4444-4444-444444444444}',
      uid: 'storybook-content-section',
      params: {
        styles: 'bg-tertiary rounded-3xl overflow-hidden shadow-lg',
      },
    },
  },
};

export const ImageOnLeft: Story = {
  args: {
    fields: fieldsWithImage,
    params: {
      RenderingIdentifier: 'content-section-demo',
      HeaderTag: 'h2',
      ImageOrder: 'left',
      GridParameters: 'container mx-auto',
      styles: 'bg-primary rounded-3xl overflow-hidden shadow-lg',
    },
    rendering: {
      componentName: 'ContentSection',
      dataSource: '{44444444-4444-4444-4444-444444444444}',
      uid: 'storybook-content-section',
      params: {
        ImageOrder: 'left',
        styles: 'bg-primary rounded-3xl overflow-hidden shadow-lg',
      },
    },
  },
};

export const CenteredText: Story = {
  args: {
    fields: fieldsWithImage,
    params: {
      RenderingIdentifier: 'content-section-demo',
      HeaderTag: 'h2',
      ImageOrder: 'right',
      GridParameters: 'container mx-auto',
      styles: 'bg-primary rounded-3xl overflow-hidden shadow-lg position-center',
    },
    rendering: {
      componentName: 'ContentSection',
      dataSource: '{44444444-4444-4444-4444-444444444444}',
      uid: 'storybook-content-section',
      params: {
        styles: 'bg-primary rounded-3xl overflow-hidden shadow-lg position-center',
      },
    },
  },
};

export const NoImage: Story = {
  args: {
    fields: fieldsNoImage,
    params: {
      RenderingIdentifier: 'content-section-demo',
      HeaderTag: 'h2',
      ImageOrder: 'right',
      GridParameters: 'container mx-auto',
      styles: 'bg-primary rounded-3xl overflow-hidden shadow-lg',
    },
    rendering: {
      componentName: 'ContentSection',
      dataSource: '{44444444-4444-4444-4444-444444444444}',
      uid: 'storybook-content-section',
      params: {
        styles: 'bg-primary rounded-3xl overflow-hidden shadow-lg',
      },
    },
  },
};

export const Plain: Story = {
  args: {
    fields: fieldsNoImage,
    params: {
      RenderingIdentifier: 'content-section-demo',
      HeaderTag: 'h2',
      ImageOrder: 'right',
      GridParameters: 'container mx-auto',
      styles: 'rounded-3xl overflow-hidden border',
    },
    rendering: {
      componentName: 'ContentSection',
      dataSource: '{44444444-4444-4444-4444-444444444444}',
      uid: 'storybook-content-section',
      params: {
        styles: 'rounded-3xl overflow-hidden border',
      },
    },
  },
};

// Story with foreground image on the right
export const WithForegroundImage: Story = {
  render: () => (
    <ContentSectionWithForegroundImage
      fields={{
        ...fieldsWithImage,
        Category: { value: 'Healthcare' },
        Title: { value: 'Improving patient outcomes' },
        IntroText: {
          value:
            '<p>Our comprehensive healthcare solutions help providers deliver better care while reducing costs and improving patient satisfaction.</p>',
        },
      }}
      params={{
        styles: 'rounded-3xl overflow-hidden shadow-lg',
      }}
      foregroundImageSrc="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop"
      foregroundImageAlt="Healthcare professional"
      imageOrder="right"
      backgroundColor="primary"
    />
  ),
};

// Story with foreground image on the left
export const ForegroundImageOnLeft: Story = {
  render: () => (
    <ContentSectionWithForegroundImage
      fields={{
        ...fieldsWithImage,
        Category: { value: 'Innovation' },
        Title: { value: 'Digital transformation' },
        IntroText: {
          value:
            '<p>Embrace the future of healthcare with cutting-edge digital solutions that streamline operations and enhance patient experiences.</p>',
        },
      }}
      params={{
        styles: 'rounded-3xl overflow-hidden shadow-lg',
      }}
      foregroundImageSrc="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop"
      foregroundImageAlt="Family healthcare"
      imageOrder="left"
      backgroundColor="primary"
    />
  ),
};
