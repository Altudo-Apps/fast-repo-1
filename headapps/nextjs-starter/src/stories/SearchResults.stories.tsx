import type { Meta, StoryFn } from '@storybook/react';

import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime';

import type { NextRouter } from 'next/router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';

import SearchResults from 'src/components/SearchResults';

import componentMap from '../../.sitecore/component-map';

import { apiStub, mockPage } from './stubs';

import { canvasWithin, expect } from './testUtils';

if (!process.env.NEXT_PUBLIC_SEARCH_RFKID) {
  process.env.NEXT_PUBLIC_SEARCH_RFKID = 'storybook-rfk';
}

if (!process.env.NEXT_PUBLIC_SEARCH_SOURCE_ID) {
  process.env.NEXT_PUBLIC_SEARCH_SOURCE_ID = 'storybook-source';
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Avoid re-fetching on tab focus; Storybook should load once
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      retry: false,
      staleTime: Infinity,
    },
  },
});

const buildRouter = (overrides: Partial<NextRouter> = {}): NextRouter =>
  ({
    basePath: '',

    pathname: '/search',

    route: '/search',

    asPath: '/search?q=headless',

    query: { q: 'headless' },

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

    locales: ['en'],

    defaultLocale: 'en',

    locale: 'en',

    ...overrides,
  } as NextRouter);

const meta: Meta<typeof SearchResults> = {
  title: 'Components/SearchResults',

  component: SearchResults,

  tags: ['autodocs'],
};

export default meta;

const Template: StoryFn<typeof SearchResults> = (args) => (
  <SitecoreProvider componentMap={componentMap} api={apiStub} page={mockPage}>
    <QueryClientProvider client={queryClient}>
      <RouterContext.Provider value={buildRouter()}>
        <div className="max-w-5xl mx-auto">
          <SearchResults {...args} />
        </div>
      </RouterContext.Provider>
    </QueryClientProvider>
  </SitecoreProvider>
);

export const Default = Template.bind({});

Default.args = {
  params: {
    RenderingIdentifier: 'search-results-demo',

    styles: 'py-10',
  },

  rendering: {
    componentName: 'SearchResults',

    uid: 'storybook-search',

    params: {},
  },
};

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);

  const searchInput = await canvas.findByRole('textbox');

  await expect(searchInput).toHaveValue('headless');
};
