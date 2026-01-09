import { defineCliConfig } from '@sitecore-content-sdk/nextjs/config-cli';
import {
  generateSites,
  generateMetadata,
  extractFiles,
  writeImportMap,
} from '@sitecore-content-sdk/nextjs/tools';

import config from './sitecore.config';
import { SitecoreConfig } from '@sitecore-content-sdk/nextjs/config';

const logger = (title: string) => {
  return async ({ scConfig }: { scConfig: SitecoreConfig }) => {
    console.log(title, scConfig.defaultSite);
  };
};

export default defineCliConfig({
  config,
  build: {
    commands: [
      generateMetadata(),
      generateSites(),
      extractFiles(),
      writeImportMap({
        paths: ['src/components'],
      }),
      logger('This is my logger'),
    ],
  },
  componentMap: {
    paths: ['src/components'],
    exclude: [
      'src/components/content-sdk/*',
      'src/components/*.test.tsx',
      'src/components/*.test.ts',
      '**/*.test.tsx',
      '**/*.test.ts',
    ],
  },
});