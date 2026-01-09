# Validate Search Results

This document provides step-by-step instructions for validating search results using the API Explorer in the Sitecore Search Console. Use the API Explorer to test your widget and source configuration before implementing the search functionality in your application.

## Prerequisites

- Access to the Sitecore Search Console
- A configured search source (see [Search Source Configuration](search-source-configuration))
- A configured search widget (see [Search Widget Configuration](search-widget-configuration))
- Indexed content in your search source

---

## Step 1: Navigate to API Explorer

1. Log in to the **Sitecore Search Console**
2. Navigate to **Developer Resources** from the left sidebar
3. Select the **API Explorer** tab

![API Explorer Navigation](/images/search-source/sitecore-search-api-explorer.png)

---

## Step 2: Configure API Explorer Parameters

Configure the following parameters in the left panel:

### Basic Configuration

| Parameter | Value | Description |
|-----------|-------|-------------|
| **PAGE** | Select page | Optional page context for the request |
| **URI** | Enter the uri | Optional URI for page context |
| **WIDGET** | `FLSearchResults` | Select your configured widget |
| **ENTITY** | `Content` | Select the entity type to search |
| **SOURCE** | `Fastlane Search` | Select your configured search source |
| **LIMIT** | `100` | Maximum number of results to return |
| **OFFSET** | *(Optional)* | Starting position for pagination |

![API Explorer Basic Configuration](/images/search-source/sitecore-search-api-explorer-config.png)

### Additional Options

| Option | Description |
|--------|-------------|
| **Disable Grouping** | Checkbox to disable result grouping |
| **Locale** | Configure locale settings for the search |
| **Query** | Add search query parameters |
| **Suggestion Blocks** | Configure suggestion block settings |
| **Context/IDs** | Add context identifiers |

### Locale Configuration

Expand the **Locale** section and configure:

| Parameter | Value | Description |
|-----------|-------|-------------|
| **COUNTRY & LANGUAGE** | `United States, English` | Select the locale for search results |

> **Note**: The locale configuration is shown in the API Explorer configuration panel above.

---

## Step 3: Build the Request

1. After configuring all parameters, click the **Build** button
2. The **Request** panel will be populated with the generated JSON request

### Sample Request JSON

```json
{
  "widget": {
    "items": [
      {
        "rfk_id": "RFKID_1001",
        "entity": "content",
        "sources": [
          "1189876"
        ],
        "search": {
          "content": {},
          "limit": 100
        }
      }
    ]
  },
  "context": {
    "locale": {
      "country": "us",
      "language": "en"
    }
  }
}
```

![API Explorer Request Build](/images/search-source/sitecore-search-api-explorer-request.png)

### Request Structure Explained

| Field | Description |
|-------|-------------|
| `widget.items[].rfk_id` | The Widget ID configured in widget settings |
| `widget.items[].entity` | The entity type (content, product, etc.) |
| `widget.items[].sources` | Array of source IDs to search |
| `widget.items[].search.limit` | Maximum results to return |
| `context.locale.country` | Country code for locale |
| `context.locale.language` | Language code for locale |

> **Note**: You may see a warning about `context.user.uuid` or `context.user.user_id` being required. This is for personalization features and can be ignored for basic testing.

---

## Step 4: Run the Request

1. Click the **Run** button to execute the search request
2. The **Response** panel will display the search results

### Response Status

Check the response status indicators:

| Indicator | Value | Description |
|-----------|-------|-------------|
| **Status** | `200` | HTTP status code (200 = success) |
| **Size** | `10.6 kb` | Response payload size |
| **Errors** | `0 errors` | Number of errors in response |
| **Time** | `53 ms / 1558 ms` | Processing time / total time |

![API Explorer Response](/images/search-source/sitecore-search-api-explorer-response.png)

### Sample Response JSON

```json
{
  "widgets": [
    {
      "rfk_id": "RFKID_1001",
      "type": "content_grid",
      "used_in": "page",
      "entity": "content",
      "content": [
        {
          "description": "Browse our list of 10 locations.",
          "id": "14f122c2d56c0e2737a0b878df927ddfb36531cc71e",
          "name": "Locations - 10 found",
          "source_id": "1189876",
          "type": "website",
          "url": "https://xmc-fast-lane.vercel.app/locations"
        },
        {
          "description": "Découvrez comment le réseau de bou...",
          "id": "4d3efd06769411bc40e44a9325e0289e0606cf161354a",
          "name": "L'ICMP certifie plus de 10 000 médecins p...",
          "source_id": "1189876",
          "type": "website",
          "url": "https://xmc-fast-lane.vercel.app/Blogs/Blo..."
        }
      ]
    }
  ]
}
```

### Response Structure Explained

| Field | Description |
|-------|-------------|
| `widgets[].rfk_id` | Widget ID that generated this response |
| `widgets[].type` | Widget type (content_grid, etc.) |
| `widgets[].used_in` | Context where widget is used |
| `widgets[].entity` | Entity type of results |
| `widgets[].content[]` | Array of search result items |
| `content[].description` | Item description/summary |
| `content[].id` | Unique item identifier |
| `content[].name` | Item title/name |
| `content[].source_id` | Source ID where item was indexed |
| `content[].type` | Content type |
| `content[].url` | URL of the content item |

---

## Step 5: Verify Results

Verify that the search results match your expectations:

### Verification Checklist

| Check | Description |
|-------|-------------|
| ✅ **Status Code** | Response returns `200` status |
| ✅ **No Errors** | Error count shows `0 errors` |
| ✅ **Results Returned** | `content` array contains items |
| ✅ **Correct Source** | `source_id` matches your configured source |
| ✅ **Valid URLs** | URLs point to correct website pages |
| ✅ **Content Quality** | Names and descriptions are properly extracted |

---

## Using Copy to Clipboard

The API Explorer provides options to copy request and response data:

1. Click **Copy to Clipboard as...** above the Request panel to copy the request JSON
2. Click **Copy to Clipboard as...** above the Response panel to copy the response JSON

This is useful for:
- Debugging integration issues
- Sharing configurations with team members
- Creating test cases for your frontend implementation

---

## Troubleshooting

### Common Issues

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| **Empty Response** | No indexed content | Run the crawler and wait for indexing |
| **Wrong Results** | Incorrect source selected | Verify SOURCE parameter matches your configuration |
| **Missing Fields** | Document extractor issue | Check document extractor JS code |
| **Locale Mismatch** | Wrong locale configured | Verify COUNTRY & LANGUAGE selection |
| **Status 400/500** | Invalid request parameters | Review request JSON for errors |

### Validation Tips

1. **Test with Different Limits**: Try different LIMIT values to verify pagination works
2. **Test All Locales**: Verify results for each configured locale
3. **Check Field Extraction**: Ensure all expected fields are populated
4. **Compare with Source**: Verify indexed document count matches expectations

---

## Next Steps

After validating search results:

1. **Implement Frontend Components** - Use the response structure to build search result components
2. **Configure Facets** - Add faceted filtering based on available fields
3. **Set Up Analytics** - Track search queries and result clicks
4. **Optimize Performance** - Adjust limit and pagination for optimal UX

---

## Related Documentation

- [Search Source Configuration](search-source-configuration) - Configure search sources and crawlers
- [Search Widget Configuration](search-widget-configuration) - Create and configure search widgets
- [Sitecore Search Widget Components](/docs/library/search/search-components/sitecore-search-widget-components) - Frontend component implementation

