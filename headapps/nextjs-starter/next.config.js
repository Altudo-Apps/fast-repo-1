const path = require('path');
const SassAlias = require('sass-alias');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Allow specifying a distinct distDir when concurrently running app in a container
  distDir: process.env.NEXTJS_DIST_DIR || '.next',

  // transpilePackages: ['@sitecore-content-sdk/nextjs','@sitecore-content-sdk/core','@sitecore-content-sdk/react','@sitecore-content-sdk/cli'], // adjust to the actual package names
  // experimental: {
  //   externalDir: true,
  // },
  i18n: {
    // These are all the locales you want to support in your application.
    // These should generally match (or at least be a subset of) those in Sitecore.
    locales: ['en','de-DE','fr-CA','ar-AE'],
    // This is the locale that will be used when visiting a non-locale
    // prefixed path e.g. `/about`.
    defaultLocale: process.env.DEFAULT_LANGUAGE || process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
  },

  // Enable React Strict Mode
  reactStrictMode: true,

  // Disable the X-Powered-By header. Follows security best practices.
  poweredByHeader: false,

  // use this configuration to ensure that only images from the whitelisted domains
  // can be served from the Next.js Image Optimization API
  // see https://nextjs.org/docs/app/api-reference/components/image#remotepatterns
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'edge*.**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'xmc-*.**',
        port: '',
      },
      {
        // Allow Unsplash images for Storybook demos
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
      },
    ],
  },

  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          // Prevents browsers from MIME-sniffing responses
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Controls how much referrer information is shared
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Controls which browser features and APIs can be used
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Note: X-Frame-Options is not included as it conflicts with CSP frame-ancestors
          // Modern browsers will use CSP frame-ancestors directive instead
          // Comprehensive Content Security Policy to prevent XSS and other attacks
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Allow scripts from self, Sitecore Cloud, FEaaS, and required third-party services
              // 'unsafe-inline' and 'unsafe-eval' required for Next.js and Sitecore editing
              // YouTube and Vimeo scripts required for video player embeds
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.sitecorecloud.io https://edge.sitecorecloud.io https://edge-platform.sitecorecloud.io https://feaasstatic.blob.core.windows.net https://cdn.cookielaw.org https://geolocation.onetrust.com https://*.bing.com https://*.clarity.ms https://vercel.live https://www.youtube.com https://player.vimeo.com",
              // Allow styles from self, Sitecore Cloud, FEaaS, and Google Fonts
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.sitecorecloud.io https://edge.sitecorecloud.io https://edge-platform.sitecorecloud.io https://feaasstatic.blob.core.windows.net",
              // Allow fonts from self, Google Fonts, Sitecore Cloud, FEaaS, and data URIs
              "font-src 'self' https://fonts.gstatic.com https://*.sitecorecloud.io https://edge.sitecorecloud.io https://edge-platform.sitecorecloud.io https://feaasstatic.blob.core.windows.net data:",
              // Allow images from any HTTPS source (required for Sitecore media library)
              "img-src 'self' data: https: blob:",
              // Allow connections to Sitecore Cloud APIs, FEaaS, Edge GraphQL endpoints, analytics services, Plyr CDN, and noembed for video metadata
              "connect-src 'self' https://*.sitecorecloud.io https://edge.sitecorecloud.io https://edge-platform.sitecorecloud.io https://xmc-*.sitecorecloud.io https://feaasstatic.blob.core.windows.net https://*.bing.com https://*.clarity.ms https://geolocation.onetrust.com https://vercel.live wss://*.pusher.com https://cdn.plyr.io https://noembed.com",
              // Allow iframes from self, Sitecore Cloud editors, YouTube, and Vimeo for video embeds
              "frame-src 'self' https://*.sitecorecloud.io https://vercel.live https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com",
              // Allow media from self, Sitecore Cloud, YouTube, Vimeo, and Plyr CDN
              "media-src 'self' https://*.sitecorecloud.io https://cdn.plyr.io https://www.youtube.com https://player.vimeo.com",
              // Allow web workers from self
              "worker-src 'self' blob:",
              // Block all object/embed/applet tags
              "object-src 'none'",
              // Restrict base tag URLs
              "base-uri 'self'",
              // Restrict form submissions to same origin
              "form-action 'self'",
              // Control which sites can frame this site (for Sitecore editors)
              "frame-ancestors 'self' https://*.sitecorecloud.io",
              // Automatically upgrade insecure requests to HTTPS
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      // healthz check
      {
        source: '/healthz',
        destination: '/api/healthz',
      },
      // robots route
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
      // sitemap route
      {
        source: '/sitemap:id([\\w-]{0,}).xml',
        destination: '/api/sitemap'
      },
      // feaas api route
      {
        source: '/feaas-render',
        destination: '/api/editing/feaas/render',
      },
    ];
  },

  webpack: (config, options) => {
    if (!options.isServer) {
      // Add a loader to strip out getComponentServerProps from components in the client bundle
      config.module.rules.unshift({
        test: /src\\components\\.*\.tsx$/,
        use: ['@sitecore-content-sdk\\nextjs\\component-props-loader'],
      });
    } else {
      // Force use of CommonJS on the server for FEAAS SDK since Content SDK also uses CommonJS entrypoint to FEAAS SDK.
      // This prevents issues arising due to FEAAS SDK's dual CommonJS/ES module support on the server (via conditional exports).
      // See https://nodejs.org/api/packages.html#dual-package-hazard.
      config.externals = [
        {
          '@sitecore-feaas/clientside/react': 'commonjs @sitecore-feaas/clientside/react',
          '@sitecore/byoc': 'commonjs @sitecore/byoc',
          '@sitecore/byoc/react': 'commonjs @sitecore/byoc/react',
        },
        ...config.externals,
      ];
    }
    // config.resolve.alias['@sitecore-content-sdk/nextjs'] =
    //   path.resolve('C:/code/sitecore/content-sdk/packages/nextjs/src');
    // config.resolve.alias['@sitecore-content-sdk/react'] =
    //   path.resolve('C:/code/sitecore/content-sdk/packages/react/src');
    // config.resolve.alias['@sitecore-content-sdk/core'] =
    //   path.resolve('C:/code/sitecore/content-sdk/packages/core/src');
    // config.resolve.alias['@sitecore-content-sdk/cli'] =
    //   path.resolve('C:/code/sitecore/content-sdk/packages/cli/src');

    return config;
  },

  // Add sass settings for SXA themes and styles
  sassOptions: {
    importer: new SassAlias({
      '@globals': path.join(process.cwd(), './src/assets', 'globals'),
      '@sass': path.join(process.cwd(), './src/assets', 'sass'),
      '@fontawesome': path.join(process.cwd(), './node_modules', 'font-awesome'),
    }).getImporter(),
    // temporary measure until new versions of bootstrap and font-awesome released
    quietDeps: true,    
    silenceDeprecations: ["import", "legacy-js-api"],
  },
};

module.exports = nextConfig;
