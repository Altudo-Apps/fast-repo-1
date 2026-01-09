import { EditingService } from '@sitecore-content-sdk/nextjs/editing';
import {
  BreadcrumbLayoutData,
  BreadcrumbLayoutHelper,
  breadcrumbQuery,
} from './breadcrumb-layout-helper';
import { debug } from '@sitecore-content-sdk/nextjs';
import {
  EditingOptions,
  EditingServiceConfig,
} from '@sitecore-content-sdk/core/types/editing/editing-service';
import { LayoutKind } from '@sitecore-content-sdk/core/editing';
import { FetchOptions } from '@sitecore-content-sdk/core/client';
import { LayoutRouteService } from './layout-route-service';

/**
 * Extended editing options that make siteName optional.
 * This allows for fallback to defaultSiteName when siteName is not provided.
 */
interface ExtendedEditingOptions extends Omit<EditingOptions, 'siteName'> {
  siteName?: string;
}

interface ExtendedEditingServiceConfig extends EditingServiceConfig {
  defaultSiteName?: string;
}

/**
 * Dictionary fetch options for paginated dictionary queries.
 */
interface DictionaryFetchOptions {
  siteName: string;
  language: string;
}

/**
 * The dictionary query default page size.
 */
const PAGE_SIZE = 1000;

/**
 * GraphQL query for fetching editing data.
 */
export const query = /* GraphQL */ `
 query EditingQuery(
    $itemId: String!
    $language: String!
    $version: String
) {
    item(path: $itemId, language: $language, version: $version) {
      rendered
      ${breadcrumbQuery}
    }
  }
`;

/**
 * GraphQL query for fetching dictionary data.
 * This query is used when the dictionary data is paginated.
 */
export const dictionaryQuery = /* GraphQL */ `
  query EditingDictionaryQuery(
    $siteName: String!
    $language: String!
    $after: String
    $pageSize: Int = ${PAGE_SIZE}
  ) {
    site {
      siteInfo(site: $siteName) {
        dictionary(language: $language, first: $pageSize, after: $after) {
          results {
            key
            value
          }
          pageInfo {
            endCursor
            hasNext
          }
        }
      }
    }
  }
`;

/**
 * Service for fetching editing data from Sitecore using the Sitecore's GraphQL API.
 * Expected to be used in XMCloud Pages preview (editing) Metadata Edit Mode.
 */
export class ExtendedGraphQLEditingService extends EditingService {
  private layoutRouteService: LayoutRouteService;
  private defaultSiteName?: string;

  /**
   * Fetch layout data using the Sitecore GraphQL endpoint.
   * @param {EditingServiceConfig} serviceConfig configuration
   */
  constructor(serviceConfig: ExtendedEditingServiceConfig) {
    super(serviceConfig);
    this.defaultSiteName = serviceConfig.defaultSiteName;
    this.layoutRouteService = new LayoutRouteService(this.getGraphQLClient());
  }

