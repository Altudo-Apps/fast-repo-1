# Sitecore Search Widget Configuration

This document provides step-by-step instructions for configuring Search Widgets in the Sitecore Search Console. Follow these steps to create and configure a Search Results widget for your application.

## Prerequisites

- Access to the Sitecore Search Console
- Admin or appropriate permissions to create and manage widgets
- A configured search source (see [Search Source Configuration](search-source-configuration))

---

## Step 1: Create a New Widget

1. Navigate to **Sitecore Search Console** → **Widgets**
2. Click **+ Add Widget**
3. On the **Choose Widget Type** screen, select the appropriate widget type:

| Widget Type | Description |
|-------------|-------------|
| **Preview Search** | Displays search suggestions as users type |
| **Search Results** | Displays full search results on a dedicated page |
| **Recommendation** | Shows personalized content recommendations |
| **Banner** | Displays promotional banners based on search context |
| **HTML Block** | Custom HTML content for search pages |

4. For this guide, select **Search Results**

![Choose Widget Type](/images/search-source/sitecore-search-choose-widget-type.png)

---

## Step 2: Configure Widget Settings

After creating the widget, configure the general settings:

1. Navigate to the **Widget Settings** tab
2. Configure the following settings:

### General Settings

| Setting | Value | Description |
|---------|-------|-------------|
| **Widget Name** | `FLSearchResults` | A descriptive name for the widget |
| **Widget ID** | `RFKID_1001` | Unique identifier used in frontend integration |
| **Will Be Used In** | `Page` | Specifies where the widget will be rendered |
| **Grouping** | `Enabled` | Enables entity grouping in search results |

![Widget General Settings](/images/search-source/sitecore-search-widget-general-settings.png)

### Entity Grouping Configuration

When Grouping is enabled, configure the entities:

| Entity | Used for Grouping | Configuration |
|--------|-------------------|---------------|
| **Content** | Set up in domain settings | Configure content grouping rules |
| **Product** | Set up in domain settings | Configure product grouping rules |

> **Note**: Click **Set up in domain settings** to configure grouping for each entity type.

3. Click **Save** to save the widget settings

---

## Step 3: Configure Widget Variations

Widget variations allow you to create different configurations for A/B testing or targeting specific audiences.

1. Navigate to the **Widget Variations** tab
2. You will see the **Default** variation created automatically

### Default Variation Properties

| Property | Value | Description |
|----------|-------|-------------|
| **Name** | `Default` | Name of the variation |
| **Traffic** | `100%` | Percentage of traffic receiving this variation |
| **Schedule** | Will run until another variation is scheduled | Default scheduling behavior |
| **Status** | `Active` | Current status of the variation |

![Widget Variations](/images/search-source/sitecore-search-widget-variations.png)

### Adding a New Variation

1. Click **+ Add Variation** to create additional variations
2. Configure variation-specific settings
3. Set traffic allocation percentages
4. Schedule the variation if needed

---

## Step 4: Configure Variation Rules

Rules determine how search results are filtered, sorted, and merchandised based on context.

1. Click on the **Default** variation to open it
2. Navigate to the **Rules** tab

### Filter By Section

Configure the site context filters:

| Filter | Value | Description |
|--------|-------|-------------|
| **Site Context** | `website` | The website context for filtering |

### Adding a Rule

1. Click **+ Add Rule** to create a new rule
2. Configure the following settings:

| Setting | Configuration | Description |
|---------|---------------|-------------|
| **Rank** | `1` | Priority order of the rule (lower = higher priority) |
| **Context - Website** | `Demo` | Target website for this rule |
| **Context - Country** | `India` | Target country/region |
| **Merchandising** | `No Merchandising Specified` | Merchandising rules (boost/bury products) |
| **Sorting** | `Title Ascending` | Default sort order for results |

![Default Variation Rules](/images/search-source/sitecore-search-widget-default-variation-rules.png)

### Available Sorting Options

| Sort Option | Description |
|-------------|-------------|
| **Title Ascending** | Sort results A-Z by title |
| **Title Descending** | Sort results Z-A by title |
| **Relevance** | Sort by search relevance score |
| **Date Ascending** | Sort by date (oldest first) |
| **Date Descending** | Sort by date (newest first) |

---

## Step 5: Configure Variation Settings

1. Navigate to the **Variation Settings** tab within the variation
2. Configure additional settings such as:
   - Number of results per page
   - Result display options
   - Facet configurations
   - Custom templates

---

## Step 6: Publish the Widget

1. Review all widget configurations
2. Click the **Publish** button in the top-right corner
3. Confirm the publication to make the widget live

> **Important**: Publishing makes the widget configuration available in production. Test thoroughly before publishing.

---

## Frontend Integration

After configuring the widget in the Sitecore Search Console, integrate it into your Next.js application:

### Environment Variables

Ensure the following environment variables are configured:

```bash
NEXT_PUBLIC_SITECORE_SEARCH_API_KEY=your-api-key
NEXT_PUBLIC_SITECORE_SEARCH_CUSTOMER_KEY=your-customer-key
NEXT_PUBLIC_SITECORE_SEARCH_ENV=your-environment
```

### Widget ID Reference

Use the Widget ID (`RFKID_1001`) in your frontend components to connect to this widget configuration:

```typescript
const SEARCH_RESULTS_WIDGET_ID = 'RFKID_1001';
```

---

## Widget Configuration Summary

| Configuration Item | Value |
|--------------------|-------|
| **Widget Type** | Search Results |
| **Widget Name** | FLSearchResults |
| **Widget ID** | RFKID_1001 |
| **Usage Context** | Page |
| **Grouping** | Enabled |
| **Default Variation** | Active (100% traffic) |
| **Default Sorting** | Title Ascending |

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **Widget not displaying** | Verify Widget ID matches frontend configuration |
| **No results returned** | Check search source is indexed and published |
| **Wrong sorting** | Review rule priorities and sorting configuration |
| **Context not matching** | Verify site context values match your application |

### Verification Steps

1. **Check Widget Status**: Ensure the widget is published and active
2. **Verify Rules**: Confirm rules match your site context values
3. **Test Integration**: Use the Search Console preview to test widget behavior
4. **Check Console Logs**: Review browser console for API errors

---

## Related Documentation

- [Search Source Configuration](search-source-configuration) - Configure search sources and crawlers
- [Sitecore Search Widget Components](/docs/library/search/search-components/sitecore-search-widget-components) - Frontend component implementation
- [Search Basic Requirements](/docs/library/search/search-components/search-basic-requirement) - SDK setup and configuration

---

## Next Steps

After configuring the search widget:

1. Implement the search results component in your Next.js application
2. Configure facets and filters based on your content structure
3. Set up analytics to track search performance
4. Create additional variations for A/B testing

