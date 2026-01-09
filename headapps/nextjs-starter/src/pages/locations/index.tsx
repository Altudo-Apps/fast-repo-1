import { useEffect, JSX } from 'react';
import { GetStaticProps } from 'next';
import NotFound from 'src/NotFound';
import Layout from 'src/Layout';
// import { LocationsResponse } from '../../types/LocationsListing.types';
import { extractPath, handleEditorFastRefresh } from '@sitecore-content-sdk/nextjs/utils';
import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import client from 'lib/sitecore-client';
import components from '.sitecore/component-map';
import {
  ComponentPropsContext,
  SitecoreProvider,
  SitecorePageProps,
} from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';
import { getLocalizedLocationResults } from 'src/utils/locationLocalization';

export const getStaticProps: GetStaticProps = async (context) => {
  let props;
  const path = extractPath(context);
  let page;
  let data;

  // Enhanced logging for debugging
  console.log('[Locations] Starting getStaticProps', {
    path,
    locale: context.locale,
    preview: context.preview,
    CI: process.env.CI,
  });

  try {
    if (context.preview && isDesignLibraryPreviewData(context.previewData)) {
      page = await client.getDesignLibraryData(context.previewData);
    } else {
      // Fix path construction - ensure we use correct route
      const locationPath = (path ? `${path}/locations` : '/locations').replace(/\/\//, '/');
      console.log('[Locations] Fetching Sitecore page:', locationPath);

      page = context.preview
        ? await client.getPreview(context.previewData)
        : await client.getPage(locationPath, { locale: context.locale });
    }

    console.log('[Locations] Sitecore page fetched:', !!page);

    if (page) {
      props = {
        page,
        dictionary: await client.getDictionary({
          site: page.siteName,
          locale: page.locale,
        }),
        componentProps: await client.getComponentData(page.layout, context, components),
      };
      console.log('[Locations] Props created successfully');
    } else {
      console.warn('[Locations] Sitecore page is null - will attempt to use fallback');
    }
  } catch (pageError) {
    console.error('[Locations] Error fetching Sitecore page:', pageError);
    // Don't throw here - continue to try loading location data
  }

  // Fetch locations data
  try {
    const baseUrl = (process.env.LOCATIONS_API_URL_BASE || '').replace(/\/$/, '');
    console.log('[Locations] API Base URL:', baseUrl || 'not set');

    const isAbsolute = (() => {
      try {
        return Boolean(baseUrl) && new URL(baseUrl).origin.length > 0;
      } catch {
        return false;
      }
    })();
    // For localized content, always use JSON file as it has the localized structure
    // API data may not have the localized structure, so we prioritize JSON for i18n
    const shouldUseJsonForLocalization = context.locale && context.locale !== 'en';
    const shouldFetch = isAbsolute && !process.env.CI && !shouldUseJsonForLocalization;

    console.log('[Locations] Should fetch from API:', shouldFetch);
    console.log(
      '[Locations] Using JSON for localization:',
      shouldUseJsonForLocalization,
      'Locale:',
      context.locale
    );

    if (shouldFetch) {
      const url = `${baseUrl}/api/locations`;
      console.log('[Locations] Fetching from:', url);
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`[Locations] API fetch failed with status: ${res.status}`);
        throw Error(`Error fetching location via API. Status: ${res.status}`);
      }
      data = await res.json();
      console.log('[Locations] API data loaded:', { locationCount: data?.locationCount });
      // Check if API data has localized structure, if not, fallback to JSON
      if (data?.locationResults && data.locationResults.length > 0) {
        const firstLocation = data.locationResults[0];
        if (!firstLocation.localized) {
          console.log('[Locations] API data missing localized structure, falling back to JSON');
          data = null; // Force fallback to JSON
        }
      }
    }

    // Always load from JSON if data is not available or if we need localization
    if (!data || shouldUseJsonForLocalization) {
      console.log('[Locations] Fetching data from json (localization required or no API data)');
      const jsonModule = await import('../api/locations_min.json');
      console.log('[Locations] jsonModule', jsonModule);
      data = jsonModule.default;
      console.log('[Locations] JSON data loaded:', { locationCount: data?.locationCount });
    }

    // Localize the data based on the current locale
    const localizedData = getLocalizedLocationResults(data, context.locale);
    console.log('[Locations] Data localized for locale:', context.locale);
    console.log('[Locations] Sample localized location:', {
      locationID: localizedData.locationResults[0]?.locationID,
      locationName: localizedData.locationResults[0]?.locationName,
      locationCity: localizedData.locationResults[0]?.locationCity,
      locationState: localizedData.locationResults[0]?.locationState,
      hasLocalized: !!(localizedData.locationResults[0] as unknown as Record<string, unknown>)
        ?.localized,
    });

    // If we have a valid page with route, modify it with location data
    if (props?.page?.layout?.sitecore?.route) {
      console.log('[Locations] Modifying page with location data');
      const modifiedPage = {
        ...props.page,
        data: localizedData,
        layout: {
          ...props.page.layout,
          sitecore: {
            ...props.page.layout.sitecore,
            route: {
              ...props.page.layout.sitecore.route,
              fields: {
                ...props.page.layout.sitecore.route.fields,
                MetaTitle: { value: `Locations - ${localizedData.locationCount} found` },
                MetaDescription: {
                  value: `Browse our list of ${localizedData.locationCount} locations.`,
                },
              },
            },
          },
        },
      };

      return {
        props: {
          ...props,
          page: modifiedPage,
        },
        revalidate: 5,
      };
    } else {
      // If page is missing, log detailed error
      console.error('[Locations] Missing page or route structure:', {
        hasProps: !!props,
        hasPage: !!props?.page,
        hasLayout: !!props?.page?.layout,
        hasSitecore: !!props?.page?.layout?.sitecore,
        hasRoute: !!props?.page?.layout?.sitecore?.route,
      });

      // Return 404 only if we genuinely don't have page data
      return {
        notFound: true,
        revalidate: 5,
      };
    }
  } catch (error) {
    console.error('[Locations] Critical error in getStaticProps:', error);

    // Last attempt - try to load local JSON
    try {
      console.log('[Locations] Final fallback - attempting local JSON');
      const jsonModule = await import('../api/locations_min.json');
      data = jsonModule.default;
      console.log('[Locations] Fallback JSON loaded:', { locationCount: data?.locationCount });

      // Localize the fallback data based on the current locale
      const localizedData = getLocalizedLocationResults(data, context.locale);
      console.log('[Locations] Fallback data localized for locale:', context.locale);

      // If we have valid props, try to return them
      if (props?.page?.layout?.sitecore?.route) {
        const modifiedPage = {
          ...props.page,
          data: localizedData,
          layout: {
            ...props.page.layout,
            sitecore: {
              ...props.page.layout.sitecore,
              route: {
                ...props.page.layout.sitecore.route,
                fields: {
                  ...props.page.layout.sitecore.route.fields,
                  MetaTitle: { value: `Locations - ${localizedData.locationCount} found` },
                  MetaDescription: {
                    value: `Browse our list of ${localizedData.locationCount} locations.`,
                  },
                },
              },
            },
          },
        };

        return {
          props: {
            ...props,
            page: modifiedPage,
          },
          revalidate: 5,
        };
      }
    } catch (fallbackError) {
      console.error('[Locations] Fallback also failed:', fallbackError);
    }

    // If all else fails, return 404
    console.error('[Locations] Returning 404 - all attempts failed');
    return {
      notFound: true,
      revalidate: 5,
    };
  }
};

const SitecorePage = ({ page, notFound, componentProps }: SitecorePageProps): JSX.Element => {
  useEffect(() => {
    // Since Sitecore Editor does not support Fast Refresh, need to refresh editor chromes after Fast Refresh finished
    handleEditorFastRefresh();

    // Runtime debugging
    const pageData = page as typeof page & { data?: { locationCount?: number } };
    console.log('[Locations Client] Page loaded:', {
      hasPage: !!page,
      notFound: notFound,
      locationCount: pageData?.data?.locationCount,
      route: page?.layout?.sitecore?.route?.name,
      timestamp: new Date().toISOString(),
    });
  }, [page, notFound]);

  if (notFound || !page) {
    // Shouldn't hit this (as long as 'notFound' is being returned below), but just to be safe
    console.error('[Locations Client] Rendering 404 - notFound:', notFound, 'hasPage:', !!page);
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

export default SitecorePage;
