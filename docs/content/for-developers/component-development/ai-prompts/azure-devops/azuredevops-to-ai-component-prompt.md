---
title: Azure DevOps → AI Component Prompt
---

# Azure DevOps → AI Component Prompt

Paste the YAML spec from the Azure DevOps User Story (created using the [Azure DevOps Component Story Template](./azuredevops-component-story-template)) into the slot below. Use this prompt in Cursor to generate the component and auxiliary files for the Sitecore XMC Next.js application.

---

## 🎯 Quick Start

1. **Find your work item** in Azure DevOps with tags `component` and `ai-prompt-ready`
2. **Copy the YAML specification** from the Description field
3. **Paste the prompt below** into Cursor (or your AI assistant)
4. **Replace the placeholder** with your YAML spec
5. **Run the prompt** to generate production-ready code

---

## 📋 The Prompt

Copy the entire prompt below and paste it into your AI assistant:

````text
You are generating a production-ready React/TypeScript UI component for a Sitecore XMC Next.js application based on this YAML spec:

[SPEC START]
<PASTE YAML FROM THE AZURE DEVOPS STORY HERE>
[SPEC END]

Requirements:
- Implement exactly as specified in the YAML: props, variants, sizes, states, accessibility requirements, and design tokens.
- Tech stack: Sitecore XMC + Next.js + TypeScript; testing with Jest + React Testing Library.
- Follow design tokens and constraints precisely. No placeholders, no TODOs, no dead code.
- Accessibility: implement all specified role/aria attributes and keyboard interactions; ensure focus-visible states are properly styled.
- Performance: ensure SSR-safe code, minimal bundle size, avoid client-only APIs unless explicitly required.
- All prop types must be strictly typed (no any or unknown).

Output the following files as separate code blocks with explicit paths:
- path=<baseDir>/<ComponentName>.tsx (main component implementation)
- path=<baseDir>/<ComponentName>.test.tsx (comprehensive unit tests covering all states/variants; include axe accessibility tests if configured)
- path=<baseDir>/index.ts (clean barrel export)

Conventions:
- Name the component exactly as specified in componentName field.
- Use strong TypeScript typing for all props and internal state.
- Apply styling as specified in the YAML (e.g., Tailwind classes, CSS modules, or design tokens).
- Ensure the component matches the usageExample provided.
- Follow Next.js best practices for server and client components.

Start your response with the component files only. No explanatory prose before the code blocks.
````

---

## 📝 Example Usage

### Step 1: Copy YAML from Azure DevOps

From a work item titled "AlertBanner Component - Inline Status Messages":

```yaml
componentName: AlertBanner
componentType: presentational
summary: Inline banner for status messages (info, success, warning, error)
context: Appears at the top of content areas on account and settings pages

techStack:
  framework: Sitecore XMC + Next.js
  language: TypeScript
  styling: tailwind
  testing: jest + testing-library

design:
  figmaUrl: https://www.figma.com/file/ABC123/Design-System?node-id=42:101
  designTokens:
    color: ["--color-success", "--color-warning", "--color-error", "--color-info"]
    spacing: ["--space-2", "--space-3", "--space-4"]
    radius: ["--radius-sm"]
    typography: ["--font-sans", "--text-sm"]
  icon: Info

variants: ["success", "warning", "error", "info"]
sizes: ["sm", "md"]

props:
  - name: variant
    type: "'success' | 'warning' | 'error' | 'info'"
    required: true
    default: "info"
    description: Visual style of the alert

  - name: children
    type: "React.ReactNode"
    required: true
    description: Message content

  - name: dismissible
    type: "boolean"
    required: false
    default: false
    description: Whether the banner can be closed

  - name: onClose
    type: "() => void"
    required: false
    description: Called when the close button is activated

states: ["default", "focus-visible", "dismissed"]

accessibility:
  role: status
  aria:
    - "aria-live='polite' for info/success"
    - "aria-live='assertive' for error"
  keyboard: ["Tab", "Enter", "Space"]
  focusRing: true

fileStructure:
  baseDir: src/components/ui/AlertBanner
  files:
    - AlertBanner.tsx
    - AlertBanner.test.tsx
    - index.ts

usageExample: |
  <AlertBanner variant="success" dismissible>
    Profile updated successfully.
  </AlertBanner>

acceptanceCriteria:
  - Renders info, success, warning, error variants
  - Dismissible renders and triggers onClose
  - Axe has 0 violations
  - Supports keyboard focus on close button

definitionOfDone:
  - Unit tests >= 90% statement coverage
  - Types are strict (no any or unknown)
  - Component is SSR-safe for Next.js
```

### Step 2: Paste into the Prompt

Replace `<PASTE YAML FROM THE AZURE DEVOPS STORY HERE>` with the YAML above.

### Step 3: Generated Output

The AI will output three files:

1. **`src/components/ui/AlertBanner/AlertBanner.tsx`** - Main component
2. **`src/components/ui/AlertBanner/AlertBanner.test.tsx`** - Unit tests
3. **`src/components/ui/AlertBanner/index.ts`** - Barrel export

---

## 🔄 Automation Notes

### Finding Ready Work Items

Use Azure DevOps WIQL or board filters to find candidates:

```sql
SELECT [System.Id], [System.Title], [System.State]
FROM WorkItems
WHERE [System.TeamProject] = @project
  AND [System.Tags] CONTAINS 'component'
  AND [System.Tags] CONTAINS 'ai-prompt-ready'
  AND [System.State] = 'Ready for Prompt'
ORDER BY [System.CreatedDate] DESC
```

### Post-Generation Workflow

After generating code:

1. **Review the generated code** for accuracy and completeness
2. **Run tests** to verify functionality: `npm test`
3. **Check accessibility** with automated tools
4. **Post generated code** as a comment on the Azure DevOps work item for traceability
5. **Update work item state** to "In Progress" or "Done"

---

## 🎯 Best Practices

### Before Running the Prompt

- ✅ Verify the YAML is valid (use a YAML validator)
- ✅ Ensure all required fields are filled
- ✅ Check that design tokens match your design system
- ✅ Confirm file paths are correct for your project structure

### After Running the Prompt

- ✅ Review generated TypeScript types
- ✅ Verify all props are implemented correctly
- ✅ Run the test suite to check coverage
- ✅ Test accessibility with axe or similar tools
- ✅ Verify SSR compatibility (no `window` or `document` usage)

### Common Adjustments

The generated code may need minor adjustments for:

- **Import paths**: Adjust based on your project's alias configuration
- **Design token mapping**: Map YAML tokens to actual CSS variables
- **Testing utilities**: Add project-specific test helpers
- **Storybook stories**: Add if required (not generated by default)

---

## 🔗 Related Resources

- [Component Story Template](./azuredevops-component-story-template) - How to create the YAML spec
- [Component Creation Template](../templates/create-component) - Alternative prompt for Figma-based creation
- [Unit Test Creation Template](../templates/create-unit-test) - Standalone test generation
- [Core Requirements](../templates/core-requirements) - FastLane coding standards

