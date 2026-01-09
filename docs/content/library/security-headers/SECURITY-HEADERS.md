# Security Headers Documentation

This document explains the security headers implemented in `next.config.js` for the Next.js Sitecore application.

## Overview

Security headers are configured in the `headers()` function in `next.config.js` and are applied to all routes (`/:path*`). These headers provide multiple layers of protection against common web vulnerabilities including XSS attacks, clickjacking, MIME-sniffing, and more.

## Headers Configuration

### 1. X-Content-Type-Options

```javascript
{
  key: 'X-Content-Type-Options',
  value: 'nosniff',
}
```

**Purpose:** Prevents browsers from MIME-sniffing responses away from the declared content-type.

**Why it matters:** Without this header, browsers might try to "guess" the content type of a file, which can lead to security vulnerabilities. For example, a browser might execute a text file as JavaScript if it looks like JavaScript.

**Value:** `nosniff` is the only valid value for this header.

### 2. Referrer-Policy

```javascript
{
  key: 'Referrer-Policy',
  value: 'strict-origin-when-cross-origin',
}
```

**Purpose:** Controls how much referrer information is shared when navigating away from your site.

**Why it matters:** Protects user privacy and prevents sensitive information in URLs from leaking to third parties.

**Value explanation:**
- **Same-origin requests:** Sends the full URL as referrer
- **Cross-origin requests (HTTPS → HTTPS):** Sends only the origin (scheme, host, and port)
- **Cross-origin requests (HTTPS → HTTP):** Sends no referrer (downgrade protection)

### 3. Permissions-Policy

```javascript
{
  key: 'Permissions-Policy',
  value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
}
```

**Purpose:** Controls which browser features and APIs can be used on your site.

**Why it matters:** Prevents unauthorized access to sensitive device features and protects user privacy.

**Disabled features:**
- `camera=()` - Blocks camera access
- `microphone=()` - Blocks microphone access
- `geolocation=()` - Blocks geolocation access
- `interest-cohort=()` - Opts out of FLoC (Federated Learning of Cohorts) tracking

### 4. Content Security Policy (CSP)

```javascript
{
  key: 'Content-Security-Policy',
  value: [/* directives */].join('; '),
}
```

**Purpose:** The most powerful security header - provides granular control over which resources can be loaded and executed.

**Why it matters:** CSP is the primary defense against Cross-Site Scripting (XSS) attacks, data injection attacks, and other code injection vulnerabilities.

## Content Security Policy Directives

### default-src 'self'

**Base directive:** All other directives inherit from this if not explicitly set.
- Allows resources only from the same origin

### script-src

```
'self' 'unsafe-inline' 'unsafe-eval' 
https://*.sitecorecloud.io 
https://feaasstatic.blob.core.windows.net 
https://cdn.cookielaw.org 
https://geolocation.onetrust.com 
https://*.bing.com 
https://*.clarity.ms 
https://vercel.live
```

**Controls:** Which scripts can be executed

**Allowed sources:**
- `'self'` - Scripts from your own domain
- `'unsafe-inline'` - Inline scripts (required for Next.js and Sitecore editing features)
- `'unsafe-eval'` - eval() and similar functions (required for Next.js development and Sitecore)
- `https://*.sitecorecloud.io` - Sitecore Cloud services and editors
- `https://feaasstatic.blob.core.windows.net` - Sitecore FEaaS (Frontend as a Service)
- `https://cdn.cookielaw.org` - OneTrust cookie consent
- `https://geolocation.onetrust.com` - OneTrust geolocation services
- `https://*.bing.com` - Bing services (if used for search/analytics)
- `https://*.clarity.ms` - Microsoft Clarity analytics
- `https://vercel.live` - Vercel Live collaboration features

**⚠️ Security Note:** `'unsafe-inline'` and `'unsafe-eval'` reduce CSP effectiveness but are currently required for Next.js and Sitecore editing functionality. Consider implementing nonces or hashes for inline scripts in production if possible.

### style-src

```
'self' 'unsafe-inline' 
https://fonts.googleapis.com 
https://*.sitecorecloud.io 
https://feaasstatic.blob.core.windows.net
```

**Controls:** Which stylesheets can be loaded

