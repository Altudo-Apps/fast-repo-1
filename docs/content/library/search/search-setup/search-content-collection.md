# Search Content Collection

This guide explains how to view and verify the indexed documents in Sitecore Search's Content Collection. The Content Collection displays the exact items that have been indexed and will appear in your website's search results.

## Overview

The Content Collection is a central repository in Sitecore Search that stores all indexed content from your configured sources. It allows you to:

- View all indexed documents from your search sources
- Filter content by specific sources
- Verify that your content is being indexed correctly
- Debug search issues by checking if content exists in the index

## Accessing Content Collection

### Step 1: Navigate to Content Collection

1. Log in to the [Sitecore Search Console](https://cec.sitecorecloud.io)
2. In the left navigation sidebar, click on **Content Collection** (the icon looks like stacked documents)

### Step 2: Select Content Type

The Content Collection is organized into different types:

| Type | Description |
|------|-------------|
| **Content** | General website content (pages, articles, blog posts) |
| **Product** | Product catalog items (for e-commerce) |
| **Visitors** | Visitor/user data |
| **Questions & Answers** | FAQ and Q&A content |

Click on **Content** to view your indexed website content.

![Content Collection - Content Types](/images/search-source/sitecore-search-content-collection.png)

## Filtering by Source

### Step 3: Open Source Filter

1. In the Content Browser view, locate the **Source** dropdown filter at the top of the page
2. Click on the **Source** dropdown (default shows "All")

### Step 4: Select Your Source

1. A dropdown menu will appear showing all available sources:
   - SGSample
   - Huron POC
   - Altudo Order Cloud
   - OC Commerce Accelerator
   - **Fastlane Search** ← Select this for FastLane website content
   
2. Check the box next to **Fastlane Search**
3. Click **Apply** to filter the results

![Content Collection - Source Selection](/images/search-source/sitecore-search-content-collection-source-selection.png)

### Step 5: View Indexed Content

After applying the filter, you will see the exact content items indexed from your FastLane website:

| Column | Description |
|--------|-------------|
| **NAME** | The title/name of the indexed document |
| **SOURCE** | The source the document belongs to (e.g., "Fastlane Search") |
| **ID** | Unique identifier for the document in the index |
| **LAST UPDATED** | Date when the document was last indexed |

![Content Collection - Filtered Results](/images/search-source/sitecore-search-content-collection-results.png)

## Example Results

When filtering by "Fastlane Search" source, you might see results like:

| Name | Source | Last Updated |
|------|--------|--------------|
| Locations - 10 found | Fastlane Search | November 25, 2025 |
| Dr Aminata Diouf MD MPH - Leadership Profile \| Fast Lane XM Cloud | Fastlane Search | November 25, 2025 |
| ICMP Opens Regional Offices in Southeast Asia and West Africa \| Boosting Local Health Training | Fastlane Search | November 25, 2025 |
| Fast Lane - Innovative XM Cloud Solutions | Fastlane Search | November 25, 2025 |
| Request a Demo - Experience Fast Lane XM Cloud Solutions | Fastlane Search | November 25, 2025 |
| Leadership Team - Meet Fast Lane's XM Cloud Experts | Fastlane Search | November 25, 2025 |

> **Note:** The items shown in the Content Collection are the exact items that will appear in your website's search results. If content is missing from this list, it will not appear in search results.

## Content Details

Click on any document to view its full details including:

- All indexed attributes
- Content body
- Metadata
- Tags and categories
- URL

## Troubleshooting

### Content Not Appearing in Collection

If your content is not appearing in the Content Collection:

1. **Check Source Configuration** - Verify the web crawler is configured correctly in [Search Source Configuration](search-source-configuration)
2. **Verify Crawl Status** - Check if the crawler has recently run and completed successfully
3. **Check URL Patterns** - Ensure your content URLs match the configured crawl patterns
4. **Review Extractors** - Verify document extractors are correctly parsing your content

### Content Count Mismatch

If the number of items in the Content Collection doesn't match your expected content:

1. **Check Locale Settings** - Content may be filtered by locale (e.g., "United States, English")
2. **Verify Publish Status** - Only published content is typically indexed
3. **Review Exclusion Rules** - Check if any URL patterns are excluded from crawling

## Best Practices

1. **Regular Verification** - Periodically check the Content Collection to ensure new content is being indexed
2. **Monitor Dates** - Check "Last Updated" dates to verify the crawler is running on schedule
3. **Test Before Launch** - Always verify content appears in the Collection before testing search functionality
4. **Document IDs** - Note document IDs for debugging API queries in the [API Explorer](validate-search-results)

## Related Documentation

- [Search Source Configuration](search-source-configuration) - Configure the web crawler and extractors
- [Search Widget Configuration](search-widget-configuration) - Set up search widgets
- [Validate Search Results](validate-search-results) - Test search queries using the API Explorer

