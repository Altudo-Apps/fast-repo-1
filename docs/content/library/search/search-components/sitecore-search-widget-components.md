## Prompt: Configure Sitecore Search Widget Components

Use this template to configure and validate all Search widget components in one go.

### Goal
- Configure and verify Sitecore Search widgets (Search Input, Facets, Sort, Pagination, ResultsPerPage, Spinner, Result Cards) per project conventions and Figma styles.

### Inputs
- Repo root: `headapps/nextjs-starter`
- Figma references: include links specific to each component
- rfkId for composition: e.g., `RFKID_1001`
- Expected index/entity: `content` or `product`
- Env vars present in `.env.local`

### Tasks
1) Validate dependencies are installed: `@sitecore-search/react`, `@sitecore-search/ui`, `@sitecore-search/common`, `@radix-ui/react-icons`.
2) Ensure stubs exist for molecules: Filter, SearchFacets, SortOrder, ResultsPerPage, SearchPagination, Spinner, and a Card component.
3) Verify Search Input behavior:
   - Button-click only search (no search on typing).
   - If input is empty, fallback to `innovation`.
   - Reset page to 1 on click before search.
   - Use existing Button atom and Figma-aligned styles.
4) Verify Facets behavior:
   - Show down-arrow on facet header; rotate up when expanded.
   - Value rows selectable with checkbox, counts visible.
   - Price range uses slider; others list values.
5) Verify SortOrder behavior:
   - Options wired from API choices; selected value updates sort.
6) Verify Pagination and ResultsPerPage behavior:
   - Pagination shows first/prev/numbered/next/last.
   - ResultsPerPage updates items per page.
7) Verify Spinner and empty state:
   - Spinner overlays on fetching; 0 results shown when empty.
8) Wire page component with `rfkId` and run lints.

### Acceptance Criteria
- No linter errors.
- All imports resolve and widgets render.
- Search triggers only on Search button click, resets to page 1, and respects fallback keyphrase.
- Facet header arrow rotates on expand; range facet uses slider; value counts visible.
- SortOrder, Pagination, ResultsPerPage, Spinner work as expected.

