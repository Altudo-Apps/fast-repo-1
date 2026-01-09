# Sitecore Search SDK - Basic Requirements

## What Needs to Be Done:
I need to implement the search result page with a input field Here is the figma design for the page This search functionality needs to be added from the sitecore search sdk so check all the linked document carefully before creating the component all the baisc functionality needs to be taken from the original document also for creating anything for this component we don't need to use the sitecore tag like image,text tag etc:

All the widgets component needs to be placed inside the nextjs_starter -> src -> core -> atom folder and the file needs to have only .tsx

All the templates component needs to be placed inside the nextjs_starter -> src -> core -> molecules folder

First install dependencies inside nextjs_starter -> package.json
### 1. **Install Dependencies**
```bash
npm install @sitecore-search/react @sitecore-search/ui @sitecore-search/common
```

### 2. **Environment Setup**
```env
NEXT_PUBLIC_SITECORE_SEARCH_API_KEY=your_api_key
NEXT_PUBLIC_SITECORE_SEARCH_CUSTOMER_KEY=your_customer_key
NEXT_PUBLIC_SITECORE_SEARCH_ENDPOINT=your_endpoint_url
```

### **Modify the _app.tsx file**
all the return statment needs to be wrapped inside 
 <WidgetsProvider env="prod" customerKey={customerKey} apiKey={apiKey}>
   </WidgetsProvider>

   also before return statment you need to add this statment before retun statment:
    const customerKey = process.env.NEXT_PUBLIC_CUSTOMER_KEY;
  const apiKey = process.env.NEXT_PUBLIC_SITECORE_SEARCH_API_KEY;
  PageController.getContext().setLocaleLanguage('en');
  PageController.getContext().setLocaleCountry('us');

  and import this from:
  import { PageController, WidgetsProvider } from '@sitecore-search/react';

### 3. **Required Components to Build**

#### **Main Search Page Component**
- [ ] **SearchResults** - Create a component inside `src/components/SearchResults.tsx`
  - This will contain the search input component and display search results
  - Reference: [Sitecore Search Widget Components](./sitecore-search-widget-components.md)

#### **Search Input Components**
- [ ] **SearchInput** - Basic search input with button
  - Documentation: https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/docs/widget-templates-product-search-results-search-input--page
  - Figma Design: https://www.figma.com/design/M37xh0dT7qtPPiEDIRuA4X/XMC-Fastlane---Official-Altudo-Version?node-id=17811-5467&m=dev
  - Location: `src/core/molecules/searchMolecules/SearchInput/`
  - Requires multiple widget components from `src/core/atom/`

#### **Search Results Components**
- [ ] **ArticleCard** - Individual result card
  - Documentation: https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/docs/widget-components-article-card--page
  - Location: `src/core/atom/ArticleCard/`

- [ ] **ArticleHorizontalCard** - Horizontal result layout
  - Documentation: https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/docs/widget-components-article-horizontal-card--page
  - Location: `src/core/atom/ArticleHorizontalCard/`

#### **Filter & Navigation Components**
- [ ] **SearchFacets** - Faceted search filters
  - Documentation: https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/docs/widget-components-search-facets--page
  - Figma Design: https://www.figma.com/design/M37xh0dT7qtPPiEDIRuA4X/XMC-Fastlane---Official-Altudo-Version?node-id=17811-6090&m=dev
  - Location: `src/core/atom/SearchFacets/`

- [ ] **Filters** - Active filters display
  - Documentation: https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/docs/widget-components-filters--page
  - Location: `src/core/atom/Filters.tsx`

- [ ] **SortOrder** - Sort options dropdown
  - Documentation: https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/docs/widget-components-sort-order--page
  - Figma Design: https://www.figma.com/design/M37xh0dT7qtPPiEDIRuA4X/XMC-Fastlane---Official-Altudo-Version?node-id=17811-6090&m=dev
  - Location: `src/core/atom/SortOrder.tsx`

- [ ] **SearchPagination** - Results pagination
  - Documentation: https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/docs/widget-components-search-pagination--page
  - Location: `src/core/atom/SearchPagination.tsx`
- [ ] **ResultsPerPage** - Items per page selector
  - Documentation: https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/docs/widget-components-results-per-page--page
  - Location: `src/core/atom/ResultsPerPage.tsx`

#### **Utility Components**
- [ ] **Spinner** - Loading indicator
  - Documentation: https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/docs/widget-components-spinner--page
  - Location: `src/core/atom/Spinner.tsx`

- [ ] **QueryResultsSummary** - Results count display
  - Documentation: https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/docs/widget-components-query-results-summary--page
  - Location: `src/core/atom/QueryResultsSummary.tsx`

- [ ] **CardViewSwitcher** - Grid/List view toggle
  - Documentation: https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/docs/widget-components-cardviewswitcher--page
  - Figma Design: https://www.figma.com/design/M37xh0dT7qtPPiEDIRuA4X/XMC-Fastlane---Official-Altudo-Version?node-id=17922-3429&m=dev
  - Location: `src/core/atom/CardViewSwitcher.tsx`

- [ ] **SearchLoadMoreProgress** - Load more progress indicator
  - Documentation: https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/docs/widget-components-searchloadmoreprogress--page
  - Location: `src/core/atom/SearchLoadMoreProgress.tsx`

- [ ] **SuggestionBlock** - Search suggestions display
  - Documentation: https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/docs/widget-components-suggestionblock--page
  - Location: `src/core/atom/SuggestionBlock.tsx`

### 4. **Implementation Requirements**

#### **Folder Structure**
```
src/
├── components/
│   └── SearchResults.tsx          # Main search page component
├── core/
│   ├── atom/                      # Widget components (Sitecore Search SDK)
│   │   ├── ArticleCard/
│   │   ├── ArticleHorizontalCard/
│   │   ├── ProductCard/
│   │   ├── SearchFacets/
│   │   ├── Filters/
│   │   ├── SortOrder/
│   │   ├── SearchPagination/
│   │   ├── ResultsPerPage/
│   │   ├── Spinner/
│   │   ├── QueryResultsSummary/
│   │   ├── CardViewSwitcher/
│   │   ├── SearchLoadMoreProgress/
│   │   └── SuggestionBlock/
│   └── molecules/                 # Template/molecule components
│       └── searchMolecules/
│           └── SearchInput/
```

#### **Implementation Order**
1. **First**: Create all required widget components in `src/core/atom/`
2. **Second**: Create SearchInput molecule in `src/core/molecules/searchMolecules/`
3. **Third**: Create main SearchResults component in `src/components/`

#### **Widget Structure**
- Each component must be wrapped with `widget()` function
- Use proper `WidgetDataType` (SEARCH_RESULTS, PREVIEW_SEARCH, etc.)
- Implement proper TypeScript interfaces
- Reference: [Sitecore Search Widget Components](./sitecore-search-widget-components.md)

#### **Styling Requirements**
- Use Tailwind CSS classes
- Follow Figma designs for UI components
- Ensure responsive design for all components
