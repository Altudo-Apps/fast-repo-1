import { Page } from '@sitecore-content-sdk/nextjs';

export const checkIsNotNormal = (page?: Page) => !page?.mode.isNormal && !page?.mode.isPreview;
