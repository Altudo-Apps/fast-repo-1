import { debug } from '@sitecore-content-sdk/core';
import { LayoutServiceData, Item, ComponentRendering } from '@sitecore-content-sdk/core/layout';
import { GraphQLClient, FetchOptions } from '@sitecore-content-sdk/core/client';

export class LayoutRouteService {
  constructor(private graphQLClient: GraphQLClient) {}

  public async processLayoutRouting(
    itemContext: { rendered: LayoutServiceData },
    language?: string,
    fetchOptions?: FetchOptions
  ): Promise<void> {
    // alter layout data if the given route is using layout routing
    // get the layout route data from the page prop and then loop through the partial designs
    // to get the layout data for each partial design and add it to the page props
    const layoutRouteData = itemContext?.rendered?.sitecore?.route?.fields
      ? itemContext?.rendered?.sitecore?.route?.fields['LayoutRoute']
      : null;

    if (layoutRouteData !== null) {
      const partialDesigns =
        ((layoutRouteData as Item)?.fields?.['PartialDesigns'] as Array<Item>) || [];

      await Promise.all(
        partialDesigns.map(async (partialDesign) => {
          const layoutData = await this.fetchLayoutRoute(
            partialDesign.id?.toString() || '',
            language || '',
            fetchOptions
          );

          // Dynamically process all placeholders from itemContext
          const placeholders = itemContext?.rendered?.sitecore?.route?.placeholders;
          if (placeholders && layoutData.sitecore.route?.placeholders) {
            Object.keys(placeholders).forEach((placeholderKey) => {
              const layoutPlaceholderData = layoutData.sitecore.route?.placeholders[placeholderKey];
              if (
                layoutPlaceholderData &&
                Array.isArray(layoutPlaceholderData) &&
                layoutPlaceholderData.length > 0
              ) {
                placeholders[placeholderKey].push(
                  ...(layoutPlaceholderData as Array<ComponentRendering>)
                );
              }
            });
          }
        })
      );
    }
  }

  public async fetchLayoutRoute(
    routeId: string,
    language: string,
    fetchOptions?: FetchOptions
  ): Promise<LayoutServiceData> {
    const query = this.getLayoutRouteQuery(routeId, language);
    debug.layout('fetching layout route data for routeId: %s %s', routeId, language);

    const data = await this.graphQLClient.request<{
      item: { rendered: LayoutServiceData };
    }>(query, undefined, fetchOptions);

    return data.item.rendered;
  }

  private getLayoutRouteQuery(routeId: string, language: string): string {
    return `query {
                item(path: "${routeId}", language: "${language}") {
                    rendered
                }
            }`;
  }
}
