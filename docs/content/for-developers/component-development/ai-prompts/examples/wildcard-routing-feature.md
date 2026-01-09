# Generic Wildcard Routing Feature Implementation

## Overview
Create a complete listing and detail page feature for Next.js + Sitecore using wildcard routing (`[...path].tsx`), external API/data integration, and dynamic data injection into Sitecore page context.

**Use Cases:** Locations, Products, Articles, Events, People, or any content from external APIs.

### Two Implementation Patterns

This guide covers **two proven approaches** for wildcard routing:

1. **External API/JSON Pattern** (Recommended for external data)
   - Uses REST API with JSON fallback
   - Data comes from external systems or third-party APIs
   - Example: Healthcare locations, external product catalogs
   - Reference: `locations` feature in this codebase

2. **GraphQL Pattern** (Recommended for Sitecore content)
   - Uses Sitecore GraphQL queries
   - Data managed within Sitecore CMS
   - Example: Blog articles, news items
   - Reference: `blogs` feature in this codebase
   - Details in Section 17: Advanced Approaches

Choose the pattern that matches your data source.

---

## Implementation Order

### For External API/JSON Pattern (Primary guide below):

1. **Define Data Structure** → Types & Interfaces
2. **Create Mock Data** → JSON file for development
3. **Build API Route** → Backend endpoint
4. **Setup Middleware** → Exclude routes from Sitecore
5. **Create Components** → Display logic
6. **Build Listing Page** → Index page with SSG/ISR
7. **Build Wildcard Route** → Dynamic detail pages
8. **Test & Verify** → End-to-end functionality

### For GraphQL Pattern (See Section 17):

1. **Define Data Structure** → Types & Interfaces
2. **Setup Middleware** → Exclude routes from Sitecore
3. **Create GraphQL Query** → Query for Sitecore items
4. **Create Components** → Display logic
5. **Build Wildcard Route** → With GraphQL data fetching
6. **Test & Verify** → End-to-end functionality

---

**The sections below follow the External API/JSON pattern.** For GraphQL implementation, see Section 17.

---

## 1. Data Structure & Types

Create TypeScript types in `src/types/{Feature}.types.d.ts`:

**Pattern:** Define your domain model based on your API/data source.

### Example: Locations Feature
```typescript
// src/types/LocationsListing.types.d.ts
export type LocationCoordinates = {
  lat: number;
  lon: number;
};

export type InsurancePlan = {
  healthPlanName?: string;
  healthPlanCompanyName?: string;
  // ... additional fields
};

export type LocationResult = {
  locationID: string;              // Required: Unique identifier
  locationName: string;            // Required: Display name
  locationType?: string | null;
  photoUrl?: string | null;
  coordinates?: LocationCoordinates | null;
  distance?: number | null;
  // ... additional domain-specific fields
};

export type LocationsResponse = {
  locationCount: number;
  locationResults: LocationResult[];
};
```

### Generic Pattern
```typescript
// src/types/{Feature}.types.d.ts
export type {Feature}Item = {
  id: string;                    // Required: Unique identifier
  name: string;                  // Required: Display name
  // Add your domain-specific fields here
  photoUrl?: string | null;
  description?: string | null;
  // ... custom fields
};

export type {Feature}Response = {
  count: number;
  items: {Feature}Item[];
};
```

---

## 2. Mock Data Creation

Create `src/pages/api/{feature}.json`:

**Pattern:** Mock data file for development and fallback.

### Example Structure
```json
{
  "count": 10,
  "items": [
    {
      "id": "12345",
      "name": "Sample Item",
      "photoUrl": "https://example.com/photo.jpg",
      // ... your domain-specific fields
    }
  ]
}
```

**Tips:**
- Use realistic data that matches your domain
- Include edge cases (nulls, empty strings, missing fields)
- Add 5-20 items for testing pagination/filtering
- Keep file size reasonable (<5MB for build performance)

---

## 3. API Route Implementation

Create `src/pages/api/{feature}.ts`:

