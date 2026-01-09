/// <reference types="node" />
// @ts-expect-error - Storybook types not resolved with bundler moduleResolution
import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
    '@storybook/addon-designs',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {
      nextConfigPath: path.resolve(__dirname, '../next.config.js'),
    },
  },
  // Use POSIX-style path so Storybook resolves correctly on Linux (Vercel)
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    config.resolve = config.resolve ?? {};

    // Align Storybook module resolution with Next.js/tsconfig paths
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      src: path.resolve(__dirname, '../src'),
      components: path.resolve(__dirname, '../src/components'),
      lib: path.resolve(__dirname, '../src/lib'),
      temp: path.resolve(__dirname, '../src/temp'),
      assets: path.resolve(__dirname, '../src/assets'),
      style: path.resolve(__dirname, '../style'),
    };

    config.resolve.modules = [
      ...(config.resolve.modules ?? []),
      path.resolve(__dirname, '../'),
      'node_modules',
    ];

    return config;
  },
};

export default config;
