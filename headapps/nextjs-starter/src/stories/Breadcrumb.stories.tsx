import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import BreadCrumb from 'src/components/Breadcrumb';
import type {
  ComponentParams,
  ComponentRendering,
  NextjsContentSdkComponent,
  Page,
} from '@sitecore-content-sdk/nextjs';
import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from 'lib/component-props';
import type { Breadcrumb as BreadcrumbType } from 'src/types/Breadcrumb.types';
import { apiStub, mockPage } from './stubs';
import { canvasWithin, expect } from './testUtils';

const componentFactory = new Map<string, NextjsContentSdkComponent>();

const mockBreadcrumbs: BreadcrumbType[] = [
  { PageTitle: 'Home', Url: '/', HideInBreadcrumb: false },
  { PageTitle: 'Components', Url: '/components', HideInBreadcrumb: false },
  { PageTitle: 'Breadcrumb', Url: '/components/breadcrumb', HideInBreadcrumb: false },
];

const mockStoryPage: Page = {
  ...mockPage,
  layout: {
    ...mockPage.layout,
    sitecore: {
      ...mockPage.layout.sitecore,
      context: {
        ...mockPage.layout.sitecore?.context,
        breadCrumbsContext: mockBreadcrumbs,
      },
    },
  },
};

const mockParams: ComponentParams = {
  styles: 'p-4 bg-white rounded-md shadow-sm',
};

const mockRendering = {
  componentName: 'Breadcrumb',
  dataSource: '{00000000-0000-0000-0000-000000000000}',
  uid: 'breadcrumb-story',
  params: mockParams,
} as ComponentRendering & { params: ComponentParams };

const baseArgs: ComponentProps = {
  rendering: mockRendering,
  params: mockParams,
};

const Template: StoryFn<ComponentProps> = (args) => (
  <SitecoreProvider componentMap={componentFactory} api={apiStub} page={mockStoryPage}>
    <BreadCrumb {...args} />
  </SitecoreProvider>
);

export default {
  title: 'Components/Breadcrumb',
  component: BreadCrumb,
  tags: ['autodocs'],
} as Meta<typeof BreadCrumb>;

export const Default = Template.bind({});
Default.args = baseArgs;

const figmaUrl =
  'https://www.figma.com/design/XN2mhOBpxDH3elRTVzcPPu/XMC-Fastlane---components-(Copy)?node-id=140-1970&t=UMEjrtOKmNdHlXif-4';

Default.parameters = {
  design: {
    type: 'figma',
    url: figmaUrl,
  },
};

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);
  const breadcrumbNav = await canvas.findByRole('navigation', { name: /breadcrumb/i });
  const nav = canvasWithin(breadcrumbNav);

  const componentsLink = nav.getByRole('link', { name: /components/i });
  await expect(componentsLink).toHaveAttribute('href', '/components');

  const currentPage = nav.getByRole('link', { name: /breadcrumb$/i });
  await expect(currentPage).toHaveAttribute('aria-current', 'page');
};