**Requirements:**
- Accept optional `id` query parameter
- If `id` provided, return single item matching that ID
- If no `id`, return full list of items
- Use mock data from JSON file OR connect to external API
- Add delay to simulate real API latency (optional)
- Include comprehensive logging

### Generic Implementation Pattern
```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import data from './{feature}.json';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  console.log('[API /api/{feature}] Query:', req.query);
  
  // Optional: Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  if (id && typeof id === 'string') {
    // Return single item
    const result = data.items.find((item) => item.id === id);
    console.log('[API /api/{feature}] Returning single result for id:', id, 'found:', !!result);
    res.status(200).json(result);
    return;
  }

  // Return full list
  console.log('[API /api/{feature}] Returning list count:', data.items.length);
  res.status(200).json(data);
  return;
};

export default handler;
```

**Advanced:** Replace JSON import with real API calls:
```typescript
// Fetch from external API instead of JSON
const response = await fetch(`https://api.example.com/{feature}/${id || ''}`);
const data = await response.json();
```

---

## 4. Middleware Configuration

Ensure middleware DOESN'T intercept your feature routes. There are two approaches:

### Approach A: Using Skip Function (Recommended)

Add a `skip` function to the multisite middleware configuration:

```typescript
// In src/middleware.ts
const multisite = new MultisiteMiddleware({
  sites,
  ...scConfig.api.edge,
  ...scConfig.multisite,
  skip: (req) => {
    // Skip multisite middleware for your feature routes
    // Pattern: /^\/(feature\/|feature(\/|$))/i
    return /^\/(blogs\/|locations(\/|$)|{feature}\/|{feature}(\/|$))/i.test(req.nextUrl.pathname);
  },
});
```

**Pattern Explanation:**
- `{feature}\/` - Matches detail pages like `/{feature}/item-id`
- `{feature}(\/|$)` - Matches listing page `/{feature}` and detail pages
- The regex test returns `true` to skip middleware for these routes

**Example for locations:**
```typescript
skip: (req) => {
  return /^\/(locations(\/|$))/i.test(req.nextUrl.pathname);
}
```

### Approach B: Using Matcher Config

Alternatively, exclude routes in the config matcher:

```typescript
// In src/middleware.ts
export const config = {
  matcher: [
    '/',
    '/((?!api/|search|{feature}|{feature}/|_next/|healthz|...).*)',
  ],
};
```

**Pattern:** Add your feature route to the exclusion list.

- `{feature}` excludes listing page
- `{feature}/` excludes detail pages
- Both patterns are needed for proper routing

### Important Notes:
- The skip function approach is more flexible and recommended for multiple features
- The matcher approach is simpler but requires updating the regex pattern
- Always test both listing (`/{feature}`) and detail (`/{feature}/item`) routes after configuration

---

## 5. Display Components

### A. Listing Component

Create `src/components/{Feature}Listing.tsx`:

**Purpose:** Display grid/list of all items from Sitecore page context.

### Generic Pattern
```typescript
import { JSX } from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { Card } from 'src/core/ui/card';
import Link from 'next/link';

export default function {Feature}Listing(): JSX.Element {
  const context = useSitecore();
  const { data } = context.page as unknown as { data: {Feature}Response };
  
  const items = data?.items ?? [];

  if (!items.length) {
    return <div className="text-muted-foreground">No items found.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="cursor-pointer">
          {item.photoUrl && (
            <img src={item.photoUrl} alt={item.name} className="w-full aspect-video object-cover" />
          )}
          <div className="p-6">
            <h3 className="font-bold text-lg">
              <Link href={`/{feature}/${item.id}`}>{item.name}</Link>
            </h3>
            {/* Add your custom fields here */}
          </div>
        </Card>
      ))}
    </div>
  );
}
```

### B. Detail Component

Create `src/components/{Feature}.tsx`:

**Purpose:** Display single item details from Sitecore page context.

```typescript
import { JSX } from 'react';
import { useSitecore } from '@sitecore-content-sdk/nextjs';
import { Card } from 'src/core/ui/card';

