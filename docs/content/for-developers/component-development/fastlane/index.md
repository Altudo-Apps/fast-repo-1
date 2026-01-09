# FastLane Development

Welcome to the FastLane development guides! This section covers everything you need to know about building components and features within the FastLane framework.

## 🎯 FastLane Overview

FastLane is a **headless Next.js starter kit** built on the **Sitecore Content SDK**, designed for rapid development of high-quality, content-managed websites using **atomic design principles**.

### Key Features

- 🏗️ **Atomic Design Architecture** - Components, molecules, atoms, and UI layers
- 🎭 **Design Library Integration** - Built-in component showcase and variant generation
- 🧪 **Comprehensive Testing** - Vitest + React Testing Library with Content SDK mocking
- 🎨 **Tailwind CSS** - Modern, utility-first styling approach
- 📱 **Responsive Design** - Mobile-first development patterns
- ♿ **Accessibility First** - WCAG 2.1 AA compliance built-in

## 📚 Development Guides

### [Component Development](./fastlane/component-development)
Learn how to create components within the FastLane framework, covering:
- Basic component patterns and structure
- useSitecore hook usage and page context
- Atomic design implementation
- Content SDK field rendering
- Best practices and file organization

### [Testing Guide](./fastlane/testing)
Comprehensive testing strategies for FastLane components:
- Content SDK mocking patterns
- Page mode testing (editing, Design Library, etc.)
- Atomic component testing approaches
- Performance and accessibility testing
- Real-world test examples from the FastLane codebase

### [Design Library](./fastlane/design-library)
FastLane's Design Library integration for component showcase:
- Understanding Design Library mode vs. SXA Partial Designs
- Optimizing components for Design Library
- Layout integration and setup
- Testing Design Library components

### [Core Architecture](./fastlane/core-architecture)
Deep dive into FastLane's architectural patterns:
- Project structure and organization
- Atomic design structure (components, atoms, molecules, UI)
- Context architecture and state management
- Data flow and build architecture
- Configuration and development workflow

## 🚀 Getting Started Workflow

New to FastLane development? Follow this recommended learning path:

1. **[Core Architecture](./fastlane/core-architecture)** - Understand the overall structure
2. **[Component Development](./fastlane/component-development)** - Learn component patterns
3. **[Testing Guide](./fastlane/testing)** - Set up testing workflows
4. **[Design Library](./fastlane/design-library)** - Integrate with component showcase

## 🎯 FastLane vs. Content SDK

**FastLane-Specific Patterns** (this section):
- Atomic design implementation
- Component organization and structure  
- Testing strategies with real FastLane examples
- Design Library integration patterns
- Project-specific architectural decisions

**General Content SDK** (see [Content SDK guides](../tools-and-advanced/content-sdk/)):
- Content SDK features and capabilities
- Migration patterns from JSS
- General component architecture concepts

## 🛠️ Development Tools

### Required Tools
- **Node.js 18+** - Runtime environment
- **npm/yarn** - Package management
- **TypeScript** - Type safety and developer experience
- **Vitest** - Testing framework
- **Tailwind CSS** - Styling framework

### Recommended Tools
- **[Figma MCP Server](../tools-and-advanced/tools/figma-mcp-server-setup)** - Design integration
- **ESLint + Prettier** - Code quality and formatting
- **Cursor** - AI-powered development assistance

## 📊 FastLane Component Types

### Components (`/components`)
**Sitecore-integrated components** that connect directly to the CMS:
```typescript
// Example: ArticleDate component
export const Default = (props: ArticleDateProps): JSX.Element => {
  const { page } = useSitecore();  // Sitecore integration
  // Component logic with CMS awareness
};
```

### Atoms (`/core/atom`)
**Base UI elements** - the fundamental building blocks:
- `SitecoreImage` - Image rendering with Content SDK
- `SitecoreLink` - Link rendering with Content SDK
- Form elements, icons, basic UI components

### Molecules (`/core/molecules`)
**Composite components** that combine multiple atoms:
- `ContentCard` - Combines image, text, and link atoms
- `NavigationItem` - Complex navigation patterns
- `SearchBox` - Form elements with interaction logic

### UI Components (`/core/ui`)
**Pure design system components** (no Sitecore dependencies):
- `breadcrumb` - Navigation patterns
- `card` - Card component variants
- `button` - Button design system
- `form` - Form controls and layouts

## 🎨 Development Principles

### 1. Atomic Design First
- Build from atoms → molecules → organisms → templates
- Compose higher-level components from lower-level ones
- Maintain clear separation of concerns

### 2. Content SDK Integration
- Use `useSitecore()` hook for CMS context
- Implement proper field rendering patterns
- Handle page modes (editing, Design Library, preview)

### 3. Responsive & Accessible
- Mobile-first responsive design
- WCAG 2.1 AA compliance
- Semantic HTML and proper ARIA attributes

### 4. Test-Driven Development
- Comprehensive unit test coverage
- Mock Content SDK appropriately
- Test both happy path and edge cases

### 5. Performance Optimization
- Lazy loading and code splitting
- Efficient re-rendering patterns
- Bundle size optimization

## 🔧 Development Commands

```bash
# Install dependencies
npm install
npm run bootstrap

# Start development server
npm run dev

# Run tests
npm test
npm run test:watch
npm run test:coverage

# Lint and format
npm run lint
npm run format

# Build for production
npm run build
npm run start
```

## 🎯 Next Steps

**Ready to start building with FastLane?**

1. 📖 **Read [Component Development](./fastlane/component-development)** to understand FastLane patterns
2. 🧪 **Review [Testing Guide](./fastlane/testing)** to set up your testing workflow  
3. 🎭 **Explore [Design Library](./fastlane/design-library)** for component showcase
4. 🏗️ **Study [Core Architecture](./fastlane/core-architecture)** for deep understanding

---

**FastLane accelerates your Sitecore headless development** with proven patterns, comprehensive tooling, and a focus on **developer experience** and **component quality**! 🚀 