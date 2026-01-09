/**
 * This Layout is needed for Starter Kit.
 */
import React, { JSX } from 'react';
import Head from 'next/head';
import { Placeholder, Field, DesignLibrary, Page } from '@sitecore-content-sdk/nextjs';
import Scripts from 'src/Scripts';
import { cn } from './core/lib/utils';
import SkipToContent from './core/atom/SkipToContent';
import HeaderSearch from './core/molecules/NavigationItem/HeaderSearch';

interface LayoutProps {
  page: Page;
}

interface RouteFields {
  [key: string]: unknown;
  Title?: Field;
  MetaTitle?: Field;
  MetaDescription?: Field;
  MetaKeywords?: Field;
  MetaImage?: {
    value: {
      src: string;
      alt?: string;
      width?: number;
      height?: number;
    };
  };
}

const Layout = ({ page }: LayoutProps): JSX.Element => {
  const { layout, mode } = page;
  const { route } = layout.sitecore;
  const fields = route?.fields as RouteFields;
  const mainClassPageEditing = mode.isEditing ? 'editing-mode' : 'prod-mode';
  const importMapDynamic = () => import('.sitecore/import-map');

  // Extract metadata from fields with fallbacks
  const metaTitle =
    fields?.MetaTitle?.value?.toString() || fields?.Title?.value?.toString() || 'Page';
  const metaDescription = fields?.MetaDescription?.value?.toString() || '';
  const metaKeywords = fields?.MetaKeywords?.value?.toString() || '';
  const metaImageSrc = fields?.MetaImage?.value?.src || '';
  const metaImageUrl = metaImageSrc ?? '';

  // Use route.name which typically contains the path in Sitecore JSS
  // If that's not available, default to an empty string
  const routePath = route?.name || '';
  const canonicalUrl = routePath;
  const isEditing = mode.isEditing;

  return (
    <>
      <Scripts />
      <Head>
        {/* Basic Metadata */}
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <link rel="icon" href={`/favicon.ico`} />

        {/* Open Graph / Social Media Metadata */}
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        {metaImageUrl && <meta property="og:image" content={metaImageUrl} />}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />

        {/* Twitter Card Metadata */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {metaImageUrl && <meta name="twitter:image" content={metaImageUrl} />}

        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
      </Head>

      {/* root placeholder for the app, which we add components to using route data */}
      <div className={mainClassPageEditing}>
        <SkipToContent targetId="main-content" />
        {mode.isDesignLibrary ? (
          <DesignLibrary loadImportMap={importMapDynamic} />
        ) : (
          <div className="flex flex-col min-h-screen">
            <header>
              <div
                id="header"
                className={cn(
                  'shadow-xs bg-slate [&_img]:h-20 [&_img]:relative [&_img]:z-50 [&_img]:w-full [&_img]:object-contain max-md:[&_.row]:flex-row md:[&_.row]:justify-end md:[&_.row]:items-center [&_a]:text-primary [&_a]:no-underline [&_ul>li:last-child>ul]:left-auto [&_ul>li:last-child>ul]:right-0 [&_ul>li:nth-last-child(2)>ul]:left-auto [&_ul>li:nth-last-child(2)>ul]:right-0 [&_a:hover>div]:text-primary [&_a>div]:opacity-80 [&_a>div]:no-underline [&_a>div>img]:max-w-4 [&_.underline]:px-3 [&_.underline]:py-2 md:relative',
                  isEditing ? 'h-40' : 'h-137'
                )}
              >
                <HeaderSearch />
                {route && <Placeholder name="headless-header" rendering={route} />}
              </div>
            </header>
            <main className="grow" id="main-content" tabIndex={-1}>
              <div id="content">
                {route && <Placeholder name="headless-main" rendering={route} />}
              </div>
            </main>
            <footer>
              <div
                id="footer"
                className="[&_div.row]:py-2 bg-foreground text-background [&_ul]:list-disc"
              >
                {route && <Placeholder name="headless-footer" rendering={route} />}
              </div>
            </footer>
          </div>
        )}
      </div>
    </>
  );
};

export default Layout;
