import { CustomRouteConfig } from '../utils/sitecore-url-helper';

/**
 * Configuration for blog article custom routes
 * Converts: /Blogs/BlogArticles/{letter}/ItemName -> /blogs/item-name
 */
export const BLOG_ROUTE_CONFIG: CustomRouteConfig = {
  bucketFolderName: 'BlogArticles',
  customRoutePrefix: '/blogs',
  additionalPathSegments: ['Blogs', 'Home/Blogs'],
};

/**
 * Add more route configurations here as needed
 * Example:
 *
 * export const LOCATION_ROUTE_CONFIG: CustomRouteConfig = {
 *   bucketFolderName: 'LocationItems',
 *   customRoutePrefix: '/locations',
 *   additionalPathSegments: ['Locations', 'Home/Locations'],
 * };
 *
 * export const PRODUCT_ROUTE_CONFIG: CustomRouteConfig = {
 *   bucketFolderName: 'ProductItems',
 *   customRoutePrefix: '/products',
 * };
 *
 * export const EVENT_ROUTE_CONFIG: CustomRouteConfig = {
 *   bucketFolderName: 'EventItems',
 *   customRoutePrefix: '/events',
 * };
 */