export default function {Feature}(): JSX.Element {
  const context = useSitecore();
  const item = (context.page as unknown as { itemData: {Feature}Item }).itemData;

  return (
    <Card className="p-6">
      {item?.photoUrl && (
        <img src={item.photoUrl} alt={item.name} className="w-full aspect-video object-cover" />
      )}
      <h1 className="text-2xl font-bold">{item?.name}</h1>
      {/* Add your custom fields here */}
    </Card>
  );
}
```

---

## 6. Listing Page (Index)

Create `src/pages/{feature}/index.tsx`:

### Requirements:
- Uses `getStaticProps` for SSG with ISR (revalidate: 5 seconds)
- Fetches data from API route or fallback to JSON
- Integrates with Sitecore page data
- Updates meta tags dynamically
- Handles preview/editing mode
- Displays items using your listing component

### Generic Pattern
```typescript
import { useEffect, JSX } from 'react';
import { GetStaticProps } from 'next';
import NotFound from 'src/NotFound';
import Layout from 'src/Layout';
import { extractPath, handleEditorFastRefresh } from '@sitecore-content-sdk/nextjs/utils';
import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import client from 'lib/sitecore-client';
import components from '.sitecore/component-map';
import {
  ComponentPropsContext,
  SitecoreProvider,
  SitecorePageProps,
} from '@sitecore-content-sdk/nextjs';
import scConfig from 'sitecore.config';

export const getStaticProps: GetStaticProps = async (context) => {
  let props;
  const path = extractPath(context);
  let page;
  let data;

  // Step 1: Fetch Sitecore page data
  if (context.preview && isDesignLibraryPreviewData(context.previewData)) {
    page = await client.getDesignLibraryData(context.previewData);
  } else {
    page = context.preview
      ? await client.getPreview(context.previewData)
      : await client.getPage(`${path}/{feature}`, { locale: context.locale });
  }
  
  if (page) {
    props = {
      page,
      dictionary: await client.getDictionary({
        site: page.siteName,
        locale: page.locale,
      }),
      componentProps: await client.getComponentData(page.layout, context, components),
    };
  }

  // Step 2: Fetch external data (API or JSON fallback)
  try {
    const baseUrl = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
    const isAbsolute = (() => {
      try {
        return Boolean(baseUrl) && new URL(baseUrl).origin.length > 0;
      } catch {
        return false;
      }
    })();
    const shouldFetch = isAbsolute && !process.env.CI;

    if (shouldFetch) {
      const url = `${baseUrl}/api/{feature}`;
      const res = await fetch(url);
      if (!res.ok) throw Error(`Error fetching data via API. Status: ${res.status}`);
      data = await res.json();
    }

    // Fallback to JSON if API unavailable
    if (!data) {
      const jsonModule = await import('../api/{feature}.json');
      data = jsonModule.default;
    }

    // Step 3: Inject data into Sitecore page context
    if (!props?.page?.layout.sitecore?.route) {
      throw new Error('Route is null');
    }
    
    const modifiedPage = {
      ...props?.page,
      data, // Inject external data here
      layout: {
        ...props?.page.layout,
        sitecore: {
          ...props?.page.layout.sitecore,
          route: {
            ...props?.page.layout.sitecore.route,
            fields: {
              ...props?.page.layout.sitecore.route.fields,
              MetaTitle: { value: `{Feature} - ${data.count} found` },
              MetaDescription: { value: `Browse our list of ${data.count} items.` },
            },
          },
        },
      },
    };

    return {
      props: {
        ...props,
        page: modifiedPage,
      },
      revalidate: 5, // ISR: Revalidate every 5 seconds
      notFound: !page,
    };
  } catch (error) {
    console.error('Error loading data in getStaticProps:', error);
    // ... error handling with JSON fallback
    return {
      props: { ...(props || {}) },
      revalidate: 5,
      notFound: !page,
    };
  }
};

const SitecorePage = ({ page, notFound, componentProps }: SitecorePageProps): JSX.Element => {
  useEffect(() => {
    handleEditorFastRefresh();
  }, []);

  if (notFound || !page) {
    return <NotFound />;
  }

  return (
    <ComponentPropsContext value={componentProps || {}}>
      <SitecoreProvider componentMap={components} api={scConfig.api} page={page}>
        <Layout page={page} />
      </SitecoreProvider>
    </ComponentPropsContext>
  );
};