**Allowed sources:**
- `'self'` - Styles from your own domain
- `'unsafe-inline'` - Inline styles (required for styled-jsx and dynamic styling)
- `https://fonts.googleapis.com` - Google Fonts CSS
- `https://*.sitecorecloud.io` - Sitecore Cloud styles
- `https://feaasstatic.blob.core.windows.net` - FEaaS styles

### font-src

```
'self' 
https://fonts.gstatic.com 
https://*.sitecorecloud.io 
https://feaasstatic.blob.core.windows.net 
data:
```

**Controls:** Which fonts can be loaded

**Allowed sources:**
- `'self'` - Fonts from your own domain
- `https://fonts.gstatic.com` - Google Fonts files
- `https://*.sitecorecloud.io` - Sitecore Cloud fonts
- `https://feaasstatic.blob.core.windows.net` - FEaaS fonts
- `data:` - Data URIs for inline fonts

### img-src

```
'self' data: https: blob:
```

**Controls:** Which images can be loaded

**Allowed sources:**
- `'self'` - Images from your own domain
- `data:` - Data URIs (inline images)
- `https:` - Any HTTPS source (required for Sitecore media library flexibility)
- `blob:` - Blob URLs (for dynamically generated images)

**Note:** `https:` is permissive but necessary for Sitecore's flexible media library that can serve images from various CDNs.

### connect-src

```
'self' 
https://*.sitecorecloud.io 
https://feaasstatic.blob.core.windows.net 
https://*.bing.com 
https://*.clarity.ms 
https://geolocation.onetrust.com 
https://vercel.live 
wss://*.pusher.com
```

**Controls:** Which URLs can be loaded using fetch, XMLHttpRequest, WebSocket, and EventSource

**Allowed sources:**
- `'self'` - API calls to your own domain
- `https://*.sitecorecloud.io` - Sitecore Cloud APIs
- `https://feaasstatic.blob.core.windows.net` - FEaaS APIs
- `https://*.bing.com` - Bing APIs
- `https://*.clarity.ms` - Microsoft Clarity analytics
- `https://geolocation.onetrust.com` - OneTrust geolocation
- `https://vercel.live` - Vercel Live API calls
- `wss://*.pusher.com` - WebSocket connections for Vercel Live real-time features

### frame-src

```
'self' 
https://*.sitecorecloud.io 
https://vercel.live
```

**Controls:** Which URLs can be loaded in iframes

**Allowed sources:**
- `'self'` - Iframes from your own domain
- `https://*.sitecorecloud.io` - Sitecore editing interfaces and previews
- `https://vercel.live` - Vercel Live collaboration iframe

**Note:** X-Frame-Options header is intentionally NOT included as it conflicts with CSP's `frame-ancestors` directive. Modern browsers will use the CSP directive instead.

### media-src

```
'self' 
https://*.sitecorecloud.io
```

**Controls:** Which audio and video sources can be loaded

**Allowed sources:**
- `'self'` - Media from your own domain
- `https://*.sitecorecloud.io` - Sitecore Cloud media files

### worker-src

```
'self' blob:
```

**Controls:** Which URLs can be loaded as web workers, shared workers, or service workers

**Allowed sources:**
- `'self'` - Workers from your own domain
- `blob:` - Blob URLs for dynamically generated workers

### object-src

```
'none'
```

**Controls:** Loading of plugins like Flash, Java applets, etc.

**Value:** `'none'` - Completely blocks all plugins for security

### base-uri

```
'self'
```

**Controls:** Which URLs can be used in a document's `<base>` element

**Value:** `'self'` - Prevents attackers from changing base URLs

### form-action

```
'self'
```

**Controls:** Which URLs can be used as form submission targets

**Value:** `'self'` - Forms can only submit to your own domain

### frame-ancestors

```
'self' 
https://*.sitecorecloud.io
```

**Controls:** Which sites can embed this site in an iframe (reverse of frame-src)

**Allowed sources:**
- `'self'` - Your site can iframe itself
- `https://*.sitecorecloud.io` - Sitecore editors can iframe your site

**Why it matters:** This is the modern replacement for X-Frame-Options, protecting against clickjacking attacks.

### upgrade-insecure-requests

```
upgrade-insecure-requests
```

**Purpose:** Automatically upgrades HTTP requests to HTTPS

**Why it matters:** Ensures all resources are loaded securely, even if referenced with HTTP URLs in the code.

## Maintenance and Updates

