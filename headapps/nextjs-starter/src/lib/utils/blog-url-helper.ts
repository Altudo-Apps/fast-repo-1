import { LinkField } from '@sitecore-content-sdk/nextjs';
import { getCustomRoute, createLinkFieldWithCustomRoute } from './sitecore-url-helper';
import { BLOG_ROUTE_CONFIG } from '../config/custom-routes.config';

/**
 * Converts a blog article internal link to its custom route URL
 * Example: "/Blogs/BlogArticles/s/Statement" -> "/blogs/statement"
 *
 * @param linkField - Sitecore LinkField that may contain a blog article link
 * @returns The custom route URL if it's a blog article, otherwise the original href
 */
export function getBlogCustomRoute(linkField?: LinkField): string | undefined {
  return getCustomRoute(linkField, BLOG_ROUTE_CONFIG);
}

/**
 * Creates a new LinkField with the custom blog route URL
 *
 * @param linkField - The original LinkField
 * @returns A new LinkField with the custom blog route URL
 */
export function getBlogLinkFieldWithCustomRoute(linkField?: LinkField): LinkField | undefined {
  return createLinkFieldWithCustomRoute(linkField, BLOG_ROUTE_CONFIG);
}
