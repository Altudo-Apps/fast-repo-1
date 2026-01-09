## Prompt: Create and Wire Sitecore Search – Search Input Template

Implement the Sitecore Search SDK Search Input template and wire it into a `SearchResults` component, matching the Figma design and using the Sitecore CLI to generate the proper template.

### Inputs
- Repo root: `headapps/nextjs-starter`
- Docs reference: https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/docs/widget-templates-content-search-results-search-input--page
- Figma reference: https://www.figma.com/design/M37xh0dT7qtPPiEDIRuA4X/XMC-Fastlane---Official-Altudo-Version?node-id=17811-5467&m=dev
- rfkId to use in page composition: `RFKID_1001`

Use the Figma reference above for visual alignment (rounded input, left icon, adjacent button).

### Required outcome
- Functional Search Input widget template generated using Sitecore CLI
- The widget includes search input with debounce functionality
- Results UI with facets, filters, sorting, and pagination
- All component dependencies properly created
- App compiles without linter errors

### Steps

#### 1) Install Required Packages
In `headapps/nextjs-starter`, install the following packages:
```bash
npm install @sitecore-search/react @sitecore-search/ui @sitecore-search/common @radix-ui/react-icons
```

#### 2) Setup _app.tsx with WidgetsProvider
Modify `src/pages/_app.tsx` to wrap the application with `WidgetsProvider`:

```typescript
import { PageController, WidgetsProvider } from '@sitecore-search/react';

function App({ Component, pageProps }: AppProps<SitecorePageProps>): JSX.Element | null {
  const { dictionary, ...rest } = pageProps;

  // Sitecore Search configuration
  const customerKey = process.env.NEXT_PUBLIC_CUSTOMER_KEY;
  const apiKey = process.env.NEXT_PUBLIC_SITECORE_SEARCH_API_KEY;
  PageController.getContext().setLocaleLanguage('en');
  PageController.getContext().setLocaleCountry('us');

  return (
    <WidgetsProvider env="prod" customerKey={customerKey} apiKey={apiKey}>
      {/* existing app content */}
    </WidgetsProvider>
  );
}
```

#### 3) Generate SearchInput Widget Using Sitecore CLI
Use the Sitecore Search CLI to generate the SearchInput widget template:

```bash
npx sc-search new-widget --language typescript --template search-results-input --entity content --styling tailwind --output src/core/molecules
```

When prompted:
- **Component name**: `SearchInput`
- **Install dependencies**: `yes`

This will generate the complete SearchInput widget at `src/core/molecules/SearchInput/index.tsx` with:
- Search input with debounce
- Integration with `useSearchResults` hook
- Support for facets, filters, sorting, and pagination
- Proper widget export using `widget(Component, WidgetDataType.SEARCH_RESULTS, 'content')`

#### 4) Restructure Generated Files
The CLI generates the widget in a folder structure. We need to flatten it:

**Move and rename the file**:
1. The CLI creates: `src/core/molecules/SearchInput/index.tsx`
2. Move the content to: `src/core/molecules/SearchInput.tsx`
3. Delete the `SearchInput` folder

```bash
# PowerShell commands
Move-Item src/core/molecules/SearchInput/index.tsx src/core/molecules/SearchInput.tsx
Remove-Item -Path src/core/molecules/SearchInput -Recurse -Force
```

#### 5) Update Import Paths in SearchInput.tsx


**Note**: The CLI automatically generates stub component files in `src/core/molecules/components/` directory with the following structure:
- `components/ArticleHorizontalCard/index.tsx`
- `components/Filter/index.tsx`
- `components/QueryResultsSummary/index.tsx`
- `components/ResultsPerPage/index.tsx`
- `components/SearchFacets/index.tsx`
- `components/SearchPagination/index.tsx`
- `components/SortOrder/index.tsx`
- `components/Spinner/index.tsx`

#### 6) Simplify SearchResults Component
Update your `src/components/SearchResults.tsx` to only call the SearchInput widget:

```typescript
import { JSX } from 'react';
import { ComponentProps } from 'src/lib/component-props';
import SearchInputWidget from 'src/core/molecules/SearchInput';

interface SearchResultsProps extends ComponentProps {
  params: ComponentProps['params'] & {
    RenderingIdentifier?: string;
    styles?: string;
  };
}

const SearchResults = (props: SearchResultsProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const styles = props.params.styles || '';

  return (
    <div className={`search-results-page ${styles}`} id={id}>
      <SearchInputWidget rfkId="RFKID_1001" />
    </div>
  );
};

export default SearchResults;
```

#### 7) Setup Environment Variables
Create or update `.env.local` with Sitecore Search credentials:

```env
NEXT_PUBLIC_CUSTOMER_KEY=your_customer_key
NEXT_PUBLIC_SITECORE_SEARCH_API_KEY=your_api_key
NEXT_PUBLIC_SITECORE_SEARCH_ENDPOINT=your_endpoint_url
NEXT_PUBLIC_SITECORE_SEARCH_ENV=prod
```

### Key Features of Generated SearchInput

The CLI-generated SearchInput widget includes:

1. **Search Input**: 
   - Input field with magnifying glass icon
   - Debounced search (200ms)
   - Keyphrase change handling

2. **Loading States**:
   - Initial loading spinner
   - Fetching overlay during searches

3. **Results Display**:
   - Horizontal article cards
   - Query results summary
   - Sort order dropdown

4. **Filtering & Facets**:
   - Active filters display
   - Faceted search sidebar
   - Filter selection handling

5. **Pagination**:
   - Results per page selector
   - Page navigation controls

### Acceptance Criteria

- ✅ The project compiles with no linter errors
- ✅ SearchInput widget is generated using Sitecore CLI
- ✅ Search triggers with debounce on typing
- ✅ Results UI transitions between loading/empty/filled states
- ✅ All component imports resolve
- ✅ Facets, filters, and pagination work correctly
- ✅ Widget is properly exported and can be imported in other components

### References
- **Storybook**: https://developers.sitecorecloud.io/search-sdk/react/latest/storybook/index.html?path=/docs/widget-templates-content-search-results-search-input--page
- **Figma**: https://www.figma.com/design/M37xh0dT7qtPPiEDIRuA4X/XMC-Fastlane---Official-Altudo-Version?node-id=17811-5467&m=dev
- **Sitecore Search CLI**: Use `npx sc-search --help` for more commands

### Quick Command Summary

```bash
# 1. Install packages
npm install @sitecore-search/react @sitecore-search/ui @sitecore-search/common @radix-ui/react-icons

# 2. Generate SearchInput widget
npx sc-search new-widget --language typescript --template search-results-input --entity content --styling tailwind --output src/core/molecules

# 3. Restructure files (PowerShell)
Move-Item src/core/molecules/SearchInput/index.tsx src/core/molecules/SearchInput.tsx
Remove-Item -Path src/core/molecules/SearchInput -Recurse -Force

# 4. Update import paths in SearchInput.tsx (change '../components/' to './components/')
```

### Troubleshooting

**CLI Template Not Found**: Make sure you're using the correct template name `search-results-input` with entity `content` or `product`

**Import Errors After Moving File**: 
- Change all imports from `../components/` to `./components/`
- This is because after flattening the folder structure, the components folder is now a sibling to SearchInput.tsx

**Missing Dependencies**: The CLI will prompt to install `@radix-ui/react-icons` - make sure to accept

**Environment Variables**: Ensure all required env vars are set before running the application

**Linter Errors**: After moving files, always run a linter check:
```bash
npm run lint
```
