---
title: Azure DevOps Component Story Template
---

# Azure DevOps Component Story Template

Use this template in the Azure DevOps Work Item Description (User Story) to make component work unambiguous and directly convertible into an AI prompt for the Sitecore XMC Next.js application.

---

## 🚀 Quick Start

> **🔴 CRITICAL:** Azure DevOps Description field formatting depends on how you create the work item:
>
> - **Creating via API/MCP/Code?** → Use HTML template (Section 3) with `<p>`, `<h2>`, `<ul>`, `<pre><code>` tags
> - **Creating manually in UI?** → Use Markdown template (Section 2) and paste in Edit mode
>
> **If Description appears jumbled as one line, you're using the wrong format!**

| Field | Format | Example |
|-------|--------|---------|
| **Title** | `[ComponentName] Component - [Brief Description]` | `Badge Component - Status and Label Display` |
| **Tags** | `component`, `ai-prompt-ready` | `component; ai-prompt-ready` |
| **Description (API)** | Use HTML template (Section 3) | See Section 3 ⬇️ |
| **Description (Manual)** | Use Markdown template (Section 2) in Edit mode | See Section 2 ⬇️ |

---

## 📋 Instructions for Project Managers

### How to Create a Component Work Item:

1. **Create a new User Story or Issue** in Azure DevOps
2. **Set the Title** - Use format: `[ComponentName] Component - [Brief Description]`
   - Example: `Badge Component - Status and Label Display`
   - Example: `DatePicker Component - Interactive Date Selection`
3. **Add tags**: `component`, `ai-prompt-ready`
4. **Format the Description field** (see important note below ⚠️)
5. **Copy the template** below into the Description field
6. **Fill out all required sections** with specific details (see field descriptions)
7. **Review and validate** - ensure all fields are complete and accurate
8. **Set state** to "Ready for Prompt" when complete

### ⚠️ CRITICAL: Formatting the Description Field

**Azure DevOps Description fields are stored as HTML. The formatting method depends on how you create the work item:**

---

#### 🔴 **If Creating via API, MCP Tools, or Code (Most Common Issue)**

**The Description field MUST be in HTML format, NOT plain text or markdown.**

When using APIs, Azure DevOps stores the Description as HTML. If you pass plain text, it will appear as one jumbled line.

**Solution: Use HTML formatting with proper line breaks:**

```html
<h2>Component Overview</h2>
<p><strong>Component Name:</strong> Tooltip</p>
<p><strong>Type:</strong> Presentational</p>
<p><strong>Purpose:</strong> Display contextual information or helpful hints</p>
<p><strong>Usage Context:</strong> Used throughout the application on buttons, icons, and form fields</p>

<h3>Key Requirements</h3>
<ul>
  <li>Multiple placement options (top, bottom, left, right)</li>
  <li>Triggered by hover, focus, or programmatic control</li>
  <li>Accessible with proper ARIA attributes</li>
  <li>Smooth animations for enter/exit transitions</li>
</ul>

<h3>Design Reference</h3>
<ul>
  <li>Figma: <a href="https://figma.com/...">Design Link</a></li>
  <li>Use case examples: Icon tooltips, form field helpers</li>
</ul>

<hr />

<pre><code>
# ========================================
# Component Specification for AI Implementation
# ========================================

componentName: Tooltip
componentType: presentational
...rest of YAML...
</code></pre>
```

**Important HTML Tags:**

- `<h2>`, `<h3>` - Section headings
- `<p>` - Paragraphs (one per line of text)
- `<strong>` - Bold text
- `<ul>` and `<li>` - Bullet lists
- `<pre><code>` - Code blocks (YAML specification)
- `<hr />` - Horizontal separator line
- `<br />` - Line breaks (if needed)

---

#### 🟢 **If Creating Manually in Azure DevOps Web UI**

1. Click on the **Description** field in Azure DevOps
2. Switch to **"Edit" mode** (not "Preview")
3. Paste your content (plain markdown is OK here)
4. Azure DevOps will convert it to HTML automatically
5. Use the toolbar to add **bold**, *italic*, and bullet points as needed
6. Press `Shift + Enter` to force line breaks if needed
7. Use the "Preview" button to verify formatting before saving

**For Manual Entry: You can use the markdown template provided in Section 2 below.**

