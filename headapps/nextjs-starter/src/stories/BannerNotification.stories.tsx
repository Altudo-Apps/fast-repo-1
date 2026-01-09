import React from 'react';
import type { Meta, StoryContext, StoryObj } from '@storybook/react';
import { DefaultBanner } from 'src/core/molecules/NotificationBanner/DefaultBanner';
import { ErrorBanner } from 'src/core/molecules/NotificationBanner/ErrorBanner';
import { NotificationBannerProps } from 'src/types/NotificationBanner.types';
import {
  ImageField,
  RichTextField,
  ComponentParams,
  ComponentRendering,
  SitecoreProvider,
} from '@sitecore-content-sdk/nextjs';
import { apiStub, mockPage } from './stubs';
import componentMap from '../../.sitecore/component-map';
import { canvasWithin, expect, userEvent, waitFor } from './testUtils';

// Mock data for stories
const mockImageField: ImageField = {
  value: {
    src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=48&q=60',
    alt: 'Notification Icon',
    width: '48',
    height: '48',
  },
};

const mockEmptyImageField: ImageField = {
  value: undefined,
};

const mockTitleField: RichTextField = {
  value: 'Important Notice',
};

const mockTextField: RichTextField = {
  value: 'This is an important notification message that users should be aware of.',
};

const mockLongTitleField: RichTextField = {
  value: 'This is a Very Long Title That Might Wrap to Multiple Lines',
};

const mockLongTextField: RichTextField = {
  value:
    'This is a longer notification message that demonstrates how the component handles multiple lines of text and wrapping content appropriately within the banner layout.',
};

const mockParams: ComponentParams = {
  RenderingIdentifier: 'notification-banner-1',
  styles: 'mb-4',
};

const mockRendering: ComponentRendering & { params: ComponentParams } = {
  componentName: 'NotificationBanner',
  dataSource: '',
  params: mockParams,
};

// Base props
const baseProps: NotificationBannerProps = {
  rendering: mockRendering,
  params: mockParams,
  fields: {
    BannerIcon: mockImageField,
    BannerTitle: mockTitleField,
    BannerText: mockTextField,
  },
};

// Meta configuration for DefaultBanner
const resetDismissedState = (id: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  const candidates = [
    `notification-defaultSite-${id}-closed`,
    `notification-storybook-${id}-closed`,
    `notification-${mockPage.layout.sitecore.context.site?.name ?? 'storybook'}-${id}-closed`,
    `notification-undefined-${id}-closed`,
  ];

  candidates.forEach((key) => window.localStorage.removeItem(key));
};

const withSitecoreProvider = (Story: React.FC, context: StoryContext): React.ReactElement => {
  const identifier =
    (context.args as NotificationBannerProps | undefined)?.params?.RenderingIdentifier ??
    mockParams.RenderingIdentifier;
  resetDismissedState(identifier);

  return (
    <SitecoreProvider api={apiStub} page={mockPage} componentMap={componentMap}>
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Story {...context.args} />
      </div>
    </SitecoreProvider>
  );
};

const defaultMeta: Meta<typeof DefaultBanner> = {
  title: 'Components/NotificationBanner',
  component: DefaultBanner,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Default notification banner component with customizable icon, title, text, and close functionality.',
      },
    },
  },
  argTypes: {
    fields: {
      control: 'object',
      description: 'Banner content fields including icon, title, and text',
    },
    params: {
      control: 'object',
      description: 'Component parameters including rendering identifier and styles',
    },
    rendering: {
      control: 'object',
      description: 'Sitecore rendering information',
    },
  },
  decorators: [withSitecoreProvider],
};

// Meta configuration for ErrorBanner
const errorMeta: Meta<typeof ErrorBanner> = {
  title: 'Components/NotificationBanner/ErrorBanner',
  component: ErrorBanner,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Error notification banner component with alert circle icon and destructive styling.',
      },
    },
  },
  argTypes: {
    fields: {
      control: 'object',
      description: 'Banner content fields including title and text',
    },
    params: {
      control: 'object',
      description: 'Component parameters including rendering identifier and styles',
    },
    rendering: {
      control: 'object',
      description: 'Sitecore rendering information',
    },
  },
  decorators: [withSitecoreProvider],
};

export default defaultMeta;

// Default Banner Stories
type DefaultBannerStory = StoryObj<typeof DefaultBanner>;

export const Default: DefaultBannerStory = {
  args: baseProps,
  parameters: {
    docs: {
      description: {
        story: 'Default notification banner with icon, title, and description text.',
      },
    },
  },
};

