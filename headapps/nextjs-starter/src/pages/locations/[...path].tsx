import { GetStaticPaths, GetStaticProps } from 'next';
import { StaticPath } from '../../types/common.types';
import { extractPath, handleEditorFastRefresh } from '@sitecore-content-sdk/nextjs/utils';
import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import client from 'lib/sitecore-client';
import components from '.sitecore/component-map';
import {
  ComponentPropsContext,
  SitecorePageProps,
  SitecoreProvider,
} from '@sitecore-content-sdk/nextjs';
import { useEffect, JSX } from 'react';
import NotFound from 'src/NotFound';
import Layout from 'src/Layout';
import scConfig from 'sitecore.config';
import { getLocalizedLocation, type LocationData } from 'src/utils/locationLocalization';

interface ExtendedParams {
  requestPath?: string[];
  path?: string[];
}

/**
 * Utility: Convert Sitecore fields array into a clean object
 * Example: fields [{ name: "Title", value: "My Blog" }] => { Title: "My Blog" }
 */
function mapSitecoreFields(fields: { name: string; value: unknown }[] = []) {
  return fields.reduce((acc, field) => {
    acc[field.name.replace(/\s+/g, '')] = field.value;
    return acc;
  }, {} as Record<string, unknown>);
}

export const getStaticPaths: GetStaticPaths = async () => {
  // For locations, we'll use blocking fallback to generate pages on first request
  // This speeds up build time and allows for dynamic blog content
  const paths: StaticPath[] = [];
  const fallback: boolean | 'blocking' = 'blocking';
  return {
    paths,
    fallback,
  };
};

// Your page component
const SitecorePage = ({ page, notFound, componentProps }: SitecorePageProps): JSX.Element => {
  useEffect(() => {
    // Since Sitecore Editor does not support Fast Refresh, need to refresh editor chromes after Fast Refresh finished
    handleEditorFastRefresh();
  }, []);

  if (notFound || !page) {
    // Shouldn't hit this (as long as 'notFound' is being returned below), but just to be safe
    return <NotFound />;
  }

  return (
    <ComponentPropsContext value={componentProps || {}}>
      <SitecoreProvider componentMap={components} api={scConfig.api} page={page}>
        <Layout page={page} />
      </SitecoreProvider>
    </ComponentPropsContext>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  if (!context.params || !Array.isArray(context.params.path)) {
    return { notFound: true };
  }
  // Extract location name from final segment of wildcard path
  const locationName = context.params.path[context.params.path.length - 1];

  let page = null;
  let locationData: Record<string, unknown> = {};

  // Step 1: Fetch location via API
  try {
    const baseUrl = (process.env.LOCATIONS_API_URL_BASE || '').replace(/\/$/, '');
    const isAbsolute = (() => {
      try {
        return Boolean(baseUrl) && new URL(baseUrl).origin.length > 0;
      } catch {
        return false;
      }
    })();

    if (isAbsolute) {
      const url = `${baseUrl}/api/locations?id=${encodeURIComponent(locationName)}`;
      const res = await fetch(url);
      if (res.ok) {
        // Safely parse JSON - check if response has content first
        const responseText = await res.text();
        if (responseText && responseText.trim()) {
          try {
            const locationItem: unknown = JSON.parse(responseText);
            if (locationItem && typeof locationItem === 'object') {
              const maybeFields = (locationItem as { fields?: { name: string; value: unknown }[] })
                .fields;
              locationData = Array.isArray(maybeFields)
                ? mapSitecoreFields(maybeFields)
                : (locationItem as Record<string, unknown>);
            }
          } catch (parseError) {
            console.error('Error parsing location API response:', parseError);
          }
        }
      } else {
        console.error(
          'Error fetching location via API. Status:',
          url,
          JSON.stringify(res),
          res.status
        );
      }
      if (!locationData || Object.keys(locationData).length === 0) {
        const jsonModule = await import('../api/locations_min.json');
        const all = jsonModule.default?.locationResults || [];
        const match = all.find((loc: LocationData) => {
          // For localized data, check against all locale variants
          const localizedMatch = getLocalizedLocation(loc, context.locale);
          return [loc.locationID, localizedMatch.locationName]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase() === String(locationName).toLowerCase());
        });
        if (match) {
          // Localize the matched location
          const localized = getLocalizedLocation(match, context.locale);
          locationData = { ...localized } as Record<string, unknown>;
        }
      }
    } else {
      const jsonModule = await import('../api/locations_min.json');
      const all = jsonModule.default?.locationResults || [];
      const match = all.find((loc: LocationData) => {
        // For localized data, check against all locale variants
        const localizedMatch = getLocalizedLocation(loc, context.locale);
        return [loc.locationID, localizedMatch.locationName]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase() === String(locationName).toLowerCase());
      });
      if (match) {
        // Localize the matched location
        const localized = getLocalizedLocation(match, context.locale);
        locationData = { ...localized } as Record<string, unknown>;
      }
    }
  } catch (error) {
    console.error('Error fetching location via API:', error);
  }

  // Step 2: If no blog found, fallback to wildcard page fetch for EE support
  if (context.params && Array.isArray(context.params.path)) {
    (context.params as ExtendedParams).requestPath = context.params.path;
    context.params.path = [`locations/,-w-,`];
  }

  let props = {};
  const path = extractPath(context);

  if (context.preview && isDesignLibraryPreviewData(context.previewData)) {
    page = await client.getDesignLibraryData(context.previewData);
  } else {
    page = context.preview
      ? await client.getPreview(context.previewData)
      : await client.getPage(path, { locale: context.locale });
  }

  if (page) {
    if (!page.layout.sitecore?.route) {
      return { notFound: true };
    }
    props = {
      page: {
        ...page,
        locationData,
        layout: {
          ...page.layout,
          sitecore: {
            ...page.layout.sitecore,
            route: {
              ...page.layout.sitecore.route,
              fields: {
                ...page.layout.sitecore.route.fields,
                MetaTitle: { value: (locationData.locationName as string) || 'Location Details' },
                MetaDescription: {
                  value: `${(locationData.locationName as string) || 'Location'} in ${
                    (locationData.locationCity as string) || ''
                  }, ${(locationData.locationState as string) || ''}`,
                },
                MetaKeywords: { value: (locationData.specialties as string) || '' },
                MetaImage: {
                  value: {
                    src: (locationData.photoUrl as string) || '',
                    alt: (locationData.locationName as string) || 'Location Image',
                  },
                },
              },
            },
            context: {
              ...page.layout.sitecore.context,
              breadCrumbsContext: (
                page.layout.sitecore.context?.breadCrumbsContext as {
                  PageTitle: string;
                  Url: string;
                  HideInBreadcrumb: boolean;
                }[]
              )?.map((item) =>
                item.PageTitle === '*'
                  ? {
                      PageTitle: (locationData?.locationName as string) || 'Location',
                      Url: `/Locations/${locationData.locationID || '1234'}`,
                      HideInBreadcrumb: false,
                    }
                  : {
                      ...item,
                      // Ensure no undefined values in breadcrumb items
                      PageTitle: item.PageTitle || '',
                      Url: item.Url || '',
                    }
              ),
            },
          },
        },
      },
      dictionary: await client.getDictionary({
        site: page.siteName,
        locale: page.locale,
      }),
      componentProps: await client.getComponentData(page.layout, context, components),
    };
  }

  return {
    props,
    revalidate: 5,
    notFound: !page,
  };
};

export default SitecorePage;
