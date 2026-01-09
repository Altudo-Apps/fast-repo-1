import type { Meta, StoryFn } from '@storybook/react';

import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';

import type { NextRouter } from 'next/router';

import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';

import LanguageSelector from 'src/components/LanguageSelector';

import componentMap from '../../.sitecore/component-map';

import { apiStub, mockPage } from './stubs';

import { canvasWithin, expect, userEvent } from './testUtils';

const languagesFields = {
  data: {
    language: {
      languageLabel: { value: 'Language' },
      siteLanguages: {
        jsonValue: [
          {
            id: 'lang-en',
            url: '/en',
            name: 'English',
            displayName: 'English',
            fields: {
              LanguageTitle: { value: 'English' },
              Alias: { value: 'en' },
            },
          },
          {
            id: 'lang-fr',
            url: '/fr-ca',
            name: 'Français (Canada)',
            displayName: 'French (Canada)',
            fields: {
              LanguageTitle: { value: 'Français' },
              Alias: { value: 'fr-CA' },
            },
          },
          {
            id: 'lang-ar',
            url: '/ar-ae',
            name: 'Arabic',
            displayName: 'Arabic',
            fields: {
              LanguageTitle: { value: 'العربية' },
              Alias: { value: 'ar-AE' },
            },
          },
        ],
      },
    },
  },
};

const buildMockRouter = (overrides: Partial<NextRouter> = {}): NextRouter =>
  ({
    basePath: '',

    pathname: '/',

    route: '/',

    asPath: '/',

    query: {},

    push: async () => true,

    replace: async () => true,

    reload: () => {},

    back: () => {},

    prefetch: async () => {},

    beforePopState: () => {},

    events: {
      on: () => {},

      off: () => {},

      emit: () => {},
    },

    isLocaleDomain: false,

    isReady: true,

    isFallback: false,

    isPreview: false,

    locales: ['en', 'fr-CA', 'ar-AE'],

    defaultLocale: 'en',

    locale: 'en',

    ...overrides,
  } as NextRouter);

const meta: Meta<typeof LanguageSelector> = {
  title: 'Components/LanguageSelector',

  component: LanguageSelector,

  tags: ['autodocs'],
};

export default meta;

const Template: StoryFn<typeof LanguageSelector> = (args) => (
  <SitecoreProvider componentMap={componentMap} api={apiStub} page={mockPage}>
    <RouterContext.Provider value={buildMockRouter()}>
      <LanguageSelector {...args} />
    </RouterContext.Provider>
  </SitecoreProvider>
);

export const Default = Template.bind({});

Default.args = {
  fields: languagesFields,
};

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);

  const button = await canvas.findByRole('button', { name: /english/i });

  await expect(button).toBeVisible();

  await userEvent.click(button);

  const menuItem = await canvas.findByRole('button', { name: /français/i });

  await expect(menuItem).toBeVisible();
};