export default SitecorePage;
```

### Key Data Flow:
1. **Fetch Sitecore page** → Get CMS content/layout
2. **Fetch external data** → API or JSON fallback
3. **Merge data** → Inject into `page.data` property
4. **Update meta tags** → Dynamic SEO fields
5. **Render** → Pass through Sitecore layout system

---

## 7. Detail Page (Wildcard Route)

Create `src/pages/{feature}/[...path].tsx`:

### Requirements:
- Uses catch-all route to handle any path under `/{feature}/*`
- Extracts item ID from final path segment
- Fetches specific item data from API or JSON
- Maps to wildcard Sitecore template (`{feature}/,-w-,`)
- Updates breadcrumbs dynamically
- Supports Sitecore Experience Editor

### Generic Pattern
```typescript
import { GetStaticPaths, GetStaticProps } from 'next';
import { StaticPath } from '../../types/common.types';
import { extractPath, handleEditorFastRefresh } from '@sitecore-content-sdk/nextjs/utils';
import { isDesignLibraryPreviewData } from '@sitecore-content-sdk/nextjs/editing';
import client from 'lib/sitecore-client';
import components from '.sitecore/component-map';
import {
  ComponentPropsContext,
  SitecorePageProps,
  SitecoreProvider,
} from '@sitecore-content-sdk/nextjs';
import { useEffect, JSX } from 'react';
import NotFound from 'src/NotFound';
import Layout from 'src/Layout';
import scConfig from 'sitecore.config';

interface ExtendedParams {
  requestPath?: string[];
  path?: string[];
}

/**
 * Utility: Convert Sitecore fields array into a clean object
 * Example: fields [{ name: "Title", value: "My Blog" }] => { Title: "My Blog" }
 */
function mapSitecoreFields(fields: { name: string; value: unknown }[] = []) {
  return fields.reduce((acc, field) => {
    acc[field.name.replace(/\s+/g, '')] = field.value;
    return acc;
  }, {} as Record<string, unknown>);
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Use blocking fallback to generate pages on first request
  // This speeds up build time and allows for dynamic content
  const paths: StaticPath[] = [];
  const fallback: boolean | 'blocking' = 'blocking';
  return {
    paths,
    fallback,
  };
};