---

#### Common Issues & Solutions:

| Issue | Cause | Solution |
|-------|-------|----------|
| ❌ Text appears as one long line | Plain text sent via API | Use HTML format with `<p>`, `<br />`, `<h2>` tags |
| ❌ No line breaks | Missing HTML tags | Wrap each line in `<p>` tags or use `<br />` |
| ❌ Code block not formatted | Missing `<pre><code>` | Wrap YAML in `<pre><code>...</code></pre>` |
| ❌ Bullets don't show | Plain text list | Use `<ul><li>...</li></ul>` |
| ❌ Headings look like text | Plain text headers | Use `<h2>`, `<h3>` tags |

---

#### 📝 Template Provided in Two Formats:

- **Section 2 (below)**: Markdown format - for **manual pasting** in Azure DevOps UI
- **Section 3 (below)**: HTML format - for **API/programmatic creation**

### Important Guidelines:

- ✅ **Be specific** - Avoid vague terms like "modern", "clean" without examples
- ✅ **Link resources** - Include Figma URLs and documentation explicitly
- ✅ **Use design tokens** - Reference specific tokens from the Sitecore XMC design system
- ✅ **Complete all fields** - Empty fields will cause issues during implementation
- ✅ **Keep it readable** - The YAML format is both human and machine-readable

---

## 📝 Work Item Format

The work item description should contain **two sections**:

### Section 1: Human-Readable Summary (Top of Description)

Start with a brief overview in plain English for easy scanning:

```markdown
## Component Overview

**Component Name:** [ComponentName]  
**Type:** [Presentational/Container/Layout/Utility]  
**Purpose:** [One-line description of what this component does]  
**Usage Context:** [Where and how it will be used in the application]

### Key Requirements

- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

### Design Reference

- Figma: [Link to Figma design]
- Related Documentation: [Any relevant docs]

---
```

### Section 2: YAML Specification (For AI Implementation)

After the summary, include the complete YAML specification:

```yaml
# ========================================
# Component Specification for AI Implementation
# ========================================
# This YAML specification will be used to generate the component code.
# Please fill out all sections completely and accurately.

componentName: Button # REQUIRED: Exact name of the component (PascalCase, no spaces)
componentType: presentational # REQUIRED: presentational | container | layout | utility
summary: Concise one-line purpose of this component # REQUIRED: What does this component do?
context: Where and how it will be used (page/flow/feature in Sitecore XMC) # REQUIRED: Usage context

techStack:
  framework: Sitecore XMC + Next.js # FIXED: Do not change
  language: TypeScript # FIXED: Do not change
  styling: tailwind # FIXED: tailwind | css-modules | styled-components
  testing: jest + testing-library # FIXED: Do not change

design:
  figmaUrl: https://figma.com/file/... # REQUIRED: Full URL to Figma design
  screenshots: [] # OPTIONAL: URLs to design screenshots for reference
  designTokens: # REQUIRED: List all design tokens used (from design system)
    color: ["--color-primary", "--color-on-primary"] # Color tokens
    spacing: ["--space-2", "--space-3"] # Spacing tokens
    radius: ["--radius-md"] # Border radius tokens
    typography: ["--font-sans", "--text-sm"] # Typography tokens
  icon: null # OPTIONAL: Icon name if component uses icons (e.g., ChevronLeft)

variants: ["primary", "secondary", "ghost"] # REQUIRED: List all visual variants
sizes: ["sm", "md", "lg"] # REQUIRED: List all size options

props: # REQUIRED: List all component props with details
  - name: variant # Prop name (camelCase)
    type: "'primary' | 'secondary' | 'ghost'" # TypeScript type definition
    required: false # true if prop is required, false if optional
    default: "primary" # Default value if not provided
    description: Visual style # Human-readable description of the prop

  - name: size
    type: "'sm' | 'md' | 'lg'"
    required: false
    default: "md"
    description: Size scale

  - name: disabled
    type: "boolean"
    required: false
    default: false
    description: Disabled state

  - name: loading
    type: "boolean"
    required: false
    default: false
    description: Show progress state

  - name: onClick
    type: "(e: React.MouseEvent<HTMLButtonElement>) => void"
    required: false
    default: null
    description: Click handler

states: ["default", "hover", "focus-visible", "active", "disabled", "loading"] # REQUIRED: All visual states

accessibility: # REQUIRED: Accessibility requirements
  role: button # ARIA role for the component
  aria: # List of ARIA attributes needed
    - "aria-busy when loading"
  keyboard: ["Enter", "Space"] # Keyboard interactions supported
  focusRing: true # Whether component should show focus ring

i18n: # REQUIRED: Internationalization considerations
  translatableText: ["children", "ariaLabel"] # Which props/text need translation

performance: # REQUIRED: Performance constraints
  bundleBudgetKb: 3 # Maximum bundle size in kilobytes
  ssrSafe: true # Must work with server-side rendering
  avoidClientOnlyApis: true # Don't use window/document unless necessary

fileStructure: # REQUIRED: Where files should be created
  baseDir: src/components/ui/Button # Base directory for component files
  files: # List of files to generate
    - Button.tsx # Main component file
    - Button.test.tsx # Test file
    - index.ts # Barrel export

usageExample: | # REQUIRED: Example of how to use the component
  <Button variant="primary" size="md">Save</Button>

acceptanceCriteria: # REQUIRED: What must work for the component to be complete
  - Renders all variants and sizes
  - Meets a11y: axe has 0 violations
  - Keyboard: Enter/Space activates
  - Disabled prevents interactions
  - Loading shows progress and is aria-busy

definitionOfDone: # REQUIRED: Checklist for completion
  - Unit tests >= 90% statement coverage
  - All tests pass (npm test)
  - Types are strict (no any or unknown)
  - Uses provided design tokens only
  - Component is SSR-safe for Next.js

tags: ["component", "ai-prompt-ready"] # REQUIRED: Tags for Azure DevOps work item
```

