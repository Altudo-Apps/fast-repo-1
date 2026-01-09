import { ComponentParams, ComponentRendering } from '@sitecore-content-sdk/nextjs';

export type CommonComponentProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
};

export type StaticPath = {
  params: {
    path: string[];
  };
  locale?: string;
};

export type ComponentFields = Record<string, unknown>;

export interface PageLanguage {
  redirectionPath: string;
  displayName: string;
  url: {
    path: string;
  };
  alias: {
    name: string;
  };
}