const SitecorePage = ({ page, notFound, componentProps }: SitecorePageProps): JSX.Element => {
  useEffect(() => {
    handleEditorFastRefresh();
  }, []);

  if (notFound || !page) {
    return <NotFound />;
  }

  return (
    <ComponentPropsContext value={componentProps || {}}>
      <SitecoreProvider componentMap={components} api={scConfig.api} page={page}>
        <Layout page={page} />
      </SitecoreProvider>
    </ComponentPropsContext>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  if (!context.params || !Array.isArray(context.params.path)) {
    return { notFound: true };
  }
  
  // Extract item ID from final segment of wildcard path
  const itemId = context.params.path[context.params.path.length - 1];

  let page = null;
  let itemData: Record<string, unknown> = {};

  // Step 1: Fetch item via API or JSON
  try {
    const baseUrl = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
    const isAbsolute = (() => {
      try {
        return Boolean(baseUrl) && new URL(baseUrl).origin.length > 0;
      } catch {
        return false;
      }
    })();

    if (isAbsolute) {
      // Try API first
      const url = `${baseUrl}/api/{feature}?id=${encodeURIComponent(itemId)}`;
      const res = await fetch(url);
      if (res.ok) {
        const item: unknown = await res.json();
        if (item && typeof item === 'object') {
          const maybeFields = (item as { fields?: { name: string; value: unknown }[] }).fields;
          itemData = Array.isArray(maybeFields)
            ? mapSitecoreFields(maybeFields)
            : (item as Record<string, unknown>);
        }
      } else {
        console.error('Error fetching item via API. Status:', res.status);
      }
      
      // Fallback to JSON if API failed
      if (!itemData || Object.keys(itemData).length === 0) {
        const jsonModule = await import('../api/{feature}.json');
        const all = jsonModule.default?.items || [];
        const match = all.find((item: { id?: string; name?: string }) =>
          [item.id, item.name]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase() === String(itemId).toLowerCase())
        );
        if (match) {
          itemData = match as Record<string, unknown>;
        }
      }
    } else {
      // Use JSON directly
      const jsonModule = await import('../api/{feature}.json');
      const all = jsonModule.default?.items || [];
      const match = all.find((item: { id?: string; name?: string }) =>
        [item.id, item.name]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase() === String(itemId).toLowerCase())
      );
      if (match) {
        itemData = match as Record<string, unknown>;
      }
    }
  } catch (error) {
    console.error('Error fetching item via API:', error);
  }

  // Step 2: Fetch Sitecore wildcard page
  // Map to wildcard template: {feature}/,-w-,
  if (context.params && Array.isArray(context.params.path)) {
    (context.params as ExtendedParams).requestPath = context.params.path;
    context.params.path = [`{feature}/,-w-,`];
  }

  let props = {};
  const path = extractPath(context);

  if (context.preview && isDesignLibraryPreviewData(context.previewData)) {
    page = await client.getDesignLibraryData(context.previewData);
  } else {
    page = context.preview
      ? await client.getPreview(context.previewData)
      : await client.getPage(path, { locale: context.locale });
  }

  // Step 3: Inject item data into page context
  if (page) {
    if (!page.layout.sitecore?.route) {
      return { notFound: true };
    }
    
    props = {
      page: {
        ...page,
        itemData, // Inject external item data here
        layout: {
          ...page.layout,
          sitecore: {
            ...page.layout.sitecore,
            route: {
              ...page.layout.sitecore.route,
              fields: {
                ...page.layout.sitecore.route.fields,
                // Update meta tags dynamically
                MetaTitle: { value: itemData.name || 'Item Details' },
                MetaDescription: {
                  value: itemData.description || `View details for ${itemData.name}`,
                },
                MetaKeywords: { value: itemData.keywords || '' },
                MetaImage: {
                  value: {
                    src: itemData.photoUrl || '',
                    alt: itemData.name || 'Item Image',
                  },
                },
              },
            },
            context: {
              ...page.layout.sitecore.context,
              // Update breadcrumbs: Replace '*' placeholder with actual item name
              breadCrumbsContext: (
                page.layout.sitecore.context?.breadCrumbsContext as {
                  PageTitle: string;
                  Url: string;
                  HideInBreadcrumb: boolean;
                }[]
              )?.map((item) =>
                item.PageTitle === '*'
                  ? {
                      PageTitle: itemData?.name,
                      Url: `/{feature}/${itemData.id || ''}`,
                      HideInBreadcrumb: false,
                    }
                  : item
              ),
            },
          },
        },
      },
      dictionary: await client.getDictionary({
        site: page.siteName,
        locale: page.locale,
      }),
      componentProps: await client.getComponentData(page.layout, context, components),
    };
  }

  return {
    props,
    revalidate: 5,
    notFound: !page,
  };
};

