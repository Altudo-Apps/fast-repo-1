import type { Preview } from '@storybook/react';
import '../style/main.css';
import React from 'react';
import { type ViewportMap } from 'storybook/viewport';

// Make sure global context is available for Sitecore components
if (typeof window !== 'undefined') {
window.pageEditing = {
  getPlaceholderChromes: () => [],
  getFieldChromes: () => [],
  getComponentChromes: () => [],
  isEditing: true,
};

// Mock Sitecore JSS context
  window.SitecoreContext = {
  sitecoreContext: {
    pageEditing: true,
    pageState: 'edit',
    site: { name: 'storybook' },
  },
};
}

// Type definitions
declare global {
  interface Window {
    pageEditing: {
      getPlaceholderChromes: () => unknown[];
      getFieldChromes: () => unknown[];
      getComponentChromes: () => unknown[];
      isEditing: boolean;
    };
    SitecoreContext: {
      sitecoreContext: {
        pageEditing: boolean;
        pageState: string;
        site: { name: string };
      };
    };
  }
}

// Create a decorator that provides Sitecore context wrapper
const withSitecoreContext = (Story: React.ComponentType) => {
  return React.createElement(
      'div',
      {
        'data-sitecore-context': 'true',
        className: 'sitecore-context-provider',
      },
    React.createElement(Story)
  );
};

const CUSTOM_VIEWPORTS: ViewportMap = {
  iphone17: {
    name: 'iPhone 17',
    styles: { width: '390px', height: '844px' },
    type: 'mobile',
  },
  iphone17Pro: {
    name: 'iPhone 17 Pro',
    styles: { width: '393px', height: '852px' },
    type: 'mobile',
  },
  iphone17ProMax: {
    name: 'iPhone 17 Pro Max',
    styles: { width: '430px', height: '932px' },
    type: 'mobile',
  },
  ipadMini: {
    name: 'iPad mini',
    styles: { width: '768px', height: '1024px' },
    type: 'tablet',
  },
  ipadAir11: {
    name: 'iPad Air 11″',
    styles: { width: '834px', height: '1194px' },
    type: 'tablet',
  },
  ipadPro13: {
    name: 'iPad Pro 13″',
    styles: { width: '1024px', height: '1366px' },
    type: 'tablet',
  },
  desktopLarge: {
    name: 'Large desktop',
    styles: { width: '1920px', height: '1080px' },
    type: 'desktop',
  },
  desktop4k: {
    name: '4K Display',
    styles: { width: '3840px', height: '2160px' },
    type: 'desktop',
  },
};

const preview: Preview = {
  parameters: {
    a11y: {
      context: '#storybook-root',
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
      options: {
        checks: {
          'color-contrast': {
            options: { noScroll: true },
          },
        },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: CUSTOM_VIEWPORTS,
    },
  },
  initialGlobals: {
    viewport: { value: 'desktopLarge', isRotated: false },
  },
  decorators: [withSitecoreContext],
};

export default preview;
