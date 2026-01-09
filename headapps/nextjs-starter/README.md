# FastLane Next.js Development Environment

> **The main development environment for FastLane components built with Sitecore XM Cloud + Next.js**

This is the primary development environment where FastLane components are implemented and tested. It connects to Sitecore XM Cloud and provides a full development experience with component libraries, Storybook, and testing.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Bootstrap the Project

```bash
npm run bootstrap
```

### 3. Connect to XM Cloud

**Get your environment configuration:**

1. **Login to [XM Cloud Deploy Portal](https://deploy.sitecorecloud.io/)**
2. **Navigate to your Environment** → **Developer Settings tab**
3. **Ensure Preview toggle is enabled**
4. **Copy the sample `.env` contents** from the "Local Development" section

**Create your local environment file:**

```bash
# Create .env.local file in this directory (headapps/nextjs-starter/)
# Paste the contents from XM Cloud Deploy Portal
```

### 4. Start Development

```bash
# Start the development environment
npm run dev

# OR start Storybook for component development:
npm run start:storybook # Component stories and documentation
```

**🌐 Your FastLane site will be available at:** `http://localhost:3000`
**📚 Storybook will be available at:** `http://localhost:6006`

## 🛠️ Available Commands

### Development
- `npm run bootstrap` - **Setup and build** (required after install)
- `npm run dev` - **Main development** (connects to XM Cloud)
- `npm run next:dev` - Next.js development server only
- `npm run start:storybook` - Component stories and documentation

### Building & Testing
- `npm run build` - Production build
- `npm run start` - Run production build locally
- `npm run test` - Run unit tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - ESLint code analysis

### Component Development
- `sitecore-tools project component scaffold {component}` - Generate new component with templates
- `npm run bootstrap` - Generate component builder configurations

## 🏗️ Project Structure

```
src/
├── components/          # 🧩 FastLane component implementations
│   ├── Accordion.tsx    # Individual components
│   ├── ContentCard.tsx  # with TypeScript interfaces
│   └── ...              # and Sitecore field bindings
├── stories/             # 📖 Storybook stories
│   ├── Accordion.stories.tsx
│   └── ...
├── lib/                 # 🔧 Utilities and configurations
├── types/               # 📝 TypeScript type definitions
└── Layout.tsx           # Main layout component
```

## 📋 Environment Setup Details

### Required Environment Variables

Your `.env.local` file should include (copied from XM Cloud Deploy):

```bash
# Sitecore Configuration
NEXT_PUBLIC_SITECORE_API_KEY=your-api-key
NEXT_PUBLIC_SITECORE_API_HOST=https://your-instance.sitecorecloud.io
SITECORE_EDGE_CONTEXT_ID=your-context-id
NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID=your-context-id
SITECORE_EDGE_URL=https://edge-platform.sitecorecloud.io
NEXT_PUBLIC_SITECORE_EDGE_URL=https://edge-platform.sitecorecloud.io

# Site Configuration
NEXT_PUBLIC_DEFAULT_SITE_NAME=fastlanewebsite
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
SITECORE_EDITING_SECRET=your-editing-secret

# Personalization (optional)
NEXT_PUBLIC_PERSONALIZE_SCOPE=your-scope
PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT=1000
```

### XM Cloud Connection Troubleshooting

**Common Issues:**

1. **"Cannot connect to Sitecore"**
   - Verify your `.env.local` file is in the correct directory (`headapps/nextjs-starter/`)
   - Check that the API key and host URL are correct
   - Ensure Preview mode is enabled in XM Cloud Deploy

2. **"Component not rendering"**
   - Run `npm run bootstrap` to regenerate component configurations
   - Check that components are properly registered in Sitecore
   - Use `sitecore-tools project component scaffold {component}` to ensure proper component structure

3. **"Build fails"**
   - Run `npm run lint` to check for code issues
   - Ensure all dependencies are installed with `npm install`

## 🎨 Component Development Workflow

### 1. Design-First Approach
1. **Review Figma designs** in the [FastLane Documentation](../../docs-nextra/)
2. **Check component specifications** for implementation details
3. **Follow TypeScript interfaces** defined in the docs

### 2. Implementation
1. **Create component** in `src/components/YourComponent.tsx`
2. **Add Sitecore field bindings** using Content SDK helpers
3. **Implement responsive design** with Tailwind CSS
4. **Add TypeScript types** in `src/types/`

### 3. Testing & Stories
1. **Create Storybook story** in `src/stories/YourComponent.stories.tsx`
2. **Add unit tests** following existing patterns
3. **Test in connected mode** with XM Cloud data

### 4. Documentation
1. **Update component docs** in `../../docs-nextra/pages/components/`
2. **Include usage examples** and Sitecore configuration
3. **Document props and variants**

## 📚 Related Documentation

- **[FastLane Documentation](../../docs-nextra/)** - Complete component library and usage guides
- **[Sitecore XM Cloud Docs](https://doc.sitecore.com/xmc)** - Official XM Cloud documentation
- **[Content SDK for XM Cloud](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html)** - Sitecore Content SDK documentation
- **[Content SDK Repository](https://github.com/Sitecore/content-sdk)** - Official Content SDK GitHub repository

## 🔧 Technology Stack

- **Next.js 15** - React framework with SSR/SSG
- **TypeScript** - Type safety and developer experience  
- **Tailwind CSS** - Utility-first CSS framework
- **ShadCN UI** - Component library foundation
- **Sitecore Content SDK** - Modern Sitecore integration layer
- **Storybook** - Component development and documentation
- **Vitest** - Unit testing framework

---

**Need help?** Check the [FastLane Documentation](../../docs-nextra/) or review component examples in the `src/components/` directory.