export default SitecorePage;
```

### Key Wildcard Route Features:
- **Dynamic Path Handling**: `/{feature}/12345` fetches item with ID "12345"
- **Fallback Strategy**: API → JSON fallback for resilience
- **Field Mapping**: Converts Sitecore fields array to object (if needed)
- **Meta Tags**: Dynamic title, description, keywords, og:image
- **Breadcrumb Injection**: Replaces `*` placeholder with actual item name
- **SEO Optimization**: Item name and details in meta tags

### Data Injection Pattern:
```typescript
page: {
  ...page,
  itemData, // External data injected here (accessible via useSitecore hook)
  layout: {
    ...page.layout,
    sitecore: {
      route: {
        fields: {
          MetaTitle: { value: itemData.name },
          MetaDescription: { value: "Dynamic description" },
          MetaKeywords: { value: itemData.keywords },
          MetaImage: { value: { src: photoUrl, alt: name } }
        }
      },
      context: {
        breadCrumbsContext: [
          { PageTitle: "Home", Url: "/", HideInBreadcrumb: false },
          { PageTitle: "{Feature}", Url: "/{feature}", HideInBreadcrumb: false },
          { PageTitle: itemData.name, Url: `/{feature}/${itemData.id}`, HideInBreadcrumb: false }
        ]
      }
    }
  }
}
```

---

## 8. Helper Functions

Common utilities you may need:

### Sitecore Field Mapper
```typescript
function mapSitecoreFields(fields: { name: string; value: unknown }[]) {
  return fields.reduce((acc, field) => {
    acc[field.name.replace(/\s+/g, '')] = field.value;
    return acc;
  }, {} as Record<string, unknown>);
}
```

### Custom Formatters (Example)
```typescript
// Format address
function formatAddress(item: any): string {
  const parts = [
    item.street,
    item.city,
    item.state,
    item.zip,
  ].filter(Boolean).map(String);
  return parts.join(', ');
}

// Format distance
function formatDistance(distance?: number | null): string | null {
  if (distance == null || isNaN(distance)) return null;
  return `${Number(distance).toFixed(1)} mi`;
}

// Format currency
function formatPrice(price?: number | null): string | null {
  if (price == null) return null;
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD' 
  }).format(price);
}
```

---

## 9. File Structure

```
src/
  pages/
    {feature}/
      index.tsx          → /{feature} (listing page)
      [...path].tsx      → /{feature}/* (detail pages)
    api/
      {feature}.ts       → /api/{feature} (data endpoint)
      {feature}.json     → Mock data source
  components/
    {Feature}Listing.tsx → Listing grid component
    {Feature}.tsx        → Detail view component
  types/
    {Feature}.types.d.ts → TypeScript types
```

---

## 10. Route Behavior

- `/{feature}` → Shows all items (index.tsx)
- `/{feature}/12345` → Shows item with ID "12345" ([...path].tsx)
- `/{feature}/some-name` → Searches by name or ID ([...path].tsx)

### Static Generation:
- **Listing**: Pre-rendered at build time, ISR revalidate 5s
- **Details**: Uses `fallback: 'blocking'` for on-demand generation
- **Paths**: Empty paths array, pages generated on first request

---

## 11. Key Integration Points

### Sitecore Integration:
- Uses `@sitecore-content-sdk/nextjs` for page data
- Wraps in `SitecoreProvider` with component map
- Supports Experience Editor preview mode
- Uses `ComponentPropsContext` for component props
- Integrates with Layout component

### Environment Variables:
```env
PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID=...
NEXT_PUBLIC_DEFAULT_SITE_NAME=...
```

### Build vs Runtime:
- **Build**: Generates static listing page
- **Runtime**: Fetches API for fresh data (if PUBLIC_URL set)
- **Fallback**: Uses JSON if API unavailable
- **ISR**: Revalidates every 5 seconds

---

## 12. Error Handling

### Listing Page:
- Try API first, catch errors and fallback to JSON
- If both fail, show empty state: "No items found."
- Log all errors to console for debugging

### Detail Page:
- Try API with ID
- Fallback to searching JSON by ID or name (case-insensitive)
- If not found, return 404 (`notFound: true`)
- Log fetch errors but don't crash

---

## 13. Performance Optimizations

1. **Lazy Loading**: Images with `loading="lazy"`
2. **ISR**: 5-second revalidation for fresh data
3. **Blocking Fallback**: Generate detail pages on-demand
4. **Conditional Fetch**: Only call API if PUBLIC_URL is absolute
5. **Build-time Skip**: Don't fetch API in CI environment

---

## 14. Accessibility Features

1. **Links**: Use proper `<a>` tags (tel:, mailto:, etc.)
2. **Image Alt Text**: Always provide descriptive alt text
3. **Semantic HTML**: Use proper heading hierarchy (h1, h2, h3)
4. **ARIA Labels**: Where needed for screen readers
5. **Keyboard Navigation**: Clickable cards should be links

---

## 15. Testing Checklist

- [ ] Listing page shows all items
- [ ] Formatting functions work (null safe)
- [ ] Cards link to `/{feature}/{id}`
- [ ] Detail page loads for any ID
- [ ] API route returns single item by ID
- [ ] API route returns all items without ID
- [ ] Breadcrumbs update with item name
- [ ] Meta tags populate correctly
- [ ] Photos display or show empty state
- [ ] Links are clickable (external URLs, phone, etc.)
- [ ] Works in Sitecore Experience Editor
- [ ] Fallback to JSON works when API unavailable
- [ ] 404 for invalid IDs
- [ ] Middleware excludes feature routes
- [ ] ISR revalidation works

---

## 16. Customization Examples

### For Locations Feature:
Replace `{feature}` → `locations`
Replace `{Feature}` → `Locations`
Replace `itemData` → `locationData`
Replace `id` → `locationID`
Replace `name` → `locationName`

### For Products Feature:
Replace `{feature}` → `products`
Replace `{Feature}` → `Products`
Replace `itemData` → `productData`
Replace `id` → `productId`
Replace `name` → `productName`

### For Blog Articles:
Replace `{feature}` → `articles`
Replace `{Feature}` → `Articles`
Replace `itemData` → `articleData`
Replace `id` → `slug`
Replace `name` → `title`

---

## 17. Advanced: Alternative Approaches

### Option A: Connecting to Real APIs

Replace the API route mock with actual API calls:

```typescript
// src/pages/api/{feature}.ts
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  
  try {
    // Call external API
    const apiUrl = id 
      ? `https://api.example.com/{feature}/${id}`
      : `https://api.example.com/{feature}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};
```

### Option B: Using GraphQL (Sitecore Content)

For content stored in Sitecore, use GraphQL instead of external APIs:

```typescript
// src/pages/{feature}/[...path].tsx
import {
  createGraphQLClientFactory,
  GraphQLRequestClient,
} from '@sitecore-content-sdk/nextjs/client';

const ITEM_BY_NAME_QUERY = /* GraphQL */ `
  query ItemByName($name: String!) {
    search(where: { name: "_name", operator: EQ, value: $name }) {
      results {
        rendered
      }
    }
  }
`;