---

## 📄 Section 3: HTML Template (For API/Programmatic Creation)

**Use this template when creating work items via API, MCP tools, or code:**

```html
<h2>Component Overview</h2>
<p><strong>Component Name:</strong> [ComponentName]</p>
<p><strong>Type:</strong> [Presentational/Container/Layout/Utility]</p>
<p><strong>Purpose:</strong> [One-line description of what this component does]</p>
<p><strong>Usage Context:</strong> [Where and how it will be used in the application]</p>

<h3>Key Requirements</h3>
<ul>
  <li>[Requirement 1]</li>
  <li>[Requirement 2]</li>
  <li>[Requirement 3]</li>
</ul>

<h3>Design Reference</h3>
<ul>
  <li>Figma: <a href="[Figma URL]">[Figma URL]</a></li>
  <li>Related Documentation: [Any relevant docs]</li>
</ul>

<hr />

<pre><code># ========================================
# Component Specification for AI Implementation
# ========================================
# This YAML specification will be used to generate the component code.
# Please fill out all sections completely and accurately.

componentName: [ComponentName] # REQUIRED: Exact name of the component (PascalCase)
componentType: [presentational] # REQUIRED: presentational | container | layout | utility
summary: [Concise one-line purpose] # REQUIRED: What does this component do?
context: [Where and how it will be used] # REQUIRED: Usage context

techStack:
  framework: Sitecore XMC + Next.js # FIXED: Do not change
  language: TypeScript # FIXED: Do not change
  styling: tailwind # FIXED: tailwind | css-modules | styled-components
  testing: jest + testing-library # FIXED: Do not change

design:
  figmaUrl: [Full Figma URL] # REQUIRED
  screenshots: [] # OPTIONAL
  designTokens:
    color: ["--color-primary", "--color-on-primary"]
    spacing: ["--space-2", "--space-3"]
    radius: ["--radius-md"]
    typography: ["--font-sans", "--text-sm"]
  icon: null # OPTIONAL

variants: ["primary", "secondary"] # REQUIRED
sizes: ["sm", "md", "lg"] # REQUIRED

props:
  - name: variant
    type: "'primary' | 'secondary'"
    required: false
    default: "primary"
    description: Visual style
  # Add more props as needed

states: ["default", "hover", "focus-visible", "active", "disabled"] # REQUIRED

accessibility:
  role: [button/status/dialog/etc] # REQUIRED
  aria:
    - "aria-label when appropriate"
    - "aria-busy when loading"
  keyboard: ["Enter", "Space"]
  focusRing: true

i18n:
  translatableText: ["children", "ariaLabel"]

performance:
  bundleBudgetKb: 3
  ssrSafe: true
  avoidClientOnlyApis: true

fileStructure:
  baseDir: src/components
  files:
    - [ComponentName].tsx
    - [ComponentName].test.tsx

usageExample: |
  &lt;[ComponentName] variant="primary" size="md"&gt;Content&lt;/[ComponentName]&gt;

acceptanceCriteria:
  - Renders all variants and sizes
  - Meets a11y: axe has 0 violations
  - Keyboard interactions work
  - All states render correctly

definitionOfDone:
  - Unit tests &gt;= 90% statement coverage
  - All tests pass (npm test)
  - Types are strict (no any or unknown)
  - Uses provided design tokens only
  - Component is SSR-safe for Next.js

tags: ["component", "ai-prompt-ready"]
</code></pre>
```