  /**
   * Fetches editing data. Provides the layout data and dictionary phrases
   * @param {object} variables - The parameters for fetching editing data.
   * @param {string} [variables.siteName] - The site name.
   * @param {string} variables.itemId - The item id (path) to fetch layout data for.
   * @param {string} variables.language - The language to fetch layout data for.
   * @param {string} variables.mode - The editing mode to fetch layout data for.
   * @param {string} [variables.version] - The version of the item (optional).
   * @param {LayoutKind} [variables.layoutKind] - The final or shared layout variant.
   * @param {FetchOptions} [fetchOptions] Options to override graphQL client details like retries and fetch implementation
   * @returns {Promise} The layout data and dictionary phrases.
   */
  async fetchEditingData(
    {
      siteName,
      itemId,
      language,
      version,
      layoutKind = LayoutKind.Final,
      mode,
    }: ExtendedEditingOptions,
    fetchOptions?: FetchOptions
  ) {
    debug.editing(
      'fetching editing data for %s %s %s %s',
      siteName,
      itemId,
      language,
      version,
      layoutKind
    );

    if (!language) {
      throw new RangeError('The language must be a non-empty string');
    }

    const editModeHeader = mode === 'edit' ? 'true' : 'false';

    const requestFetchOptions = this.createFetchOptions(layoutKind, editModeHeader, fetchOptions);

    const queryVariables: { itemId: string; language: string; version?: string } = {
      itemId,
      language,
    };

    if (version?.toLowerCase() === 'latest') {
      queryVariables.version = 'latest';
    }

    const editingData = await this.getGraphQLClient().request<{
      item: BreadcrumbLayoutData;
    }>(query, queryVariables, requestFetchOptions);

    // Process layout routing using the extracted service method
    await this.layoutRouteService.processLayoutRouting(
      editingData?.item,
      language,
      requestFetchOptions
    );

    const cleanBreadCrumbs = editingData?.item
      ? BreadcrumbLayoutHelper.getBreadcrumbsFromLayout(editingData.item)
      : [];

    const resolvedSiteName = this.resolveSiteName(siteName, editingData?.item);

    const dictionary =
      resolvedSiteName && editingData?.item
        ? await this.fetchDictionaryData(
            {
              siteName: resolvedSiteName,
              language,
            },
            fetchOptions
          )
        : {};

    if (editingData?.item?.rendered) {
      return {
        layoutData: {
          sitecore: {
            ...editingData.item.rendered.sitecore,
            context: {
              ...editingData.item.rendered.sitecore.context,
              breadCrumbsContext: cleanBreadCrumbs,
            },
          },
        },
        dictionary,
      };
    }

    // If `rendered` is empty -> not found
    return {
      layoutData: {
        sitecore: {
          context: { pageEditing: true, language },
          route: null,
        },
      },
      dictionary,
    };
  }

  /**
   * Fetches dictionary data with pagination support.
   * @param {DictionaryFetchOptions} options - Dictionary fetch options
   * @param {FetchOptions} [fetchOptions] - GraphQL client fetch options
   * @returns {Promise<Record<string, string>>} Dictionary phrases
   */
  private async fetchDictionaryData(
    { siteName, language }: DictionaryFetchOptions,
    fetchOptions?: FetchOptions
  ): Promise<Record<string, string>> {
    let dictionary: { key: string; value: string }[] = [];
    let currentAfter = '';
    let currentHasNext = true;

    while (currentHasNext) {
      const dictionaryData = await this.getGraphQLClient().request<{
        site?: {
          siteInfo?: {
            dictionary?: {
              results: { key: string; value: string }[];
              pageInfo: {
                endCursor: string;
                hasNext: boolean;
              };
            };
          };
        };
      }>(
        dictionaryQuery,
        {
          siteName,
          language,
          after: currentAfter || undefined,
        },
        fetchOptions
      );

      if (dictionaryData?.site?.siteInfo?.dictionary) {
        dictionary = [...dictionary, ...dictionaryData.site.siteInfo.dictionary.results];
        currentHasNext = dictionaryData.site.siteInfo.dictionary.pageInfo.hasNext;
        currentAfter = dictionaryData.site.siteInfo.dictionary.pageInfo.endCursor;
      } else {
        currentHasNext = false;
      }
    }

    // Convert array to dictionary object
    return dictionary.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, string>);
  }

  /**
   * Helper method to create FetchOptions with editing headers
   * This can be called by other services that need the same headers
   */
  public createFetchOptions(
    layoutKind: LayoutKind = LayoutKind.Final,
    editModeHeader: string = 'false',
    baseFetchOptions?: FetchOptions
  ): FetchOptions {
    const editingHeaders = {
      sc_layoutKind: layoutKind,
      sc_editMode: editModeHeader,
    };

    return {
      ...baseFetchOptions,
      headers: {
        ...baseFetchOptions?.headers,
        ...editingHeaders,
      },
    };
  }

  private resolveSiteName(
    providedSiteName: string | undefined,
    layoutData?: BreadcrumbLayoutData
  ): string | undefined {
    return (
      providedSiteName ||
      layoutData?.rendered?.sitecore?.context?.site?.name ||
      this.defaultSiteName
    );
  }
}
