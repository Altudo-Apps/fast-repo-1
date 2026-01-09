import type { Meta, StoryFn } from '@storybook/react';

import { SitecoreProvider } from '@sitecore-content-sdk/nextjs';

import { Default as ThemeSelector } from 'src/components/ThemeSelector';

import { ThemeProvider } from 'src/core/context/ThemeContext';

import componentMap from '../../.sitecore/component-map';

import { apiStub, mockPage } from './stubs';

import { canvasWithin, expect, userEvent } from './testUtils';

const meta: Meta<typeof ThemeSelector> = {
  title: 'Components/ThemeSelector',

  component: ThemeSelector,

  tags: ['autodocs'],
};

export default meta;

const resetThemePreference = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('theme');
  }
};

const Template: StoryFn<typeof ThemeSelector> = (args) => {
  resetThemePreference();

  return (
    <SitecoreProvider componentMap={componentMap} api={apiStub} page={mockPage}>
      <ThemeProvider defaultTheme="light">
        <div className="p-10 bg-background text-foreground">
          <p className="mb-4 text-sm text-muted-foreground">
            Toggle the button to switch between light and dark themes. The ThemeProvider mirrors the
            actual app context, so this also updates <code>document.documentElement</code>.
          </p>

          <ThemeSelector {...args} />
        </div>
      </ThemeProvider>
    </SitecoreProvider>
  );
};

export const Default = Template.bind({});

Default.args = {
  params: {},

  rendering: {
    componentName: 'ThemeSelector',

    uid: 'theme-selector-demo',

    params: {},
  },
};

Default.play = async ({ canvasElement }) => {
  const canvas = canvasWithin(canvasElement);

  // The button label depends on current theme which may be affected by system preference
  // Look for either "switch to dark mode" or "switch to light mode"
  const toggleButton = await canvas.findByRole('button', { name: /switch to (dark|light) mode/i });

  await expect(toggleButton).toBeVisible();

  // Get the current aria-label to determine what the next state should be
  const currentLabel = toggleButton.getAttribute('aria-label') || '';
  const isCurrentlyLight = currentLabel.toLowerCase().includes('dark');

  await userEvent.click(toggleButton);

  // After clicking, the label should toggle
  const expectedMode = isCurrentlyLight ? 'light' : 'dark';
  await expect(toggleButton).toHaveAttribute(
    'aria-label',
    expect.stringMatching(new RegExp(expectedMode, 'i'))
  );
};