**Important Notes for HTML Template:**

- Use `&lt;` for `<` and `&gt;` for `>` inside `<code>` blocks for usage examples
- Keep proper indentation in the YAML (spaces, not tabs)
- All HTML must be on single lines or properly nested

---

## 📚 Complete Example

Below is a fully filled example showing both the human-readable summary and YAML specification:

---

**Work Item Title:** `AlertBanner Component - Inline Status Messages`

**Tags:** `component`, `ai-prompt-ready`

**Description:** *(Paste the content below in Edit mode)*

---

### Human-Readable Section:

```markdown
## Component Overview

**Component Name:** AlertBanner  
**Type:** Presentational  
**Purpose:** Display inline status messages (info, success, warning, error) to users  
**Usage Context:** Appears at the top of content areas on account and settings pages to communicate important information or feedback

### Key Requirements

- Four distinct visual variants for different message types (info, success, warning, error)
- Two size options (small for inline, medium for prominent messages)
- Optional dismiss functionality with persistent state
- Fully accessible with proper ARIA announcements

### Design Reference

- Figma: https://www.figma.com/file/ABC123/Design-System?node-id=42:101
- Screenshots: 
  - Success state: https://example.com/images/alert-success.png
  - Error state: https://example.com/images/alert-error.png

---
```

### YAML Specification Section:

```yaml
# ========================================
# Component Specification for AI Implementation
# ========================================

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
  screenshots:
    - https://example.com/images/alert-success.png
    - https://example.com/images/alert-error.png
  designTokens:
    color: ["--color-success", "--color-warning", "--color-error", "--color-surface", "--color-on-surface"]
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

  - name: size
    type: "'sm' | 'md'"
    required: false
    default: "md"
    description: Density of the banner

  - name: title
    type: "string"
    required: false
    default: ""
    description: Optional short title

  - name: children
    type: "React.ReactNode"
    required: true
    default: null
    description: Message content

  - name: dismissible
    type: "boolean"
    required: false
    default: false
    description: Whether the banner can be closed

  - name: onClose
    type: "() => void"
    required: false
    default: null
    description: Called when the close button is activated

states: ["default", "focus-visible", "dismissed"]

accessibility:
  role: status
  aria:
    - "aria-live='polite' for info/success"
    - "aria-live='assertive' for error"
  keyboard: ["Tab", "Enter", "Space"]
  focusRing: true

i18n:
  translatableText: ["title", "children"]

performance:
  bundleBudgetKb: 5
  ssrSafe: true
  avoidClientOnlyApis: true

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
  - Announces messages with appropriate aria-live

definitionOfDone:
  - Unit tests >= 90% statement coverage
  - All tests pass (npm test)
  - Types are strict (no any or unknown)
  - Uses provided design tokens only
  - Component is SSR-safe for Next.js

tags: ["component", "ai-prompt-ready"]
```

---

## 📖 Field Descriptions & Tips

### Component Information

- **componentName**: Use PascalCase, no spaces (e.g., AlertBanner, UserProfile, DatePicker)
- **componentType**: Choose based on component purpose:
  - `presentational`: UI components (buttons, cards, banners)
  - `container`: Data-fetching/logic components
  - `layout`: Page structure components (headers, grids)
  - `utility`: Helper components (providers, wrappers)
- **summary**: One clear sentence explaining what it does
- **context**: Where users will see/use this component

