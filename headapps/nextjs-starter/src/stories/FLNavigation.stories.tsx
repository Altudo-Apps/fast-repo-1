import type { Meta, StoryFn } from '@storybook/react';

import { SitecoreProvider, type TextField } from '@sitecore-content-sdk/nextjs';

import { Default as FLNavigation } from 'src/components/FLNavigation';

import type {
  NavigationProps,
  Fields as NavigationFields,
} from 'src/core/molecules/NavigationItem/Navigaton.type';

import componentMap from '../../.sitecore/component-map';

import { apiStub, mockPage } from './stubs';

import { canvasWithin, expect, userEvent } from './testUtils';

const textField = (value: string): TextField => ({ value });

const textFieldValue = (field?: TextField): string | undefined => {
  const value = field?.value;

  if (typeof value === 'string') {
    return value;
  }

  if (value !== undefined && value !== null) {
    return String(value);
  }

  return undefined;
};

let navIdCounter = 0;

const buildNavItem = (overrides: Partial<NavigationFields> = {}): NavigationFields => {
  const displayName = overrides.DisplayName ?? textFieldValue(overrides.Title) ?? 'Item';

  return {
    Id: overrides.Id ?? `nav-item-${++navIdCounter}`,

    DisplayName: displayName,

    Title: overrides.Title ?? textField(displayName),

    NavigationTitle: overrides.NavigationTitle ?? overrides.Title ?? textField(displayName),

    Href: overrides.Href ?? '#',

    Querystring: overrides.Querystring ?? '',

    Children: overrides.Children ?? [],

    Styles: overrides.Styles ?? [],
  };
};

const navigationFields: NavigationProps['fields'] = {
  Home: buildNavItem({
    Id: 'nav-home',

    DisplayName: 'Home',

    Title: textField('Home'),

    Href: '/',

    Children: [
      buildNavItem({
        Id: 'nav-home-features',

        DisplayName: 'Features',

        Title: textField('Features'),

        Href: '/features',
      }),

      buildNavItem({
        Id: 'nav-home-about',

        DisplayName: 'About',

        Title: textField('About Us'),

        Href: '/about',
      }),
    ],
  }),

  Resources: buildNavItem({
    Id: 'nav-resources',

    DisplayName: 'Resources',

    Title: textField('Resources'),

    Href: '/resources',

    Children: [
      buildNavItem({
        Id: 'nav-guides',

        DisplayName: 'Guides',

        Title: textField('Guides'),

        Href: '/resources/guides',
      }),
    ],
  }),

  Contact: buildNavItem({
    Id: 'nav-contact',

    DisplayName: 'Contact',

    Title: textField('Contact'),

    Href: '/contact',

    Children: [],
  }),
};

const meta: Meta<typeof FLNavigation> = {
  title: 'Components/FL/FLNavigation',

  component: FLNavigation,

  tags: ['autodocs'],
};

export default meta;

const Template: StoryFn<typeof FLNavigation> = (args) => (
  <SitecoreProvider componentMap={componentMap} api={apiStub} page={mockPage}>
    <FLNavigation {...args} />
  </SitecoreProvider>
);

export const Default = Template.bind({});

Default.args = {
  params: {
    RenderingIdentifier: 'fl-navigation',

    styles: 'bg-white border rounded-xl p-4',
  },

  fields: navigationFields,
};

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);

  await expect(canvas.getByRole('link', { name: /home/i })).toBeVisible();

  const resourcesTrigger = canvas.getByRole('heading', { name: /resources/i });

  await userEvent.click(resourcesTrigger);

  await expect(canvas.getByRole('link', { name: /guides/i })).toBeVisible();
};
