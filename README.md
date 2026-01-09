# FastLane Component & Template Library

> **A design-first Sitecore XM Cloud project with comprehensive component documentation for developers and AI generation.**

FastLane is a production-ready component and template library built for Sitecore XM Cloud, following a **design-first approach** from Figma to code. This project emphasizes front-end first development and provides structured documentation that works with both developers and AI coding assistants.

## 🚀 Quick Start

### **New to FastLane?** → Start with the Documentation
📚 **[Browse the FastLane Documentation](docs/)** - Complete component library with usage examples, Sitecore configuration, and AI-ready specifications.

### **Ready to Develop?** → Jump into Code
💻 **[headapps/nextjs-starter/](headapps/nextjs-starter/)** - Main development environment with all FastLane components implemented.

## 🎯 What is FastLane?

FastLane is a **comprehensive component library** that provides:

- **🔧 Production-Ready Components** - Built for Sitecore XM Cloud with TypeScript and modern React patterns
- **🎨 Design System Integration** - Direct Figma specifications with component mappings
- **🤖 AI-Generation Ready** - Structured documentation for AI tools (Cursor, GitHub Copilot, etc.)
- **📋 Developer Documentation** - Complete Sitecore templates, rendering parameters, and implementation guides
- **⚡ Front-End First Development** - Following [Sitecore's recommended approach](https://doc.sitecore.com/xmc/en/developers/xm-cloud/set-up-your-local-development-environment.html)

## 📁 Project Structure

```
xmc-fast-lane/
├── docs/                     # 📚 Comprehensive documentation site
│   ├── pages/                # 📄 All documentation (markdown files)
│   │   ├── components/       # Component library docs
│   │   ├── templates/        # Page template docs
│   │   ├── getting-started/  # Setup and usage guides
│   │   └── for-developers/   # Developer-specific guides
│   ├── SETUP.md              # Local development quick start
│   └── DEPLOYMENT_SETUP.md   # Production deployment guide
├── headapps/nextjs-starter/  # 💻 Main development environment
│   ├── src/components/       # FastLane component implementations
│   └── src/stories/          # Storybook stories
├── authoring/                # 🏗️ Sitecore serialization items
│   └── items/Feature/FastLane/ # Component definitions
└── figma/                    # 🎨 Figma integration tools
```

## 🏃‍♂️ Development Workflow

### 1. **Frontend Development** (Start Here)

```bash
# Connect to XM Cloud environment
cd headapps/nextjs-starter
npm install

# Get .env.local from XM Cloud Deploy Portal:
# 1. Login to XM Cloud Deploy Portal
# 2. Navigate to your Environment → Developer Settings  
# 3. Copy the sample .env contents
# 4. Create .env.local file and paste contents

npm run dev
# → Site available at http://localhost:3000
```

### 2. **Browse Documentation**

```bash
# View the complete component library
cd docs
npm install
npm run dev
# → Docs available at http://localhost:3001
```

### 3. **Design-First Approach**

1. **Figma Design** → Component specifications with design tokens
2. **Documentation** → Create/update component docs in `docs/pages/components/`
3. **Implementation** → Build component in `headapps/nextjs-starter/src/components/`
4. **Sitecore Integration** → Add templates and items in `authoring/items/`

## 📚 Documentation

The **[FastLane Documentation](docs/)** is the best place to get started. It includes:

- **Component Library** - Complete specifications with Sitecore integration
- **Getting Started Guides** - Installation, setup, and usage
- **Developer Guides** - Implementation patterns and best practices  
- **Template Library** - Pre-built page templates and layouts
- **AI Integration** - Structured content for AI-assisted development

**Key Documentation Locations:**
- `docs/pages/components/` - Individual component documentation
- `docs/pages/getting-started/` - Setup and installation guides
- `docs/pages/for-developers/` - Developer-specific documentation
- `docs/pages/templates/` - Page template specifications

## 🤝 Contributing

### Adding New Components

1. **Document First** - Create component specification in `docs/pages/components/YourComponent.md`
2. **Implement** - Build component in `headapps/nextjs-starter/src/components/YourComponent.tsx`
3. **Sitecore Integration** - Add templates in `authoring/items/Feature/FastLane/YourComponent/`
4. **Stories** - Create Storybook story in `headapps/nextjs-starter/src/stories/YourComponent.stories.tsx`

### Documentation Guidelines

- Follow existing component documentation structure
- Include Figma design links and node IDs
- Provide complete Sitecore field configurations
- Add usage examples and implementation notes
- Update navigation in `docs/pages/*/\_meta.ts` files

### Code Standards

- **TypeScript** for all new components
- **Responsive design** with mobile-first approach
- **Accessibility** following WCAG guidelines
- **Performance** considerations for Sitecore XM Cloud

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, ShadCN UI
- **Documentation**: Nextra (Next.js-based), Vercel Password Protection
- **CMS**: Sitecore XM Cloud with Content SDK
- **Design**: Figma integration with design tokens
- **Development**: Storybook, ESLint, Prettier

## 📋 Prerequisites

- **Node.js 18+** 
- **Access to Sitecore XM Cloud Environment**
- **Figma access** (for design specifications)

## 🔗 Important Links

- **[Sitecore XM Cloud Documentation](https://doc.sitecore.com/xmc)**
- **[Front-End First Development Guide](https://doc.sitecore.com/xmc/en/developers/xm-cloud/set-up-your-local-development-environment.html)**
- **[FastLane Documentation](docs/)** (Start here!)

---

**Questions?** Check the [FastLane Documentation](docs/) or review the component specifications in `docs/pages/components/`.
