# Sitecore Search

This section contains documentation for configuring and integrating Sitecore Search with your XM Cloud application.

## 🔍 Overview

Sitecore Search provides powerful search capabilities for your website, enabling visitors to find content quickly and efficiently. The integration involves:

- **Backend Configuration**: Setting up search sources in the Sitecore Search Console
- **Frontend Implementation**: Implementing search widgets and components in your Next.js application

## 📚 Documentation Sections

### 🧩 [Search Components](./search-components)
**Reusable search UI components and widgets**

Browse the complete collection of search-related components with implementation guidance:
- [Widget Components Overview](./search-components/sitecore-search-widget-components) - Available search components
- [Basic Requirements](./search-components/search-basic-requirement) - SDK setup and configuration
- [Search Input Template](./search-components/search-input-template-prompt) - Search input implementation guide
- Individual component documentation (ArticleCard, SearchFacets, Pagination, etc.)

### ⚙️ [Search Setup](./search-setup)
**Configuration and setup guides**

Step-by-step guides for configuring Sitecore Search:
- [Search Source Configuration](./search-setup/search-source-configuration) - Configure the Sitecore Search source from the Search Console
- [Search Widget Configuration](./search-setup/search-widget-configuration) - Create and configure Search Widgets
- [Search Content Collection](./search-setup/search-content-collection) - View and verify indexed documents
- [Validate Search Results](./search-setup/validate-search-results) - Validate search results using the API Explorer

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| **Web Crawler** | Automatically crawls and indexes your website content |
| **Multi-locale Support** | Supports multiple languages (en-us, ar-ae, fr-ca) |
| **Custom Extractors** | JavaScript-based extractors for content and locale detection |
| **Tag-based Categorization** | Organize content with customizable tags |

## 🚀 Getting Started

To implement Sitecore Search in your project:

1. **Configure the Search Source** - Follow the [Search Source Configuration](./search-setup/search-source-configuration) guide to set up the web crawler and extractors
2. **Configure the Search Widget** - Follow the [Search Widget Configuration](./search-setup/search-widget-configuration) guide to create and configure widgets
3. **Validate Search Results** - Use the [API Explorer](./search-setup/validate-search-results) to test and validate your search configuration
4. **Set Environment Variables** - Configure the required environment variables:
   - `NEXT_PUBLIC_SITECORE_SEARCH_API_KEY`
   - `NEXT_PUBLIC_SITECORE_SEARCH_CUSTOMER_KEY`
   - `NEXT_PUBLIC_SITECORE_SEARCH_ENV`
5. **Implement Search Components** - Use the [Search Components](./search-components) to build search widgets

## 📖 External Resources

- [Sitecore Search Documentation](https://doc.sitecore.com/search)
- [Sitecore Search SDK](https://www.npmjs.com/package/@sitecore-search/react)
