import type { Meta, StoryFn } from '@storybook/react';

import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';

import type {
  ComponentFields,
  ComponentParams,
  ComponentRendering,
} from '@sitecore-content-sdk/nextjs';

import MegaNav from 'src/components/MegaNav';

import componentMap from '../../.sitecore/component-map';

import { apiStub, mockPage } from './stubs';

import { canvasWithin, expect, userEvent } from './testUtils';

type MegaNavChild = ComponentRendering<ComponentFields>;
type MegaNavRendering = ComponentRendering<ComponentFields> & { params: ComponentParams };

const navPanelRichText = (title: string, body: string): MegaNavChild => ({
  uid: `${title}-richtext`,

  componentName: 'FLRichText',

  params: { styles: 'space-y-3' },

  fields: {
    Text: { value: `<h3>${title}</h3><p>${body}</p>` },
  },
});

const navPanelLinks = (id: string, links: Array<{ href: string; text: string }>): MegaNavChild =>
  ({
    uid: `${id}-links`,
    componentName: 'MegaNavLinkList',
    params: { id: `${id}-list`, styles: '' },
    fields: {
      data: {
        datasource: {
          field: { title: { value: `${id} links` } },
          children: {
            results: links.map((link) => ({
              field: {
                link: {
                  value: {
                    href: link.href,
                    text: link.text,
                    title: link.text,
                    linktype: link.href.startsWith('http') ? 'external' : 'internal',
                    target: link.href.startsWith('http') ? '_blank' : '',
                  },
                },
              },
            })),
          },
        },
      },
    },
  } as unknown as MegaNavChild);

const buildNavItem = (
  uid: string,
  title: string,
  placeholderId: string,
  children: MegaNavChild[]
): MegaNavChild => ({
  uid,
  componentName: 'MegaNavItem',
  dataSource: `{${uid.toUpperCase()}}`,
  params: { DynamicPlaceholderId: placeholderId },
  fields: {
    id: { value: uid },
    MegaNavTitle: { value: title },
  },
  placeholders: {
    [`meganavcontent-${placeholderId}`]: children,
  },
});

const navItems: MegaNavChild[] = [
  buildNavItem('meganav-products', 'Products', 'products', [
    navPanelRichText('XM Cloud', 'Composable foundation for headless experience delivery.'),

    navPanelLinks('products', [
      { href: '/products/xmcloud', text: 'XM Cloud' },

      { href: '/products/personalize', text: 'Personalize' },

      { href: '/products/content-hub', text: 'Content Hub' },
    ]),
  ]),

  buildNavItem('meganav-resources', 'Resources', 'resources', [
    navPanelRichText('Guides', 'Documentation, starter kits, and authoring tips.'),

    navPanelLinks('resources', [
      { href: '/docs/getting-started', text: 'Getting started' },

      { href: '/docs/components', text: 'Component library' },

      { href: 'https://community.sitecore.com', text: 'Community' },
    ]),
  ]),
];

const navParams = {
  DynamicPlaceholderId: 'main',

  RenderingIdentifier: 'storybook-meganav',

  styles: 'w-full bg-primary-foreground border border-slate-200 rounded-2xl p-4',
};

const navRendering = {
  componentName: 'MegaNav',
  dataSource: '{99999999-9999-9999-9999-999999999999}',
  uid: 'storybook-meganav',
  params: navParams,
  placeholders: {
    'meganav-{*}': navItems,
    'meganav-main': navItems,
  },
} satisfies MegaNavRendering;

const meta: Meta<typeof MegaNav> = {
  title: 'Components/MegaNav',

  component: MegaNav,

  tags: ['autodocs'],
};

export default meta;

const resetActiveMenuItem = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('active-menu-item');
  }
};

const Template: StoryFn<typeof MegaNav> = (args) => {
  resetActiveMenuItem();

  return (
    <SitecoreProvider componentMap={componentMap} api={apiStub} page={mockPage}>
      <MegaNav {...args} />
    </SitecoreProvider>
  );
};

export const Default = Template.bind({});

Default.args = {
  rendering: navRendering,

  params: navParams,

  fields: {
    id: 'root-meganav',

    MegaNavTitle: { value: 'Main navigation' },
  },
};

Default.parameters = {
  a11y: {
    config: {
      rules: [
        {
          // Radix UI NavigationMenu generates IDs with React internal placeholders
          // that may appear as invalid aria-owns values in Storybook
          id: 'aria-valid-attr-value',
          enabled: false,
        },
        {
          // Radix UI pattern: hidden elements may contain focusable elements
          id: 'aria-hidden-focus',
          enabled: false,
        },
      ],
    },
  },
};

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);

  const trigger = await canvas.findByRole('button', { name: /Products/i });

  await userEvent.click(trigger);

  // Content may appear in both desktop and mobile views, so use getAllByText
  const foundationTexts = await canvas.findAllByText(/Composable foundation/i);
  await expect(foundationTexts.length).toBeGreaterThan(0);
  await expect(foundationTexts[0]).toBeVisible();
};
