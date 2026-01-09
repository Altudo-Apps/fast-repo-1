# Sitecore Search Source Configuration

This document provides step-by-step instructions for configuring the Sitecore Search source from the Sitecore Search Console (backend) side. Follow these steps to create and configure the "Fastlane Search" source with the Web Crawler (Advanced) option.

## Prerequisites

- Access to the Sitecore Search Console
- Admin or appropriate permissions to create and manage sources
- The target website (e.g., `xmc-fast-lane.vercel.app`) should be deployed and accessible

---

## Step 1: Create a New Source

1. Navigate to **Sitecore Search Console** → **Sources**
2. Click **+ Add Source**
3. Select **Web Crawler (Advanced)** as the source type
4. Enter the source name: `Fastlane Search`
5. Set the External ID: `fastlane_search`

---

## Step 2: Configure Web Crawler Settings

### Allowed Domains

Add the domains that the crawler is permitted to index:

| Setting | Value |
|---------|-------|
| **Allowed Domain** | `xmc-fast-lane.vercel.app` |

> **Note**: Click **+ Add Allowed Domain** to add additional domains if needed.

### Crawler Limits

Configure the crawler's depth and URL limits:

| Setting | Value | Description |
|---------|-------|-------------|
| **Max Depth** | `0` | Depth of pages to crawl from the start URL (0 = start page only, no following links) |
| **Max URLs** | `1000` | Maximum number of URLs to crawl |

![Web Crawler Settings](/images/search-source/sitecore-search-webcrawler-settings.png)

### Exclusion Patterns

Configure glob expression patterns to exclude specific URLs from indexing:

| Pattern Type | Pattern | Description |
|--------------|---------|-------------|
| Glob Expression | `*facebook.com` | Exclude all Facebook links |
| Glob Expression | `www.sitecore.com/*` | Exclude all Sitecore.com pages |
| Glob Expression | `blogs/blogarticles/i/*` | Exclude blog articles with 'i' pattern |
| Glob Expression | `blogs/blogarticles/d/*` | Exclude blog articles with 'd' pattern |
| Glob Expression | `blogs/blogarticles/s/*` | Exclude blog articles with 's' pattern |
| Glob Expression | `**/-w-*` | Exclude URLs containing '-w-' pattern |

> **Tip**: Click **+ Add Exclusion Pattern** to add more patterns as needed.

### Performance Settings

Configure crawler performance parameters:

| Setting | Value | Description |
|---------|-------|-------------|
| **Parallelism (Workers)** | `3` | Number of concurrent crawl workers |
| **Delay (MS)** | `0` | Delay between requests in milliseconds |

![Exclusion Patterns and Performance Settings](/images/search-source/sitecore-search-exclusion-pattern.png)

---

## Step 3: Configure Available Locales

The system supports the following locales. Configure them based on your website's language requirements:

| Locale Code | Language |
|-------------|----------|
| `en_us` | English (US) - Default |
| `ar_ae` | Arabic (UAE) |
| `fr_ca` | French (Canada) |

![Available Locales Configuration](/images/search-source/sitecore-search-available-locale.png)

---

## Step 4: Configure Tags Definition

Define tags for content categorization:

### Tag Configuration

| Field | Value |
|-------|-------|
| **Entity** | `content` |
| **From** | `Tags` |
| **Tags** | `content` |

> **Note**: Click **+ Add Tag** to define additional tags for different content types.

![Tags Definition Configuration](/images/search-source/sitecore-search-tags-definition.png)

---

## Step 5: Configure Triggers

Triggers define how and when the crawler should run. Configure sitemap-based triggers for efficient crawling.

### Sitemap Trigger Configuration

1. Navigate to **Triggers**
2. Click **+ Add Trigger**
3. Configure the following settings:

| Field | Value | Description |
|-------|-------|-------------|
| **Trigger Type** | `Sitemap` | Uses sitemap.xml to discover URLs |
| **Timeout** | `1000` | Request timeout in milliseconds |
| **Urls** | `https://xmc-fast-lane.vercel.app/sitemap.xml` | Sitemap URL(s) to crawl |

> **Tip**: Click **+ Add Item** to add additional sitemap URLs if your site has multiple sitemaps.

![Triggers Configuration](/images/search-source/sitecore-search-triggers.png)

---

## Step 6: Configure Document Extractors

### Create Default Document Extractor

1. Navigate to **Document Extractors**
2. Click **+ Add Extractor**
3. Configure the following settings:

| Field | Value |
|-------|-------|
| **Name** | `Sitecore Default Document Extractor` |
| **Extractor Type** | `JS` |
| **URLs to Match** | *(No matchers - applies to all URLs)* |

### Configure Taggers

Add the following tagger:

| TAG |
|-----|
| `content` |

![Document Extractors Configuration](/images/search-source/sitecore-search-document-extractors.png)

### JS Source Code for Extracting Content

```javascript
// Sample extractor function. Change the function to suit your individual needs
function extract(request, response) {
    $ = response.body;

    return [{
        'description': $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content'),
        'name': $('meta[name="searchtitle"]').attr('content') || $('title').text(),
        'type': $('meta[property="og:type"]').attr('content') || 'website_content',
        'url': request.url
    }];
}
```

> **Note**: The `Localized` toggle should be enabled if content varies by locale.

![Document Extractor JS Source Code](/images/search-source/sitecore-search-document-extractors-content-tags.png)

---

## Step 7: Configure Locale Extractors

### Create Locale Extractor

1. Navigate to **Locale Extractors**
2. Click **+ Add Extractor**
3. Configure the following settings:

