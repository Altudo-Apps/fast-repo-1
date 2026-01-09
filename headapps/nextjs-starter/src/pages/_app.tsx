import { JSX, useEffect } from 'react';
import type { AppProps } from 'next/app';
import { I18nProvider } from 'next-localization';
import Bootstrap from 'src/Bootstrap';
import { SitecorePageProps } from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ThemeProvider } from 'src/core/context/ThemeContext';
import { PageController, WidgetsProvider } from '@sitecore-search/react';
import 'style/main.css';
import { useRouter } from 'next/router';
// import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

const satoshi = localFont({
  src: [
    {
      path: '../fonts/Satoshi-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Satoshi-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/Satoshi-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
});

const zodiak = localFont({
  src: [
    {
      path: '../fonts/Zodiak-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Zodiak-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/Zodiak-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-zodiak',
  display: 'swap',
});

// const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '700', '900'] }); // Add desired weights

function App({ Component, pageProps }: AppProps<SitecorePageProps>): JSX.Element | null {
  const { dictionary, ...rest } = pageProps;
  const router = useRouter();

  // Sitecore Search configuration
  const customerKey = process.env.NEXT_PUBLIC_CUSTOMER_KEY || '';
  const apiKey = process.env.NEXT_PUBLIC_SITECORE_SEARCH_API_KEY || '';
  const discoverDomainId = process.env.NEXT_PUBLIC_DISCOVER_DOMAIN_ID || '';

  // Update PageController context when locale changes
  useEffect(() => {
    const locale = router.locale || 'en-US';

    // Parse locale (e.g., 'en-US', 'ar-AE', 'fr-CA') into language and country
    const localeParts = locale.toLowerCase().split('-');
    const language = localeParts[0] || 'en'; // e.g., 'en', 'ar', 'fr'
    const country = localeParts[1] || 'us'; // e.g., 'us', 'ae', 'ca'

    // Update Sitecore Search PageController context
    PageController.getContext().setLocaleLanguage(language);
    PageController.getContext().setLocaleCountry(country);
  }, [router.locale]);

  const appContent = (
    <div className={`${satoshi.variable} ${zodiak.variable}`}>
      <Bootstrap {...pageProps} />
      {/*
      // Use the next-localization (w/ rosetta) library to provide our translation dictionary to the app.
        // Note Next.js does not (currently) provide anything for translation, only i18n routing.
        // If your app is not multilingual, next-localization and references to it can be removed.
      */}
      <I18nProvider
        lngDict={dictionary}
        locale={pageProps.page?.locale || scConfig.defaultLanguage}
      >
        <ThemeProvider>
          <Component {...rest} />
        </ThemeProvider>
      </I18nProvider>
    </div>
  );

  // Only wrap with WidgetsProvider if all required values are present
  if (customerKey && apiKey && discoverDomainId) {
    return (
      <WidgetsProvider
        env="prod"
        customerKey={customerKey}
        apiKey={apiKey}
        discoverDomainId={discoverDomainId}
      >
        {appContent}
      </WidgetsProvider>
    );
  }

  // Return app without WidgetsProvider if search is not configured
  return appContent;
}

export default App;