const clientFactory = createGraphQLClientFactory({
  api: scConfig.api,
  retries: scConfig.retries.count,
  retryStrategy: scConfig.retries.retryStrategy,
});

const graphQLClient = clientFactory();

export const getStaticProps: GetStaticProps = async (context) => {
  const params = (context.params || {}) as ExtendedParams;
  const segments = Array.isArray(params.path) ? params.path : [];
  const itemName = segments.length > 0 ? segments[segments.length - 1] : '';

  let page = null;

  try {
    if (itemName) {
      const result = await graphQLClient.request(ITEM_BY_NAME_QUERY, {
        name: itemName,
      });

      const rendered = result?.search?.results?.[0]?.rendered;
      if (rendered && rendered.sitecore) {
        page = {
          siteName: 'your-site-name',
          locale: context.locale || 'en',
          layout: rendered,
          mode: {
            isEditing: false,
            isDesignLibrary: false,
            isPreview: !!context.preview,
            isNormal: !context.preview,
          },
        };
      }
    }
  } catch (error) {
    console.error('Error fetching item via GraphQL:', error);
  }

  // Fallback: If no item found from GraphQL, use wildcard page for EE support
  if (!page) {
    if (context.params && Array.isArray((context.params as ExtendedParams).path)) {
      (context.params as ExtendedParams).requestPath = (context.params as ExtendedParams).path;
      (context.params as ExtendedParams).path = [`{feature}/,-w-,`];
    }

    const path = extractPath(context);
    page = context.preview
      ? await client.getPreview(context.previewData)
      : await client.getPage(path, { locale: context.locale });
  }

  if (page) {
    return {
      props: {
        page,
        dictionary: await client.getDictionary({
          site: page.siteName,
          locale: page.locale,
        }),
        componentProps: await client.getComponentData(page.layout, context, components),
      },
      revalidate: 5,
      notFound: false,
    };
  }

  return { notFound: true };
};
```

**When to use GraphQL approach:**
- Content is stored in Sitecore CMS
- You need to query Sitecore items directly
- You want to use Sitecore's search capabilities
- Example: Blog articles, news items, products managed in Sitecore

**When to use API/JSON approach:**
- Content comes from external systems
- Data is managed outside Sitecore
- You need to integrate with third-party APIs
- Example: Locations from provider API, external product catalogs

---

## 18. Common Pitfalls

1. **Middleware blocking routes**: Always exclude your feature routes using the `skip` function or matcher config
2. **Missing wildcard template**: Create `{feature}/,-w-,` page in Sitecore (exact format with commas)
3. **ISR not working**: Check PUBLIC_URL is absolute URL (not relative path)
4. **Meta tags not updating**: Ensure you're modifying `route.fields` within the page object
5. **Breadcrumbs not showing**: Check `breadCrumbsContext` exists and has `*` placeholder in Sitecore
6. **404 on detail pages**: Verify wildcard template path is correct format: `{feature}/,-w-,`
7. **Type errors**: Ensure your types match your data structure
8. **Data not injecting**: Make sure you're adding data to the correct level of page object
9. **API calls failing in build**: Use `!process.env.CI` check to skip API calls during CI builds
10. **Wrong field names**: When using location-specific data, ensure field names match (e.g., `locationResults` not `items`)

---

## Summary

This generic pattern provides:
✅ **Flexible Wildcard Routing** - Works for any content type
✅ **External Data Integration** - API or JSON sources
✅ **Sitecore CMS Integration** - Full EE support
✅ **Dynamic Meta Tags** - SEO optimized
✅ **ISR Performance** - Fast, fresh content
✅ **Error Handling** - Graceful fallbacks
✅ **TypeScript Safety** - Full type coverage
✅ **Responsive Design** - Mobile-first approach
✅ **Accessibility** - WCAG compliant patterns

### Key Architecture Pattern:
**Wildcard Routing** (`[...path].tsx`) + **External Data** (API/JSON) + **Dynamic Injection** (page context) + **Sitecore Layout** (CMS rendering)

### Use This Pattern For:
- Locations finder
- Product catalogs
- Blog/article systems
- Event listings
- Team/people directories
- Case studies/portfolio
- Documentation systems
- Any external data + CMS hybrid

---

## Quick Start Guide

1. **Copy this prompt** and replace `{feature}` with your feature name
2. **Create types** for your data structure
3. **Add mock JSON** data file
4. **Build API route** (mock or real)
5. **Update middleware** to exclude routes (use skip function approach)
6. **Create components** for display
7. **Build listing page** with ISR
8. **Build wildcard route** for details
9. **Test end-to-end**
10. **Deploy** 🚀

---

## 20. Real Implementation Reference

This documentation is based on the actual working implementation in the FastLane codebase:

### Locations Feature (External API Pattern):
- **Files**: 
  - `headapps/nextjs-starter/src/pages/locations/index.tsx`
  - `headapps/nextjs-starter/src/pages/locations/[...path].tsx`
  - `headapps/nextjs-starter/src/pages/api/locations.ts`
  - `headapps/nextjs-starter/src/components/LocationsListing.tsx`
  - `headapps/nextjs-starter/src/components/Location.tsx`
- **Pattern**: REST API with JSON fallback for external location data
- **Use Case**: Healthcare locations from external provider API

### Blogs Feature (GraphQL Pattern):
- **Files**:
  - `headapps/nextjs-starter/src/pages/blogs/[...path].tsx`
- **Pattern**: Sitecore GraphQL queries for CMS-managed content
- **Use Case**: Blog articles stored and managed in Sitecore CMS

### Middleware Configuration:
- **File**: `headapps/nextjs-starter/src/middleware.ts`
- **Pattern**: Uses `skip` function in MultisiteMiddleware with regex matching

**Note**: Both patterns are production-tested and follow Next.js + Sitecore best practices.
