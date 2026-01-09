# AI Prompts & Templates

FastLane includes powerful AI prompts for accelerating development workflows. These prompts are designed to generate high-quality, FastLane-compatible code that follows all architectural patterns and best practices.

## 🧠 **Why FastLane AI Works: Context is King**

FastLane AI prompts succeed where generic code generation fails because **context is everything**. Our prompts provide comprehensive context that enables AI to generate production-ready code:

### **Rich Context Sources**
- **📚 Comprehensive Documentation**: Complete field definitions, rendering parameters, business logic patterns, and implementation examples
- **🎨 Figma Design Integration**: Direct access to designs with exact node IDs, semantic variables, and design system patterns  
- **🔧 Proven Code Patterns**: Real working examples with Sitecore Content SDK integration and ShadCN UI composition
- **⚠️ Anti-Pattern Knowledge**: Built-in awareness of common pitfalls and how to avoid them (width issues, TypeScript errors, etc.)
- **🎯 Preservation Requirements**: Clear boundaries between what must be preserved vs what can be customized
- **🧪 Testing Patterns**: Comprehensive test examples that validate both functionality and integration

### **Context-Driven Results**
- ✅ **Functional Components**: AI generates components that work immediately in Sitecore Page Editor
- ✅ **Correct Patterns**: Follows FastLane conventions for buttons, layouts, accessibility, and responsive design
- ✅ **Zero Boilerplate**: No generic code - everything is specific to FastLane architecture and customer needs
- ✅ **Preservation Guarantee**: Sitecore functionality preserved through explicit context about what not to change

## �� Available Prompts

### [Using Component Creation Prompt](./ai-prompts/guide-using-create-component-prompt)
Complete guide for using the create-component.md prompt to create high-quality, Sitecore-integrated React components from Figma designs.

### [Using Component Enhancement Prompt](./ai-prompts/guide-using-enhance-component-prompt)
Step-by-step guide for enhancing existing FastLane components to match customer designs while preserving all Sitecore functionality.

### [Using Unit Test Creation Prompt](./ai-prompts/guide-using-create-unit-test-prompt)
Comprehensive guide for generating unit tests that follow FastLane project conventions and test all major functionality.

---

### [Component Creation Template](./ai-prompts/templates/create-component)
The core prompt template for creating new components from Figma designs with full Sitecore integration. Features comprehensive patterns for button/link implementation, layout, typography, and common pitfall avoidance.

### [Component Enhancement Template](./ai-prompts/templates/enhance-existing-component)
Specialized prompt for enhancing existing FastLane components to match customer branding and design requirements while guaranteeing preservation of all Sitecore Content SDK integration and business logic.

### [Unit Test Creation Template](./ai-prompts/templates/create-unit-test)
Template for generating comprehensive Vitest unit tests that follow FastLane project conventions and test all major functionality.

### [PR Description Template](./ai-prompts/templates/pr-description)
Structured template for creating detailed pull request descriptions with proper git analysis and markdown formatting.

---

## 🔗 Azure DevOps Integration

### [Azure DevOps Component Story Template](./ai-prompts/azure-devops/azuredevops-component-story-template)
Template for creating Azure DevOps User Stories that are directly convertible into AI prompts. Includes YAML specification format, HTML/Markdown formatting options, and complete field descriptions for unambiguous component requirements.

### [Azure DevOps → AI Component Prompt](./ai-prompts/azure-devops/azuredevops-to-ai-component-prompt)
Prompt template for converting Azure DevOps User Stories (with YAML specs) into AI-generated components. Enables seamless workflow from project management to code generation.

---

### Feature Implementation Examples

### [Complete Wildcard Routing Feature Guide](./examples/wildcard-routing-feature)
Comprehensive guide for implementing listing and detail pages with wildcard routing:
- **Two Proven Patterns**: External API/JSON pattern (locations) OR GraphQL pattern (blogs)
- **Wildcard Routing**: Dynamic `[...path].tsx` pattern  
- **API Integration**: Mock API with JSON fallback strategy (External pattern)
- **GraphQL Integration**: Sitecore content queries (GraphQL pattern)
- **Data Injection**: Dynamic meta tags and breadcrumb injection
- **ISR Support**: Incremental Static Regeneration with 5s revalidate
- **Sitecore Integration**: Full Content SDK integration with Experience Editor support
- **Real Examples**: Based on working `locations` and `blogs` implementations

**Use this pattern for:** Locations, Providers, Products, Blog Posts, Events, or any entity requiring listing + detail pages.

## 🎯 AI-Powered Development Workflows

### New Component Development
1. **Design Integration**: Use Figma MCP Server for direct design access
2. **Component Creation**: Use the [Component Creation Template](./ai-prompts/templates/create-component) with Figma designs
3. **Test Generation**: Generate comprehensive tests using the [Unit Test Creation Template](./ai-prompts/templates/create-unit-test)
4. **Documentation**: Use PR description generator for comprehensive change documentation

### Existing Component Enhancement
1. **Design Preparation**: Copy FastLane components and apply customer branding in Figma
2. **Component Enhancement**: Use the [Component Enhancement Template](./ai-prompts/templates/enhance-existing-component) to preserve functionality while updating visuals
3. **Integration Testing**: Validate Sitecore Page Editor functionality and content author workflows
4. **Documentation**: Generate component diff summaries and team handoff materials

## 📚 Related Guides

- **[Figma MCP Server Setup](./ai-prompts/../../tools-and-advanced/tools/figma-mcp-server-setup)** - Required for design integration
- **[FastLane Component Development](./fastlane/component-development)** - Understanding component patterns
- **[FastLane Testing Guide](./fastlane/testing)** - Testing strategies
- **[Team Workflow - Customer Implementation](../../../getting-started/team-workflow#customer-implementation-workflow-work-in-progress)** - End-to-end customer project process

---

**Ready to accelerate your FastLane development with AI?** Start with the [Component Creation Prompt Guide](./ai-prompts/guide-using-create-component-prompt) for new components or the [Component Enhancement Guide](./ai-prompts/guide-using-enhance-component-prompt) for customizing existing ones! 🚀 