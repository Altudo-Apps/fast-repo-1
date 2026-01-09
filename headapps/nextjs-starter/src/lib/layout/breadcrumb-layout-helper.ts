import { LayoutServiceData } from '@sitecore-content-sdk/nextjs';
import { Breadcrumb as BreadcrumbType } from 'src/types/Breadcrumb.types';

export interface BreadcrumbAncestor {
  url?: { path?: string };
  pageTitle?: { value?: string };
  navigationTitle?: { value?: string };
  exclusions: {
    targetItems: {
      field: {
        value: string;
      };
    }[];
  };
}

export const breadcrumbQuery = `
          breadCrumbsCurrentUrl:url {
            path
          }
          breadCrumbsCurrentPageTitle: field(name: "PageTitle") {
            value
          }
          breadCrumbsCurrentNavigationTitle: field(name: "NavigationTitle") {
            value
          }
          breadCrumbsCurrentExclusions: field(name: "NavigationFilter") {
            ... on MultilistField {
              targetItems {
                field(name: "Key") {
                  value
                }
              }
            }
          }
          breadCrumbsAncestors: ancestors {
            url {
              path
            }
            pageTitle:field(name:"PageTitle") {
              value
            }
            navigationTitle:field(name:"NavigationTitle") {
              value
            }
            exclusions: field(name: "NavigationFilter") {
              ... on MultilistField {
                targetItems {
                  field(name: "Key") {
                    value
                  }
                }
              }
            }
          }
`;

export type BreadcrumData = {
  breadCrumbsCurrentUrl: {
    path: string;
  };
  breadCrumbsCurrentPageTitle: {
    value: string;
  };
  breadCrumbsCurrentNavigationTitle: {
    value: string;
  };
  breadCrumbsCurrentExclusions: {
    targetItems: {
      field: {
        value: string;
      };
    }[];
  };
  breadCrumbsAncestors: BreadcrumbAncestor[];
};

export type BreadcrumbLayoutData = BreadcrumData & {
  rendered: LayoutServiceData;
};

export class BreadcrumbLayoutHelper {
  static getBreadcrumbs(breadcrumbAncestors: BreadcrumbAncestor[]): BreadcrumbType[] {
    return breadcrumbAncestors.map((breadcrumb) => ({
      PageTitle: breadcrumb?.pageTitle?.value || breadcrumb?.navigationTitle?.value || '',
      Url: breadcrumb?.url?.path || '',
      HideInBreadcrumb:
        breadcrumb?.exclusions?.targetItems?.findIndex((x) => x.field.value === 'breadcrumb') !== -1
          ? true
          : false,
    }));
  }

  static getBreadcrumbsFromLayout(itemContext: BreadcrumbLayoutData): BreadcrumbType[] {
    let breadCrumbsContext: BreadcrumbType[] = [];

    if (
      itemContext.breadCrumbsCurrentUrl &&
      itemContext.breadCrumbsAncestors &&
      itemContext.breadCrumbsCurrentUrl?.path &&
      !(itemContext.breadCrumbsCurrentUrl?.path === '/')
    ) {
      const tempBreadCrumbs = itemContext.breadCrumbsAncestors.reverse();
      const parseBreadCrumbs = (breadCrumbContext: BreadcrumbAncestor[]): BreadcrumbType[] => {
        return breadCrumbContext.map((breadcrumb: BreadcrumbAncestor) => ({
          PageTitle: breadcrumb?.pageTitle?.value || breadcrumb?.navigationTitle?.value || '',
          Url: breadcrumb?.url?.path || '',
          HideInBreadcrumb:
            breadcrumb?.exclusions?.targetItems?.findIndex(
              (x) => x.field.value === 'breadcrumb'
            ) !== -1
              ? true
              : false,
        }));
      };

      tempBreadCrumbs.push({
        url: itemContext.breadCrumbsCurrentUrl,
        pageTitle: itemContext.breadCrumbsCurrentPageTitle,
        navigationTitle: itemContext.breadCrumbsCurrentNavigationTitle,
        exclusions: itemContext.breadCrumbsCurrentExclusions,
      });

      breadCrumbsContext = parseBreadCrumbs(itemContext.breadCrumbsAncestors)?.filter(
        (x) => !x.HideInBreadcrumb
      );
    }

    return breadCrumbsContext;
  }
}
