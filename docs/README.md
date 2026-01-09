# FastLane Documentation

This directory contains the **Nextra** documentation site for Altudo's FastLane component and template library. 

> **What is this?** This is a Next.js-based documentation site that provides comprehensive developer documentation for the FastLane component library, with simple Vercel password protection for secure access.

## Purpose

This documentation serves three main purposes:

1. **Developer Reference**: Complete documentation with Sitecore templates, rendering parameters, data source structure, and usage guidelines
2. **AI Generation Input**: Structured documentation that works with AI tools (including Cursor) for component scaffolding and generation  
3. **Protected Content**: Secure documentation behind Vercel password protection for internal team access

## Technology Stack

- **Framework**: [Nextra](https://nextra.site/) (Next.js-based documentation)
- **Deployment**: [Vercel](https://vercel.com/) with automatic GitOps deployment
- **Styling**: Built-in Nextra theme with custom branding

## Local Development

### Prerequisites
- Node.js 18+ 
- NPM dependencies installed in this directory

### Commands

```bash
# Install dependencies
npm install

# Start development server (auth disabled by default)
npm run dev

# Build for production
npm run build

# Start production server locally
npm start
```

The dev server runs at `http://localhost:3001`

**Note**: Authentication is automatically disabled in development mode for easier local development.

## Deployment

### Vercel (Current)

The documentation automatically deploys to Vercel when changes are pushed to the `develop` branch via Vercel GitOps integration.

**Setup**: See `DEPLOYMENT_SETUP.md` for complete setup instructions.

### Automated Deployment

**Vercel GitOps** handles deployment automatically:
- Building the Nextra site with Next.js 15
- Deploying to Vercel with password protection
- Triggers on pushes to `develop` branch affecting `docs/**`

## Structure

```
docs/
├── pages/
│   ├── library/                    # 📚 Unified component/template library
│   │   ├── components/            # Component documentation  
│   │   │   ├── index.md          # Components overview
│   │   │   ├── content-card.md   # Individual component docs
│   │   │   └── _meta.ts         # Navigation metadata
│   │   ├── templates/             # Page template documentation
│   │   │   ├── index.md          # Page templates overview
│   │   │   ├── landing-page.md   # Individual template docs
│   │   │   └── _meta.ts         # Navigation metadata
│   │   └── _meta.ts              # Library navigation structure
│   ├── getting-started/
│   │   ├── installation.md        # Installation guide
│   │   ├── usage.md              # Usage guidelines
│   │   └── _meta.ts             # Navigation metadata
│   ├── for-developers/            # Developer documentation (workflow-based)
│   │   ├── start-here/           # 🏁 Essential setup and prerequisites
│   │   │   ├── index.md         # Getting started overview
│   │   │   ├── workflows/        # Step-by-step development workflows
│   │   │   │   ├── sitecore-component-prerequisites.md
│   │   │   │   ├── create-new-component.md
│   │   │   │   ├── enhance-existing-component.md
│   │   │   │   └── _meta.ts     # Workflows navigation
│   │   │   └── _meta.ts         # Start here navigation
│   │   ├── component-development/ # 🔧 AI-powered development and patterns
│   │   │   ├── index.md         # Component development overview
│   │   │   ├── ai-prompts/       # AI templates and prompts
│   │   │   │   ├── index.md     # AI prompts overview
│   │   │   │   ├── templates/    # Prompt templates
│   │   │   │   │   ├── create-component.md
│   │   │   │   │   ├── enhance-existing-component.md
│   │   │   │   │   ├── core-requirements.md
│   │   │   │   │   └── _meta.ts # Templates navigation
│   │   │   │   ├── examples/     # Usage examples
│   │   │   │   ├── guide-using-create-component-prompt.md
│   │   │   │   ├── guide-using-enhance-component-prompt.md
│   │   │   │   └── _meta.ts     # AI prompts navigation
│   │   │   ├── fastlane/        # FastLane development patterns
│   │   │   │   ├── index.md     # FastLane development overview
│   │   │   │   ├── component-development.md
│   │   │   │   ├── testing.md
│   │   │   │   ├── design-library.md
│   │   │   │   ├── core-architecture.md
│   │   │   │   └── _meta.ts     # FastLane navigation
│   │   │   └── _meta.ts         # Component development navigation
│   │   ├── tools-and-advanced/   # 🚀 Advanced tools and deeper concepts
│   │   │   ├── index.md         # Tools and advanced overview
│   │   │   ├── tools/           # Development tools
│   │   │   │   ├── index.md     # Tools overview
│   │   │   │   ├── figma-mcp-server-setup.md
│   │   │   │   └── _meta.ts     # Tools navigation
│   │   │   ├── content-sdk/     # Advanced architectural concepts
│   │   │   │   ├── index.md     # Content SDK overview
│   │   │   │   ├── component-architecture.md
│   │   │   │   └── _meta.ts     # Content SDK navigation
│   │   │   └── _meta.ts         # Tools and advanced navigation
│   │   ├── index.md              # Developer overview (main)
│   │   └── _meta.ts             # Developer section navigation
│   ├── for-designers/             # Designer documentation
│   │   ├── index.md              # Designer overview
│   │   ├── guide-design-theming-color-mapping-in-figma.md
│   │   └── _meta.ts             # Designer navigation
│   ├── for-project-management/    # Project management docs
│   │   ├── index.md              # PM overview
│   │   ├── guide-mapping-project-components-to-fastlane-components.md
│   │   └── _meta.ts             # PM navigation
│   ├── _app.tsx                   # Custom App component
│   ├── _meta.ts                  # Root navigation structure
│   └── index.md                   # Homepage
├── public/
│   ├── images/                    # Documentation assets
│   │   ├── components/           # Component screenshots
│   │   ├── templates/            # Template screenshots
│   │   └── guides/               # Guide illustrations
│   ├── logo_light.png            # Site logo (light theme)
│   ├── logo_dark.png             # Site logo (dark theme)
│   └── favicon.ico               # Site favicon
├── styles/
│   └── globals.css               # Global styles
├── middleware.ts                 # Simple middleware
├── next.config.mjs               # Next.js + Nextra configuration
├── theme.config.tsx              # Nextra theme configuration
├── package.json                  # Dependencies and scripts
└── DEPLOYMENT_SETUP.md           # Deployment instructions
```

## Nextra Routing & Critical Behavior

### **🚨 Critical Discovery: Index Page Relative Path Behavior**

**IMPORTANT**: Nextra handles `index.md` files differently for relative path resolution. This is crucial for link functionality.

#### **How Index Pages Work**
- When you're on `/for-developers/fastlane` (served by `/for-developers/fastlane/index.md`)
- The **relative path context** is `/for-developers/` (NOT `/for-developers/fastlane/`)
- This means `./component-development` resolves to `/for-developers/component-development` ❌
- You need `./fastlane/component-development` to get `/for-developers/fastlane/component-development` ✅

#### **Correct Link Patterns**

**From Index Pages:**
```markdown
<!-- From fastlane/index.md -->
[Component Development](./fastlane/component-development)  ✅
[Component Development](./component-development)           ❌

<!-- From library/components/index.md -->
[Content Card](./components/content-card)                  ✅
[Content Card](./content-card)                            ❌
```

**From Regular Pages:**
```markdown
<!-- From any regular .md file -->
[FastLane Guide](../fastlane/)                           ✅
[Component Development](../fastlane/component-development) ✅
```

#### **File Extension Rules**
- **Never use `.md` extensions** in links - Nextra handles routing automatically
- **Exception**: Index pages use directory paths without `/index`

**Examples:**
```markdown
[Component Development](./fastlane/component-development)  ✅
[Component Development](./fastlane/component-development.md) ❌
[FastLane Guide](./fastlane/)                              ✅
[FastLane Guide](./fastlane/index)                         ❌
```

### **Navigation Structure & Meta Files**

#### **Root Navigation** (`pages/_meta.ts`)
```typescript
export default {
  index: "🚀 FastLane Overview",
  "getting-started": "🏁 Getting Started",
  "for-developers": "👩‍💻 For Developers",
  "ai-prompts": "🤖 AI Prompts & Templates",
  "for-designers": "🎨 For Designers", 
  "for-project-management": "📋 For Project Management",
  library: "📚 Library"
};
```

#### **Section Navigation** (e.g., `for-developers/_meta.ts`)
```typescript
export default {
  index: "Developer Overview",
  "fastlane": "🎯 FastLane Development",
  "content-sdk": "🚀 Content SDK & Advanced",
  "tools": "🛠️ Development Tools"
};
```

### **Documentation Reorganization History**

This site underwent a major reorganization to improve navigation and fix critical routing issues:

#### **Phase 1: Library Unification (Dec 2024)**
- **Moved** `pages/components/` → `pages/library/components/`
- **Moved** `pages/templates/` → `pages/library/templates/`
- **Created** unified "📚 Library" navigation section
- **Updated** 30+ link references across 9 files

#### **Phase 2: Link Repair (Dec 2024)**
- **Discovered** index.md relative path behavior issue
- **Fixed** 70+ broken links across 7 index files
- **Standardized** link formatting (no `.md` extensions)
- **Established** correct relative path patterns

#### **Phase 3: Content Prioritization (Dec 2024)**
- **Prioritized** FastLane documentation over Content SDK
- **Repositioned** Content SDK as supporting technology
- **Updated** quick start guides to focus on FastLane

## Adding Documentation

### New Component

1. Create `pages/library/components/YourComponent.md`
2. Follow the structure in existing component docs
3. Add to `pages/library/components/_meta.ts` for navigation
4. Update `pages/library/components/index.md` with the new component
5. **CRITICAL**: Use correct relative paths from index page: `./components/your-component`

### New Page Template

1. Create `pages/library/templates/YourTemplate.md`
2. Follow the structure in existing template docs
3. Add to `pages/library/templates/_meta.ts` for navigation
4. Update `pages/library/templates/index.md` with the new template
5. **CRITICAL**: Use correct relative paths from index page: `./templates/your-template`

### New Developer Guide

1. Choose appropriate section: `fastlane/`, `content-sdk/`, or `tools/`
2. Create the `.md` file in the chosen directory
3. Add to the section's `_meta.ts` file
4. Update the section's `index.md` with proper relative paths
5. **CRITICAL**: From section index, use `./section-name/your-guide`

## AI Integration

The documentation is structured to work optimally with AI coding assistants and provides comprehensive context for development tasks:

### **Comprehensive Documentation Structure**

- **📚 Component Library**: 20+ production-ready components with full Sitecore integration
- **🎯 FastLane-Specific Guides**: Atomic design, testing, Design Library integration
- **🚀 Content SDK Integration**: Migration patterns, architectural concepts
- **🤖 AI Prompts & Templates**: Ready-to-use prompts for component generation
- **🛠️ Development Tools**: Figma MCP Server setup, testing strategies

### **AI-Optimized Features**

- **Structured Format**: Consistent markdown structure for easy parsing
- **Complete Examples**: Full implementation details with Sitecore field bindings
- **Figma Integration**: Direct links to design specifications with node IDs
- **Context Rich**: Usage patterns, best practices, common scenarios, and pitfalls
- **Testing Patterns**: Content SDK mocking, component testing examples
- **Architectural Guidance**: Atomic design principles, file organization

### **Using with Cursor & AI Development**

The documentation includes dedicated AI prompts and can be referenced for:

#### **Component Generation**
```
"Based on the FastLane ContentCard component documentation, create a new ProductCard component that includes price and rating fields, following the atomic design patterns and Content SDK integration shown in the FastLane development guide"
```

#### **Testing Creation**
```
"Generate comprehensive Vitest tests for this component using the FastLane testing patterns documented in the testing guide, including Content SDK mocking and page mode testing"
```

#### **Template Development**
```
"Create a product listing page template using FastLane components from the library documentation, following the page template patterns and layout guidelines"
```

### **AI Prompts Library**

The site includes ready-to-use AI prompts:
- **[Component Creation](ai-prompts/create-component)**: Complete template for generating FastLane components
- **[Unit Test Generation](ai-prompts/create-unit-test)**: Template for comprehensive test creation
- **[PR Descriptions](ai-prompts/pr-description)**: Structured pull request documentation

### **Integration with Figma MCP Server**

- **[Setup Guide](for-developers/tools/figma-mcp-server-setup)**: Complete setup for AI-powered design integration
- **Design Token Extraction**: Automated Tailwind CSS configuration from Figma
- **Component Analysis**: Direct AI access to Figma designs for accurate code generation

## Configuration

### Nextra Config

Key configurations in `next.config.mjs` and `theme.config.tsx`:

- **Framework**: Next.js with Nextra plugin
- **Theme**: Nextra docs theme with custom Microsoft branding  
- **Search**: Built-in search functionality
- **Navigation**: Automatic from `_meta.ts` files

### Vercel GitOps

The deployment workflow:
- Triggers on pushes to `develop` branch affecting `docs/**`
- Uses Node.js 18+
- Builds Next.js app with Nextra
- Deploys automatically via Vercel GitOps integration

## Maintenance

### Regular Updates

- Keep component documentation in sync with code changes
- Update Figma links when designs change
- Review and update installation instructions
- Maintain examples and code snippets
- Monitor Vercel password protection settings

### Content Review

- Verify all links work correctly
- Test password protection in production
- Validate code examples against current codebase
- Update screenshots and design references
- Test responsive design and dark mode

## Troubleshooting

### Local Development Issues

**Build errors:**
- Ensure all Nextra dependencies are installed
- Check for markdown syntax errors in `pages/**`
- Verify `_meta.ts` files are valid TypeScript (not JSON)
- Check for proper export syntax in `_meta.ts` files

**404 errors on navigation:**
- **MOST COMMON**: Check index.md relative path behavior (see critical discovery above)
- Verify file names match exactly (case-sensitive)
- Ensure `_meta.ts` entries match actual file names
- Check for `.md` extensions in links (should be removed)

### Deployment Issues

**Vercel deployment fails:**
- Check Vercel deployment logs in dashboard
- Verify root directory is set to `docs` in Vercel settings
- Ensure build completes successfully locally
- Check Next.js build logs for errors

### Common Link Issues

**Links returning 404:**
1. **Index page links**: Use `./section-name/page-name` format
2. **Regular page links**: Use `../section-name/page-name` format
3. **No `.md` extensions**: Remove all `.md` from links
4. **Case sensitivity**: Ensure exact filename matches

**Example fixes:**
```markdown
<!-- From fastlane/index.md -->
❌ [Component Development](./component-development.md)
❌ [Component Development](./component-development)
✅ [Component Development](./fastlane/component-development)

<!-- From any regular .md file -->
❌ [FastLane Guide](../fastlane/index.md)
❌ [FastLane Guide](../fastlane/index)
✅ [FastLane Guide](../fastlane/)
```

### Navigation Issues

**Missing pages in navigation:**
- Check `_meta.ts` file in the directory
- Verify exact filename matches `_meta.ts` entry
- Ensure proper TypeScript export syntax
- Check for typos in directory/file names

**Wrong navigation order:**
- Order in `_meta.ts` determines navigation order
- Use meaningful keys for better URL structure

For more help, see the [Nextra documentation](https://nextra.site/). 