| Field | Value |
|-------|-------|
| **Name** | `Locale Extractor` |
| **Extractor Type** | `JS` |
| **URLs to Match** | *(No matchers - applies to all URLs)* |

### JS Source Code for Locale Extraction

```javascript
function extract(request, response) {
    url = request.url;
    // Only include locales that actually appear in URLs
    locales = ['ar-ae', 'fr-ca'];
    for (idx in locales) {
        locale = locales[idx];
        if (url) {
            // Convert URL to lowercase for case-insensitive matching
            if (url.toLowerCase().indexOf('/' + locale) >= 0) {
                return locale.replace('-', '_');
            }
        }
    }
    // Default to English for root-level URLs
    return "en_us";
}
```

![Locale Extractors Configuration](/images/search-source/sitecore-search-locale-extractors.png)

### Supported Locales

The locale extractor identifies the following languages based on URL patterns:

| URL Pattern | Detected Locale | Output |
|-------------|-----------------|--------|
| `/ar-ae/...` | Arabic (UAE) | `ar_ae` |
| `/fr-ca/...` | French (Canada) | `fr_ca` |
| Root URLs (no locale in path) | English (US) | `en_us` |

---

## Step 8: Validate and Save

1. Click **Validate** to ensure all configurations are correct
2. Review any validation errors and fix as needed
3. Click **Save** to save the source configuration

---

## Step 9: Run the Crawler

1. After saving, navigate to the source overview
2. Click **Run Crawler** or schedule a crawl
3. Monitor the crawl progress in the **Source Information** panel

---

## Source Information Reference

After successful configuration and crawl, the source information will display:

| Field | Example Value |
|-------|---------------|
| **Last Run Status** | ✔ Finished |
| **Last Run Time** | Today, 12:18 PM |
| **Source ID** | `1189876` |
| **External ID** | `fastlane_search` |
| **Document Count** | `73` |
| **Next Scheduled Run** | Unscheduled |
| **Version** | `9` |
| **Status** | Live |
| **Last Modified** | November 26, 2025 |
| **Modified By** | Karthikeyan Kumaravel |

![Source Information Panel](/images/search-source/sitecore-search-source-information-after-index.png)

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **No documents indexed** | Check allowed domains and exclusion patterns |
| **Missing content** | Verify document extractor JS code |
| **Wrong locale detected** | Review locale extractor URL pattern matching |
| **Crawl fails** | Check website accessibility and CORS settings |

### Verification Steps

1. **Check Document Count**: Ensure documents are being indexed
2. **Preview Documents**: Use the Search Console preview to verify extracted content
3. **Test Locale Detection**: Verify multilingual content is properly categorized
4. **Validate Exclusions**: Confirm excluded URLs are not appearing in results

---

## Notes

### Handling Large Multi-Language Deployments (54+ Languages)

Sitecore Search has a limitation of **54 locales per source**. If your website supports more than 54 languages, you'll need to implement a multi-source strategy using glob expressions to split content across multiple search indexes.

#### Why Split Sources?

- **Locale Limit**: Each Sitecore Search source supports a maximum of 54 locales
- **Performance**: Large multi-language sites benefit from distributed indexing
- **Scalability**: Splitting sources allows for better management and targeted crawling

#### Implementation Strategy

1. **Create Multiple Sources**: Set up separate search sources for different language groups
   - Example: `fastlane_search_emea` for European languages
   - Example: `fastlane_search_apac` for Asia-Pacific languages
   - Example: `fastlane_search_americas` for American languages

2. **Use Glob Expressions for URL Filtering**: Configure each source with glob expressions to include/exclude specific language URLs

   | Source | Include Pattern | Description |
   |--------|-----------------|-------------|
   | EMEA Source | `*/en-gb/*`, `*/de-de/*`, `*/fr-fr/*` | European locales |
   | APAC Source | `*/ja-jp/*`, `*/zh-cn/*`, `*/ko-kr/*` | Asia-Pacific locales |
   | Americas Source | `*/en-us/*`, `*/es-mx/*`, `*/pt-br/*` | American locales |

3. **Configure Exclusion Patterns**: In each source, add exclusion patterns for languages handled by other sources

   ```
   # Example: EMEA source exclusions
   */ja-jp/*
   */zh-cn/*
   */en-us/*
   ```

4. **Aggregate Results in Frontend**: Use the Sitecore Search SDK to query multiple sources and aggregate results based on the user's selected locale

#### Best Practices

- **Group by Region**: Organize languages by geographic region for logical separation
- **Balance Load**: Distribute languages evenly across sources to optimize crawl performance
- **Consistent Extractors**: Use identical document and locale extractors across all sources for uniform content structure
- **Unified Widget Configuration**: Configure your search widgets to query the appropriate source based on the current locale

> **Important**: When implementing multi-source search, ensure your frontend application correctly routes search queries to the appropriate source based on the user's language selection.

---

## Related Documentation

- [Sitecore Search SDK - Basic Requirements](/docs/library/search/search-components/search-basic-requirement)
- [Sitecore Search Widget Components](/docs/library/search/search-components/sitecore-search-widget-components)
- [Search Input Template Prompt](/docs/library/search/search-components/search-input-template-prompt)

---

## Next Steps

After configuring the search source:

1. Configure search widgets in your Next.js application
2. Set up environment variables (`NEXT_PUBLIC_SITECORE_SEARCH_API_KEY`, etc.)
3. Implement search components using the Sitecore Search SDK
4. Test search functionality across all locales
