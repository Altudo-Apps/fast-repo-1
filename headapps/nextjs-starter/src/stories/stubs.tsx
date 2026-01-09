import { LayoutServiceData, LayoutServicePageState, Page } from '@sitecore-content-sdk/nextjs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiStub = {} as any;
export const mockLayoutData: LayoutServiceData = {
  sitecore: {
    context: {
      pageEditing: false,
      site: { name: 'ContentSdkTestWeb' },
      language: 'en',
    },
    route: {
      name: 'styleguide',
      placeholders: { 'ContentSdkTestWeb-main': [] },
      itemId: 'testitemid',
    },
  },
};
export const mockRoute = mockLayoutData.sitecore.route;
export const mockPage: Page = {
  layout: mockLayoutData,
  locale: 'en',
  mode: {
    name: LayoutServicePageState.Normal,
    isNormal: true,
    isPreview: false,
    isEditing: false,
    isDesignLibrary: false,
    designLibrary: {
      isVariantGeneration: false,
    },
  },
};
