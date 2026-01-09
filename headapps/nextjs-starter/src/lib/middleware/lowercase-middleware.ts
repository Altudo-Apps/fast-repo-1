import { Middleware } from '@sitecore-content-sdk/nextjs/middleware';
import createDebug from 'debug';

const debug = createDebug('fastlane:lowercase');

/**
 * Middleware to redirect URLs with uppercase characters to their lowercase equivalent
 */
export class LowercaseMiddleware extends Middleware {
  // @ts-expect-error - Type incompatibility due to different Next.js versions in node_modules
  override async handle(req, res) {
    const pathname = req.nextUrl.pathname;
    const lowercasedPathname = pathname.toLowerCase();

    // Skip lowercase redirect if in Sitecore editing/preview mode
    // Next.js preview mode is indicated by __prerender_bypass cookie
    const isPreviewMode =
      req.cookies.has('__prerender_bypass') || req.cookies.has('__next_preview_data');

    // Skip for blog paths to preserve original case for content pages
    // This matches /blogs, /blogs/, and any path starting with /blogs/
    const isBlogPath = /^\/(blogs|Blogs)(\/|$)/i.test(pathname);

    console.log(
      `OOO LCM: pathname: ${pathname}, lowercasedPathname: ${lowercasedPathname}, compare: ${
        pathname !== lowercasedPathname
      }, isPreviewMode: ${isPreviewMode}, isBlogPath: ${isBlogPath}`
    );

    // Skip lowercase redirect if:
    // 1. In preview/editing mode (Page Builder)
    // 2. Path is a blog path
    if (isBlogPath) {
      //debug('skipping lowercase redirect (preview mode: %s, blog path: %s): %s', isPreviewMode, isBlogPath, pathname);
      return res;
    }

    // If the pathname contains uppercase characters, redirect to lowercase version
    if (pathname !== lowercasedPathname) {
      debug('redirecting: %s -> %s', pathname, lowercasedPathname);

      const url = req.nextUrl.clone();
      url.pathname = lowercasedPathname;

      // Use 301 permanent redirect to indicate this is the canonical URL
      return res.constructor.redirect(url, 301);
    }

    debug('no redirect needed for: %s', pathname);

    // No uppercase characters, continue with the response
    return res;
  }
}
