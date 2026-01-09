import type { StoryObj } from '@storybook/react';
import React from 'react';
import { SitecoreProvider, ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { Default as CTAButton } from 'src/components/CTAButton';
import componentMap from '../../.sitecore/component-map';
import { apiStub, mockPage } from './stubs';

// Default rendering for stories
const defaultRendering: ComponentRendering = {
  componentName: 'CTAButton',
  dataSource: '{11111111-1111-1111-1111-111111111111}',
  uid: 'storybook-cta-button',
};

const meta = {
  title: 'Components/FL/CTAButton',
  component: CTAButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    // Button Style control
    buttonStyle: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'link'],
      description: 'Visual style of the button',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'primary' },
      },
    },
    // Icon Position control
    iconPosition: {
      control: { type: 'radio' },
      options: ['left', 'center', 'right'],
      description: 'Position of the icon relative to text',
      table: {
        category: 'Layout',
        defaultValue: { summary: 'left' },
      },
    },
    // Show Icon control
    showIcon: {
      control: { type: 'boolean' },
      description: 'Whether to show an icon',
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'true' },
      },
    },
    // Button Text control
    buttonText: {
      control: { type: 'text' },
      description: 'Text displayed on the button',
      table: {
        category: 'Content',
        defaultValue: { summary: 'Book a demo' },
      },
    },
    // Button Link control
    buttonLink: {
      control: { type: 'text' },
      description: 'URL the button links to',
      table: {
        category: 'Content',
        defaultValue: { summary: 'https://www.altudo.co' },
      },
    },
    // Open in New Tab control
    openInNewTab: {
      control: { type: 'boolean' },
      description: 'Whether to open link in new tab',
      table: {
        category: 'Behavior',
        defaultValue: { summary: 'true' },
      },
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <SitecoreProvider componentMap={componentMap} api={apiStub} page={mockPage}>
        <div className="p-8">
          <Story />
        </div>
      </SitecoreProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CTAButton>;

// Interactive story with controls
export const Playground: Story = {
  args: {
    buttonStyle: 'primary',
    iconPosition: 'left',
    showIcon: true,
    buttonText: 'Book a demo',
    buttonLink: 'https://www.altudo.co',
    openInNewTab: true,
  } as Record<string, unknown>,
  render: (args) => {
    const { buttonStyle, iconPosition, showIcon, buttonText, buttonLink, openInNewTab } =
      args as unknown as {
        buttonStyle: string;
        iconPosition: string;
        showIcon: boolean;
        buttonText: string;
        buttonLink: string;
        openInNewTab: boolean;
      };

    // Map iconPosition to Styles param
    let stylesParam = '';
    if (iconPosition === 'right') {
      stylesParam = 'position-right';
    } else if (iconPosition === 'center') {
      stylesParam = 'position-center';
    }

    const params = {
      RenderingIdentifier: 'cta-button',
      styles: '',
      ButtonStyle: buttonStyle,
      Styles: stylesParam,
    };

    const fields = {
      ButtonImage: showIcon
        ? {
            value: {
              src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=120&auto=format&fit=crop',
              alt: 'Button icon',
              width: '120',
              height: '120',
            },
          }
        : undefined,
      ButtonLink: {
        value: {
          href: buttonLink,
          text: buttonText,
          title: buttonText,
          linktype: 'external',
          target: openInNewTab ? '_blank' : '_self',
        },
      },
    };

    return (
      <CTAButton
        rendering={defaultRendering}
        params={params}
        fields={fields as unknown as React.ComponentProps<typeof CTAButton>['fields']}
      />
    );
  },
};

// Static preset stories
export const Primary: Story = {
  args: {
    rendering: defaultRendering,
    params: {
      RenderingIdentifier: 'cta-button',
      styles: '',
      ButtonStyle: 'primary',
      Styles: '',
    },
    fields: {
      ButtonImage: {
        value: {
          src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=120&auto=format&fit=crop',
          alt: 'Lightning icon',
          width: '120',
          height: '120',
        },
      },
      ButtonLink: {
        value: {
          href: 'https://www.altudo.co',
          text: 'Book a demo',
          title: 'Book a demo',
          linktype: 'external',
          target: '_blank',
        },
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    rendering: defaultRendering,
    params: {
      RenderingIdentifier: 'cta-button',
      styles: '',
      ButtonStyle: 'secondary',
      Styles: '',
    },
    fields: {
      ButtonImage: {
        value: {
          src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=120&auto=format&fit=crop',
          alt: 'Lightning icon',
          width: '120',
          height: '120',
        },
      },
      ButtonLink: {
        value: {
          href: 'https://www.altudo.co',
          text: 'Learn more',
          title: 'Learn more',
          linktype: 'external',
          target: '_blank',
        },
      },
    },
  },
};

export const Outline: Story = {
  args: {
    rendering: defaultRendering,
    params: {
      RenderingIdentifier: 'cta-button',
      styles: '',
      ButtonStyle: 'outline',
      Styles: '',
    },
    fields: {
      ButtonImage: {
        value: {
          src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=120&auto=format&fit=crop',
          alt: 'Lightning icon',
          width: '120',
          height: '120',
        },
      },
      ButtonLink: {
        value: {
          href: 'https://www.altudo.co',
          text: 'Get started',
          title: 'Get started',
          linktype: 'external',
          target: '_blank',
        },
      },
    },
  },
};

export const LinkStyle: Story = {
  args: {
    rendering: defaultRendering,
    params: {
      RenderingIdentifier: 'cta-button',
      styles: '',
      ButtonStyle: 'link',
      Styles: '',
    },
    fields: {
      ButtonImage: { value: {} },
      ButtonLink: {
        value: {
          href: 'https://www.altudo.co',
          text: 'Read more →',
          title: 'Read more',
          linktype: 'external',
          target: '_blank',
        },
      },
    },
  },
};

export const IconOnRight: Story = {
  args: {
    rendering: defaultRendering,
    params: {
      RenderingIdentifier: 'cta-button',
      styles: '',
      ButtonStyle: 'primary',
      Styles: 'position-right',
    },
    fields: {
      ButtonImage: {
        value: {
          src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=120&auto=format&fit=crop',
          alt: 'Arrow icon',
          width: '120',
          height: '120',
        },
      },
      ButtonLink: {
        value: {
          href: 'https://www.altudo.co',
          text: 'Continue',
          title: 'Continue',
          linktype: 'external',
          target: '_blank',
        },
      },
    },
  },
};

export const IconCentered: Story = {
  args: {
    rendering: defaultRendering,
    params: {
      RenderingIdentifier: 'cta-button',
      styles: '',
      ButtonStyle: 'primary',
      Styles: 'position-center',
    },
    fields: {
      ButtonImage: {
        value: {
          src: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=120&auto=format&fit=crop',
          alt: 'Download icon',
          width: '120',
          height: '120',
        },
      },
      ButtonLink: {
        value: {
          href: 'https://www.altudo.co',
          text: 'Download',
          title: 'Download',
          linktype: 'external',
          target: '_blank',
        },
      },
    },
  },
};

export const NoIcon: Story = {
  args: {
    rendering: defaultRendering,
    params: {
      RenderingIdentifier: 'cta-button',
      styles: '',
      ButtonStyle: 'primary',
      Styles: '',
    },
    fields: {
      ButtonImage: { value: {} },
      ButtonLink: {
        value: {
          href: 'https://www.altudo.co',
          text: 'Contact us',
          title: 'Contact us',
          linktype: 'external',
          target: '_blank',
        },
      },
    },
  },
};