export const WithoutIcon: DefaultBannerStory = {
  args: {
    ...baseProps,
    fields: {
      ...baseProps.fields,
      BannerIcon: mockEmptyImageField,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default notification banner without an icon.',
      },
    },
  },
};

export const LongContent: DefaultBannerStory = {
  args: {
    ...baseProps,
    fields: {
      ...baseProps.fields,
      BannerTitle: mockLongTitleField,
      BannerText: mockLongTextField,
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default notification banner with longer content to test text wrapping.',
      },
    },
  },
};

export const MinimalContent: DefaultBannerStory = {
  args: {
    ...baseProps,
    fields: {
      BannerIcon: mockEmptyImageField,
      BannerTitle: { value: 'Alert' },
      BannerText: { value: 'Short message.' },
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal notification banner with just title and short text.',
      },
    },
  },
};

export const WithCustomStyles: DefaultBannerStory = {
  args: {
    ...baseProps,
    params: {
      ...mockParams,
      styles: 'mb-6 mx-4 shadow-lg',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default notification banner with custom styling applied.',
      },
    },
  },
};

// Error Banner Stories
export const ErrorDefault: StoryObj<typeof ErrorBanner> = {
  ...errorMeta,
  args: {
    ...baseProps,
    fields: {
      BannerIcon: mockEmptyImageField, // Error banner uses AlertCircle icon
      BannerTitle: { value: 'Error Occurred' },
      BannerText: {
        value: 'An error has occurred while processing your request. Please try again.',
      },
    },
    params: {
      ...mockParams,
      RenderingIdentifier: 'error-banner-1',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Error notification banner with destructive styling and alert icon.',
      },
    },
  },
};

export const ErrorCritical: StoryObj<typeof ErrorBanner> = {
  ...errorMeta,
  args: {
    ...baseProps,
    fields: {
      BannerIcon: mockEmptyImageField,
      BannerTitle: { value: 'Critical Error' },
      BannerText: { value: 'A critical error has occurred. Contact support immediately.' },
    },
    params: {
      ...mockParams,
      RenderingIdentifier: 'error-banner-2',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Critical error notification banner.',
      },
    },
  },
};

export const ErrorLongContent: StoryObj<typeof ErrorBanner> = {
  ...errorMeta,
  args: {
    ...baseProps,
    fields: {
      BannerIcon: mockEmptyImageField,
      BannerTitle: { value: 'Validation Error: Multiple Issues Found' },
      BannerText: {
        value:
          'The form submission failed due to multiple validation errors. Please review the highlighted fields and ensure all required information is provided correctly before attempting to submit again.',
      },
    },
    params: {
      ...mockParams,
      RenderingIdentifier: 'error-banner-3',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Error notification banner with longer content to test text wrapping in error state.',
      },
    },
  },
};

// Combined stories showing multiple banners
export const MultipleBanners: StoryObj<typeof DefaultBanner> = {
  render: () => (
    <div className="space-y-4">
      <DefaultBanner
        {...{
          ...baseProps,
          params: { ...mockParams, RenderingIdentifier: 'multi-banner-1' },
        }}
      />
      <ErrorBanner
        {...{
          ...baseProps,
          fields: {
            BannerIcon: mockEmptyImageField,
            BannerTitle: { value: 'Error Message' },
            BannerText: { value: 'Something went wrong. Please try again.' },
          },
          params: { ...mockParams, RenderingIdentifier: 'multi-banner-2' },
        }}
      />
      <DefaultBanner
        {...{
          ...baseProps,
          fields: {
            BannerIcon: mockEmptyImageField,
            BannerTitle: { value: 'Success' },
            BannerText: { value: 'Operation completed successfully.' },
          },
          params: { ...mockParams, RenderingIdentifier: 'multi-banner-3' },
        }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Multiple notification banners stacked to show different states and variations.',
      },
    },
  },
};

// Interactive story for testing close functionality
export const InteractiveClose: DefaultBannerStory = {
  args: baseProps,
  parameters: {
    docs: {
      description: {
        story: 'Interactive banner to test close functionality. Close and refresh to see it again.',
      },
    },
  },
};

InteractiveClose.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);
  const alert = await canvas.findByRole('alert');

  await expect(alert).toBeVisible();

  const closeButton = canvas.getByRole('button', { name: /close notification/i });
  await userEvent.click(closeButton);

  await waitFor(() => {
    expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
  });

  const identifier =
    (InteractiveClose.args as NotificationBannerProps)?.params?.RenderingIdentifier ||
    mockParams.RenderingIdentifier ||
    'notification-banner-1';
  resetDismissedState(identifier);
};
