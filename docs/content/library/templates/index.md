# Page Templates Overview

This section contains documentation for all FastLane page templates - complete page layouts and structures that define how content is organized and presented in Sitecore XM Cloud.

## Available Page Templates

### Landing Pages

Templates optimized for marketing and conversion:

| Template | Description | Status |
|----------|-------------|--------|
| [Landing Page](./templates/landing-page) | Standard landing page layout for marketing campaigns | ✅ Complete |
| [Landing Page with Sidebar](./templates/landing-page-with-sidebar) | Landing page layout with complementary sidebar content | ✅ Complete |

### Content Pages

Templates for standard content pages:

| Template | Description | Status |
|----------|-------------|--------|
| [Content Page with Sidebar](./templates/content-page-with-sidebar) | Standard content page layout with sidebar for navigation and related content | ✅ Complete |

### Article & News Pages

Templates for editorial and news content:

| Template | Description | Status |
|----------|-------------|--------|
| [News Article Page](./templates/news-article-page) | Template for news articles and blog posts | ✅ Complete |

### Listing Pages

Templates for content aggregation and browsing:

| Template | Description | Status |
|----------|-------------|--------|
| [List Page](./templates/list-page) | Template for content listing and aggregation pages | ✅ Complete |

## Page Template Structure

Each page template documentation includes:

1. **Template Information**: Sitecore template path, ID, and inheritance
2. **Layout Configuration**: Placeholder structure and rendering definitions
3. **Content Structure**: Page sections and content organization
4. **Page Fields**: SEO metadata, hero content, and page-specific fields
5. **Component Usage**: Which FastLane components are used and how
6. **Usage Guidelines**: When to use this template vs alternatives
7. **Content Editor Guide**: Instructions for content creation and management

## Page Template Features

All FastLane page templates include:

- **Responsive Design**: Mobile-first layouts with breakpoint optimization
- **SEO Optimization**: Meta tags, structured data, and semantic HTML
- **Component Integration**: Seamless use of FastLane components
- **Content Editor Friendly**: Intuitive editing experience in Sitecore Pages
- **Performance Optimized**: Lazy loading, efficient rendering, and caching

## Layout Components

Page templates are built using these layout patterns:

- **Header/Navigation**: Site-wide navigation and branding
- **Hero Sections**: Banner areas with calls-to-action
- **Content Areas**: Main content with flexible component placement
- **Sidebar Areas**: Secondary content and navigation
- **Footer**: Site-wide footer with links and information

## Documentation Resources

- **[Page Documentation Template](./templates/page-documentation-template)**: Template for documenting new page templates

## Contributing

To document a new page template:

1. Create a new `.md` file in this directory
2. Follow the [page documentation template](./templates/page-documentation-template)
3. Update the sidebar navigation in `.vitepress/config.mjs`
4. Add the template to the appropriate category table above

## Design Patterns

Common page layout patterns used in FastLane:

- **Single Column**: Full-width content for articles and basic pages
- **Sidebar Layout**: Main content with complementary sidebar
- **Grid Layout**: Multi-column content organization
- **Landing Page**: Conversion-focused layout with hero and features
- **List/Detail**: Browse and detail page combinations 
