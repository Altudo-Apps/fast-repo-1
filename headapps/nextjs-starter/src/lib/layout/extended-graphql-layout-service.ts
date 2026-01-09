import {
  LayoutService,
  LayoutServiceConfig,
  LayoutServiceData,
  RouteOptions,
  GRAPHQL_LAYOUT_QUERY_NAME,
} from '@sitecore-content-sdk/core/layout';
import { debug } from '@sitecore-content-sdk/core';
import { Breadcrumb as BreadcrumbType } from 'src/types/Breadcrumb.types';
import {
  BreadcrumbLayoutData,
  BreadcrumbLayoutHelper,
  breadcrumbQuery,
} from './breadcrumb-layout-helper';
import { FetchOptions } from '@sitecore-content-sdk/core/client';
import { LayoutRouteService } from './layout-route-service';

export class ExtendedGraphQLLayoutService extends LayoutService {
  private layoutRouteService: LayoutRouteService;

  /**
   * Fetch layout data using the Sitecore GraphQL endpoint.
   * @param {LayoutServiceConfig} serviceConfig configuration
   */
  constructor(serviceConfig: LayoutServiceConfig) {
    super(serviceConfig);
    this.layoutRouteService = new LayoutRouteService(this.graphQLClient);
  }

  /**
   * Fetch layout data for an item.
   * @param {string} itemPath item path to fetch layout data for.
   * @param {RouteOptions} [routeOptions] Request options like language and site to retrieve data for
   * @param {FetchOptions} [fetchOptions] Options to override graphQL client details like retries and fetch implementation
   * @returns {Promise<LayoutServiceData>} layout service data
   */
  async fetchLayoutData(
    itemPath: string,
    routeOptions: RouteOptions,
    fetchOptions?: FetchOptions
  ): Promise<LayoutServiceData> {
    let cleanBreadCrumbs: BreadcrumbType[] = [];
    const site = routeOptions.site;
    const query = this.getExtendedLayoutQuery(itemPath, site, routeOptions?.locale);
    debug.layout('fetching layout data for %s %s %s', itemPath, routeOptions?.locale, site);
    const data = await this.graphQLClient.request<{
      layout: {
        item: BreadcrumbLayoutData;
      };
    }>(query, {}, fetchOptions);

    // Process layout routing using the extracted service method
    await this.layoutRouteService.processLayoutRouting(data?.layout?.item, routeOptions?.locale);

    if (data?.layout?.item) {
      cleanBreadCrumbs = BreadcrumbLayoutHelper.getBreadcrumbsFromLayout(data.layout.item);
    }

    if (data?.layout?.item?.rendered) {
      return {
        sitecore: {
          ...data.layout.item.rendered.sitecore,
          context: {
            ...data.layout.item.rendered.sitecore.context,
            breadCrumbsContext: cleanBreadCrumbs,
          },
        },
      };
    }

    // If `rendered` is empty -> not found
    return {
      sitecore: {
        context: { pageEditing: false, language: routeOptions?.locale },
        route: null,
      },
    };
  }

  /**
   * Returns GraphQL Layout query
   * @param {string} itemPath page route
   * @param {string} [site] site name
   * @param {string} [language] language
   * @returns {string} GraphQL query
   */
  protected getExtendedLayoutQuery(itemPath: string, site: string, language?: string): string {
    const languageVariable = language ? `, language:"${language}"` : '';

    const layoutQuery = this.serviceConfig.formatLayoutQuery
      ? this.serviceConfig.formatLayoutQuery(site, itemPath, language)
      : `layout(site:"${site}", routePath:"${itemPath}"${languageVariable})`;

    return `query ${GRAPHQL_LAYOUT_QUERY_NAME} {
      ${layoutQuery}{
        item {
          rendered
          ${breadcrumbQuery}
        }
      }
    }`;
  }
}