### Adding a New Third-Party Service

When integrating a new third-party service (analytics, chat widget, etc.), you'll likely need to update CSP directives:

1. **Identify required resources** - Check the service documentation or browser console for CSP violations
2. **Update appropriate directives:**
   - Scripts → add to `script-src`
   - Styles → add to `style-src`
   - API calls → add to `connect-src`
   - Iframes → add to `frame-src`
   - Images → usually covered by `https:` in `img-src`

3. **Test thoroughly** - Check browser console for violations after deployment
4. **Document the change** - Update this file with the new service and its purpose

### Example: Adding a New Analytics Service

```javascript
// If adding Google Analytics:
"script-src '...' https://www.googletagmanager.com https://www.google-analytics.com",
"connect-src '...' https://www.google-analytics.com",
"img-src '...' https://www.google-analytics.com",
```

## Troubleshooting

### Common CSP Violations

**Error:** `Refused to load the script '[URL]' because it violates the following Content Security Policy directive: "script-src ..."`

**Solution:** Add the domain to the `script-src` directive in `next.config.js`

**Error:** `Refused to connect to '[URL]' because it violates the following Content Security Policy directive: "connect-src ..."`

**Solution:** Add the domain (or WebSocket URL with `wss://`) to the `connect-src` directive

**Error:** `Refused to frame '[URL]' because it violates the following Content Security Policy directive: "frame-src ..."`

**Solution:** Add the domain to the `frame-src` directive

### Changes Not Taking Effect

**Issue:** Updated CSP but still seeing violations

**Solutions:**
1. **Restart the development server** - Next.js loads config on startup
2. **Clear browser cache** - Old headers may be cached
3. **Hard refresh** - Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
4. **Verify deployment** - Ensure changes are deployed to production/preview

### Testing CSP Changes

1. **Local development:**
   ```bash
   npm run dev
   ```
   Open browser DevTools → Console tab → Look for CSP violations

2. **Production testing:**
   - Use [securityheaders.com](https://securityheaders.com)
   - Use [csp-evaluator.withgoogle.com](https://csp-evaluator.withgoogle.com)
   - Check browser console on deployed site

## Security Best Practices

### Current Implementation Status

✅ **Implemented:**
- Comprehensive CSP covering all major directives
- X-Content-Type-Options set to nosniff
- Referrer-Policy for privacy protection
- Permissions-Policy restricting sensitive APIs
- frame-ancestors preventing clickjacking
- upgrade-insecure-requests for HTTPS enforcement

⚠️ **Considerations:**
- `'unsafe-inline'` and `'unsafe-eval'` in script-src (required for Next.js/Sitecore but reduces security)
- Permissive `https:` in img-src (required for Sitecore media flexibility)

### Future Improvements

**For Production Sites:**

1. **Implement CSP nonces** for inline scripts instead of `'unsafe-inline'`
   ```javascript
   // Generate nonce per request
   const nonce = crypto.randomBytes(16).toString('base64');
   "script-src 'self' 'nonce-${nonce}'"
   ```

2. **Remove 'unsafe-eval'** if possible by:
   - Avoiding eval() in custom code
   - Checking if Next.js/Sitecore work without it in production mode

3. **Restrict img-src** if media sources are known:
   ```javascript
   "img-src 'self' data: blob: https://cdn.yourdomain.com https://media.sitecorecloud.io"
   ```

4. **Add report-uri or report-to** for monitoring violations:
   ```javascript
   "report-uri /api/csp-report"
   ```

5. **Implement Subresource Integrity (SRI)** for third-party scripts:
   ```html
   <script src="https://..." integrity="sha384-..." crossorigin="anonymous"></script>
   ```

## Additional Resources

- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [MDN: Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Security Headers Checker](https://securityheaders.com/)
- [OWASP: Content Security Policy Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)
- [Next.js: Security Headers](https://nextjs.org/docs/advanced-features/security-headers)

## Version History

### Latest (October 2024)
- Added Vercel Live support: `https://vercel.live` in script-src, connect-src, frame-src
- Added Pusher WebSocket support: `wss://*.pusher.com` in connect-src

### Initial Implementation
- Comprehensive CSP implementation for Sitecore XM Cloud
- All standard security headers configured
- Support for Sitecore Cloud, FEaaS, OneTrust, and analytics services


