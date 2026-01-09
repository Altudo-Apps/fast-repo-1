# Prompt: Implement Comprehensive Security Headers for Next.js

## Context
I need to implement comprehensive security headers for a Next.js application that integrates with Sitecore XM Cloud, FEaaS (Frontend as a Service), and various third-party services. The implementation should follow security best practices while maintaining compatibility with required services.

## Requirements

### 1. Security Headers to Implement
Implement the following security headers in `next.config.js`:

- **X-Content-Type-Options**: Prevent MIME-sniffing
- **Referrer-Policy**: Control referrer information sharing
- **Permissions-Policy**: Restrict browser features and APIs
- **Content-Security-Policy**: Comprehensive CSP to prevent XSS and code injection attacks

### 2. Third-Party Services to Support
The implementation must allow the following services:

**Sitecore & CMS:**
- Sitecore XM Cloud (`https://*.sitecorecloud.io`)
- FEaaS (`https://feaasstatic.blob.core.windows.net`)

**Consent & Privacy:**
- OneTrust Cookie Consent (`https://cdn.cookielaw.org`)
- OneTrust Geolocation (`https://geolocation.onetrust.com`)

**Analytics:**
- Microsoft Clarity (`https://*.clarity.ms`)
- Bing Services (`https://*.bing.com`)

**Development & Collaboration:**
- Vercel Live (`https://vercel.live`)
- Pusher WebSockets for real-time features (`wss://*.pusher.com`)

**Fonts & Styling:**
- Google Fonts (`https://fonts.googleapis.com`, `https://fonts.gstatic.com`)

### 3. Content Security Policy Directives

Implement a comprehensive CSP with the following directives:

**Base Configuration:**
- `default-src 'self'` - Restrict to same origin by default

**Script Sources:**
- Allow scripts from self, with inline and eval support (required for Next.js and Sitecore)
- Include all third-party script sources listed above

**Style Sources:**
- Allow styles from self with inline support
- Include Google Fonts and Sitecore sources

**Font Sources:**
- Allow fonts from self, Google Fonts, Sitecore, and data URIs

**Image Sources:**
- Allow images from self, data URIs, all HTTPS sources, and blob URLs
- (Permissive for Sitecore media library flexibility)

**Connection Sources:**
- Allow connections to self and all third-party APIs
- Include WebSocket connections for real-time features

**Frame Sources:**
- Allow iframes from self, Sitecore (for editing), and Vercel Live

**Media Sources:**
- Allow media from self and Sitecore

**Worker Sources:**
- Allow web workers from self and blob URLs

**Additional Directives:**
- Block all plugins (`object-src 'none'`)
- Restrict base URLs (`base-uri 'self'`)
- Restrict form actions (`form-action 'self'`)
- Control iframe embedding (`frame-ancestors 'self' https://*.sitecorecloud.io`)
- Automatically upgrade HTTP to HTTPS (`upgrade-insecure-requests`)

### 4. Implementation Details

**Configuration Location:**
- Implement in `next.config.js` using the `async headers()` function
- Apply to all routes using `source: '/:path*'`

**Code Quality:**
- Add clear comments explaining each header and directive
- Group related directives together
- Format for readability
- Use array join for CSP string construction

**Security Considerations:**
- Document why `'unsafe-inline'` and `'unsafe-eval'` are necessary
- Note that X-Frame-Options is intentionally omitted (conflicts with CSP frame-ancestors)
- Explain permissive `https:` in img-src

### 5. Documentation

Create comprehensive documentation (`SECURITY-HEADERS.md`) that includes:

**For Each Header:**
- Purpose and why it matters
- Value explanation
- Security implications

**For Each CSP Directive:**
- What it controls
- Allowed sources and why
- Security notes

**Maintenance Guide:**
- How to add new third-party services
- Example configurations
- Testing procedures

**Troubleshooting Section:**
- Common CSP violations and solutions
- How to verify changes take effect
- Testing tools and resources

**Best Practices:**
- Current implementation status
- Security considerations
- Future improvement recommendations

**Additional Resources:**
- Links to MDN, OWASP, security testing tools
- Next.js documentation references

### 6. Testing Requirements

After implementation, verify:
1. No CSP violations in browser console for normal operations
2. Sitecore editing experience works correctly
3. All third-party services load successfully
4. Security headers are present in HTTP response (use securityheaders.com)
5. Development and production environments both work

### 7. Specific Edge Cases to Handle

**Vercel Live Support:**
- Must allow scripts from `https://vercel.live`
- Must allow WebSocket connections to `wss://*.pusher.com`
- Must allow iframes from `https://vercel.live`
- Must allow API connections to `https://vercel.live`

**Sitecore Editing:**
- Must allow Sitecore domains to iframe your site
- Must support inline scripts and eval (editing interface requirement)
- Must allow dynamic image sources

**Next.js Requirements:**
- Support for inline styles (styled-jsx)
- Support for dynamic imports
- Support for web workers
- Support for development hot reload

## Expected Deliverables

1. **Updated `next.config.js`** with complete security headers implementation
2. **Comprehensive documentation** (`SECURITY-HEADERS.md`) explaining all headers and directives
3. **Testing verification** that all functionality works without CSP violations
4. **Comments in code** explaining security decisions

## Success Criteria

✅ All security headers properly configured in `next.config.js`  
✅ No CSP violations for legitimate operations  
✅ Sitecore editing interface functions correctly  
✅ All third-party services load successfully  
✅ Security scan shows all headers present  
✅ Documentation is comprehensive and maintainable  
✅ Code includes helpful comments  
✅ Both development and production environments work  

## Example Starting Point

```javascript
// next.config.js
const nextConfig = {
  // ... other config
  
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // ... implement remaining headers
        ],
      },
    ];
  },
};
```

## Important Notes

- **Security vs. Functionality**: This implementation balances security with the practical needs of a Sitecore CMS and modern development tools. Some directives (like `'unsafe-inline'` and `'unsafe-eval'`) reduce security but are currently required.

- **Restart Required**: After modifying `next.config.js`, restart the development server for changes to take effect.

- **Production Considerations**: Consider implementing CSP nonces for inline scripts in production for enhanced security.

- **Maintenance**: Document all third-party services added in the future and update CSP accordingly.

## Additional Context

This is for a production-grade Sitecore XM Cloud application using Next.js. The security headers must not break:
- Sitecore Experience Editor
- Sitecore Pages editor
- FEaaS components
- Third-party analytics and consent tools
- Development tools like Vercel Live
- Next.js development features (hot reload, etc.)

## Questions to Address

While implementing, ensure these are answered in documentation:
1. Why is each third-party domain allowed?
2. What would break if we removed `'unsafe-inline'` or `'unsafe-eval'`?
3. How do we test CSP changes before deploying?
4. How do we add new third-party services safely?
5. What are the next steps to improve security further?