### Design Tokens

Design tokens are CSS variables from our design system. Common examples:

- **Colors**: `--color-primary`, `--color-success`, `--color-error`, `--color-warning`
- **Spacing**: `--space-1` (4px), `--space-2` (8px), `--space-3` (12px), `--space-4` (16px)
- **Typography**: `--font-sans`, `--text-xs`, `--text-sm`, `--text-base`, `--text-lg`
- **Radius**: `--radius-sm`, `--radius-md`, `--radius-lg`

### Props Definition

Each prop needs:

- **name**: camelCase property name
- **type**: TypeScript type (use union types like `'sm' | 'md' | 'lg'` for options)
- **required**: `true` if must be provided, `false` if optional
- **default**: Value used when prop is not provided
- **description**: Clear explanation of what the prop does

### Accessibility

- **role**: ARIA role (button, alert, dialog, navigation, etc.)
- **aria**: List specific ARIA attributes needed (aria-label, aria-live, aria-expanded, etc.)
- **keyboard**: Which keys should work (Enter, Space, Escape, Arrow keys, Tab)
- **focusRing**: Should visible focus indicator appear?

### Usage Example

Provide a realistic code example showing:

- Most common use case
- Required props filled in
- Typical prop values
- Proper component nesting if applicable

---

## ✅ Checklist Before Submitting

Before marking the work item as "Ready for Prompt", verify:

- [ ] **Title** follows format: `[ComponentName] Component - [Brief Description]`
- [ ] **Description formatting** is correct (line breaks preserved, not jumbled into one line)
- [ ] **Preview the work item** to ensure formatting looks correct
- [ ] Component name is clear and follows naming conventions
- [ ] Figma URL is valid and accessible
- [ ] All design tokens are listed (check with design team)
- [ ] All props are documented with types and defaults
- [ ] Variants and sizes are clearly defined
- [ ] Accessibility requirements are specified
- [ ] Usage example is realistic and complete
- [ ] Acceptance criteria are testable
- [ ] Tags `component` and `ai-prompt-ready` are applied
- [ ] Work item state is set to "Ready for Prompt"

---

## 🔗 Additional Resources

- **Implementation Standards**: See [Core Requirements](../templates/core-requirements)
- **Design System**: Reference your design system documentation
- **Component Architecture**: This template is specifically for Sitecore XMC Next.js components
- **Azure DevOps AI Prompt**: Use [Story → AI Prompt](./azuredevops-to-ai-component-prompt) to generate code from this spec

---

## ❓ Need Help?

### For Project Managers:

- **🔴 Description is jumbled/one line?** 
  - **If created via API/MCP/Code** → You MUST use HTML format (see Section 3)
  - **If created manually in UI** → Ensure you pasted in **Edit mode** (not Preview)

- **Formatting looks wrong?** 
  - **Via API** → Use HTML tags: `<h2>`, `<p>`, `<ul>`, `<li>`, `<pre><code>`
  - **Via UI** → Click the Description field, use the rich text toolbar

- **YAML code block not formatted?** 
  - **Via API** → Must wrap in `<pre><code>YAML here</code></pre>`
  - **Via UI** → Use the "Code" formatting button

- Not sure about design tokens? → Ask the design team or use placeholder like `[DESIGN_TOKEN_NAME]`
- Can't find Figma URL? → Ask the designer to share the link
- Unclear about props? → Describe the behavior you want, developers can help define props

### For Developers:

- Invalid YAML? → Use a YAML validator online
- Missing information? → Comment on the work item and tag the PM
- Ready to implement? → Copy the YAML section into the AI prompt template

### For Formatting Issues:

1. ⚠️ **Description appears as one long sentence**
   - **Solution:** You pasted in Preview/Read mode → Switch to Edit mode and paste again

2. ⚠️ **Line breaks are missing**
   - **Solution:** Manually press `Enter` after each line or use `Shift + Enter`

3. ⚠️ **Code blocks don't display properly**
   - **Solution:** Select the code, click the "Code" button in toolbar, or wrap in HTML `<pre><code>` tags

4. ⚠️ **Markdown isn't rendering**
   - **Solution:** Azure DevOps uses HTML/Rich Text, not pure Markdown. Use the toolbar buttons for formatting

