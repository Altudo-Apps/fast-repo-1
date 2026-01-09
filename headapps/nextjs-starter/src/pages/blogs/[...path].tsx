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
import type { LayoutServiceData } from '@sitecore-content-sdk/core/layout';
import { useEffect, JSX } from 'react';
import NotFound from 'src/NotFound';
import Layout from 'src/Layout';
import scConfig from 'sitecore.config';
import {
  createGraphQLClientFactory,
  GraphQLRequestClient,
} from '@sitecore-content-sdk/nextjs/client';

interface ExtendedParams {
  requestPath?: string[];
  path?: string[];
}

interface GraphQLRenderedSearchResults {
  search?: {
    results?: Array<{
      rendered?: LayoutServiceData;
    }>;
  };
}

const BLOG_ITEM_BY_NAME_QUERY = /* GraphQL */ `
  query BlogItemByName($name: String!) {
    search(where: { name: "_name", operator: EQ, value: $name }) {
      results {
        rendered
      }
    }
  }
`;

export const getStaticPaths: GetStaticPaths = async () => {
  // For blogs, we'll use blocking fallback to generate pages on first request
  // This speeds up build time and allows for dynamic blog content
  const paths: StaticPath[] = [];
  const fallback: boolean | 'blocking' = 'blocking';
  return {
    paths,
    fallback,
  };
};

export const getGraphQlClient = (): GraphQLRequestClient => {
  const apiKey = getGraphQlKey();

  return new GraphQLRequestClient(scConfig.api.edge.edgeUrl, {
    apiKey: apiKey,
  });
};

const clientFactory = createGraphQLClientFactory({
  api: scConfig.api,
  retries: scConfig.retries.count,
  retryStrategy: scConfig.retries.retryStrategy,
});

const graphQLClient = clientFactory();

export const getGraphQlKey = (): string => {
  return scConfig.api.edge.contextId;
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
  // Determine slug from final segment; preserve the original URL path (no redirects)
  const params = (context.params || {}) as ExtendedParams;
  const segments = Array.isArray(params.path) ? params.path : [];
  const blogSlug = segments.length > 0 ? segments[segments.length - 1] : '';
  // Convert URL slug to item name format: Sitecore converts spaces to hyphens in URLs
  // We need to reverse this conversion. Sitecore's GraphQL search is case-insensitive,
  // so we just replace hyphens with spaces
  const blogName = blogSlug.replace(/-/g, ' ');

  // if (segments.length > 1) {
  //   return {
  //     redirect: {
  //       destination: `/blogs/${blogName}`,
  //       permanent: false,
  //     },
  //   };
  // }

  type PageLike = {
    siteName: string;
    locale: string;
    layout: LayoutServiceData;
    mode: {
      isEditing: boolean;
      isDesignLibrary: boolean;
      isPreview: boolean;
      isNormal: boolean;
    };
  };
  let page: PageLike | null = null;
  let props: Record<string, unknown> = {};

  try {
    if (blogName) {
      const result = (await graphQLClient.request(BLOG_ITEM_BY_NAME_QUERY, {
        name: blogName,
      })) as GraphQLRenderedSearchResults;

      const rendered = result?.search?.results?.[0]?.rendered;
      if (rendered && rendered.sitecore) {
        page = {
          siteName: 'fastlanewebsite',
          locale: context.locale || 'en',
          layout: rendered,
          mode: {
            isEditing: false,
            isDesignLibrary: false,
            isPreview: !!context.preview,
            isNormal: !context.preview,
          },
        };
      }
    }
  } catch (error) {
    console.error('Error fetching blog via GraphQL:', error);
  }

  // Fallback: If no blog found from GraphQL, use 404 page fetch for EE/preview support
  if (!page) {
    if (context.params && Array.isArray((context.params as ExtendedParams).path)) {
      (context.params as ExtendedParams).requestPath = (context.params as ExtendedParams).path;
      (context.params as ExtendedParams).path = ['404'];
    }

    const path = extractPath(context);

    if (context.preview && isDesignLibraryPreviewData(context.previewData)) {
      page = (await client.getDesignLibraryData(context.previewData)) as unknown as PageLike;
    } else {
      page = (context.preview
        ? await client.getPreview(context.previewData)
        : await client.getPage(path, { locale: context.locale })) as unknown as PageLike;
    }
  }

  if (page) {
    props = {
      page,
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
