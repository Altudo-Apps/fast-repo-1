# Figma Design Tokens Workflow

This guide documents the complete workflow for syncing Figma design tokens to your Next.js project using Tailwind CSS v4's CSS-first configuration.

> **Note:** This guide shows you how to use the pre-built Figma plugin included in this project. You need Figma developer access to install and run local plugins.

## Overview

The design token pipeline transforms Figma variables into a single CSS file that integrates with Tailwind v4:

```
┌─────────────────┐     ┌────────────────────────┐     ┌──────────────────┐
│     Figma       │ ──► │  all-variables.json    │ ──► │ figma-theme.css  │
│  Design Tokens  │     │  (exported tokens)     │     │ (Tailwind v4)    │
└─────────────────┘     └────────────────────────┘     └──────────────────┘
                                   │
                                   ▼
                        ┌───────────────────────┐
                        │ generate-figma-       │
                        │ theme.ts              │
                        └───────────────────────┘
```

## File Structure

```
figma/
├── all-variables.json          # Input: Exported from Figma plugin
├── generate-figma-theme.ts     # Script: Generates figma-theme.css
└── figma-theme.css             # Output: Complete Tailwind v4 theme

headapps/nextjs-starter/
└── style/
    └── main.css                # Imports the generated CSS
```

## Generated File: `figma-theme.css`

A single file containing everything needed for Tailwind v4:

```css
@theme {
  /* Colors reference CSS variables for dynamic dark mode */
  --color-primary: var(--primary);
  --color-background: var(--background);
  
  /* Static values from Figma */
  --font-size-2xl: 24px;
  --spacing-4: 16px;
  --radius-lg: 8px;
  /* ... */
}

:root {
  --primary: #0c4a6e;
  --background: #ffffff;
  /* ... light mode values ... */
}

.dark {
  --primary: #bae6fd;
  --background: #082f49;
  /* ... dark mode overrides ... */
}

@keyframes accordion-down { /* ... */ }
```

**Includes:**
- `@theme` block for Tailwind v4 utilities (`bg-primary`, `text-2xl`, `p-4`)
- `:root` CSS variables for light mode
- `.dark` CSS variables for dark mode
- Keyframe animations

## Step-by-Step Workflow

### Step 1: Build and Install the Figma Plugin

The plugin code is already provided in the `figma/` directory. You just need to build and install it in your Figma application.

#### 1.1 Build the Plugin

1. **Open terminal** in your IDE and navigate to the `figma/` folder:

   ```bash
   cd figma
   ```

2. **Install dependencies** (if not already installed):

   ```bash
   npm install
   ```

3. **Build the plugin**:

   ```bash
   npm run build
   ```

   This compiles the plugin code and creates a `dist/` folder with the necessary files.

#### 1.2 Install Plugin in Figma

1. **Open Figma Desktop App** and navigate to **Design Mode** in your design file.

   ![screenshot](/images/guides/figma-design-mode.png "screenshot")

2. **Install the plugin locally**:
   - Click the **Actions** button (located at the bottom center of Figma)
   - Select **Plugins & widgets** → **Development** → **Import plugin from manifest**
   - Navigate to your project's `figma/dist/` folder
   - Select the `manifest.json` file

   ![screenshot](/images/guides/cursor-action-&-manifest.png "screenshot")

3. The plugin **"FastLane - Extract Variables"** will now appear in your development plugins list and is ready to use.

> **Important:** You need to have Figma edit access (full access) to install development plugins.

### Step 2: Export Variables from Figma

1. **Open your Figma design file** that contains the design tokens/variables you want to extract.

2. **Run the plugin**:
   - Click the **Actions** button (bottom center)
   - Select **Plugins** → **Development** → **FastLane - Extract Variables**
   - The plugin will extract all variables from your Figma file

3. **Save the output**:
   - The plugin will prompt you to choose a download location
   - Save the file (it will be named something like `figma-variables.json`)

4. **Copy the extracted variables**:
   - Open the downloaded JSON file
   - Copy all the content
   - Paste it into `figma/all-variables.json` in your project (replace the existing content)

### Step 2: Generate CSS

Navigate to the figma directory and run the generation script:

```bash
cd figma
npm run generate-theme    # Creates figma-theme.css
```

Or use the shorthand:

```bash
cd figma
npm run generate          # Same as generate-theme
```

### Step 3: Import in Your Project

In your `main.css`, import the generated theme file:

```css
@import "tailwindcss";
@import "../../figma/figma-theme.css";

/* Your app-specific customizations */
@theme {
  /* Custom font families (from Next.js localFont) */
  --font-family-satoshi: var(--font-satoshi), sans-serif;
  --font-family-zodiak: var(--font-zodiak), sans-serif;
  
  /* App-specific additions not in Figma */
  --height-600: 600px;
}
```

## Integration Strategy

### Recommended: Import + Override

The best approach is to **import the generated file** and add app-specific customizations separately:

```css
@import "tailwindcss";
@import "../../figma/figma-theme.css";  /* Base tokens from Figma */

/* App-specific overrides */
@theme {
  /* Custom values not in Figma */
  --font-family-satoshi: var(--font-satoshi), sans-serif;
  --width-600: 600px;
  --height-137: 137px;
}

/* App-specific scoping */
:root, .fastlanewebsite {
  --quaternary: var(--accent);
  --slate: #f1f5f9;
}
```

**Benefits:**
- Single source of truth from Figma
- App customizations clearly separated
- Easy to regenerate without losing custom values
- Later `@theme` blocks override earlier ones

### What to Keep in `main.css`

After importing `figma-theme.css`, keep only app-specific values:

| Keep in `main.css` | Why |
|-------------------|-----|
| Custom font families | Set by Next.js `localFont` |
| Semantic aliases (`--font-size-h1`) | App-specific naming |
| Custom heights (`--height-137`, `--height-600`) | Not standard Tailwind |
| App-specific colors (`--quaternary`, `--slate`) | Project-specific |
| Component styles | Slick carousel, utilities |

### What to Remove from `main.css`

These are now provided by `figma-theme.css`:

- Standard font sizes (`--font-size-xs` through `--font-size-9xl`)
- Standard spacing (`--spacing-0` through `--spacing-96`)
- Standard widths/heights (matching Tailwind defaults)
- Standard radii, shadows, z-index values
- Color mappings in `@theme` block
- Base `:root` and `.dark` color definitions

## NPM Scripts Reference

Located in `figma/package.json`:

| Command | Description |
|---------|-------------|
| `npm run generate-theme` | Generate `figma-theme.css` |
| `npm run generate` | Alias for `generate-theme` |
| `npm run generate-tailwind-config:legacy` | Legacy Tailwind v3 config |

## Script Details

### `generate-figma-theme.ts`

This unified script:
1. Reads `all-variables.json` (collections format)
2. Extracts TailwindCSS and Theme collections
3. Flattens nested token structures
4. Resolves token references (e.g., `{color.primary}` → `#0c4a6e`)
5. Adds `px` units where appropriate
6. Creates Tailwind v4 `@theme` block
7. Outputs `:root` and `.dark` CSS variables
8. Generates keyframe animations

All in a single step, producing one file: `figma-theme.css`

## Tailwind v4 Theme Mapping

The generated `@theme` block maps Figma tokens to Tailwind utilities:

| Figma Token | Tailwind Variable | Utility Class |
|-------------|-------------------|---------------|
| `primary` color | `--color-primary` | `bg-primary`, `text-primary` |
| `font-size.2xl` | `--font-size-2xl` | `text-2xl` |
| `spacing.4` | `--spacing-4` | `p-4`, `m-4`, `gap-4` |
| `border-radius.lg` | `--radius-lg` | `rounded-lg` |
| `shadow.md` | `--shadow-md` | `shadow-md` |

## Dark Mode Support

The generated CSS includes automatic dark mode support:

```css
/* Light mode (default) */
:root {
  --primary: #0c4a6e;
  --background: #ffffff;
}

/* Dark mode (when .dark class is applied) */
.dark {
  --primary: #bae6fd;
  --background: #082f49;
}
```

In your app, toggle dark mode by adding the `.dark` class:

```tsx
<html className={isDarkMode ? "dark" : ""}>
  {/* Colors automatically switch */}
</html>
```

## Troubleshooting

### Variables not updating?

1. Ensure you saved the latest Figma export to `all-variables.json`
2. Run `npm run generate` in the `figma/` directory
3. Check that your `main.css` imports the generated file
4. Hard refresh your browser (Ctrl+Shift+R)

### Missing design tokens?

Check that your Figma file has the expected collections:
- **TailwindCSS** - Standard Tailwind values
- **Theme** - Color tokens with light/dark modes

### Script errors?

```bash
cd figma
npm install  # Ensure dependencies are installed
npm run generate
```

## When to Regenerate

Run `npm run generate` after:

- Exporting new tokens from Figma
- Adding new variables in Figma
- Updating color values in Figma
- Adding new spacing/sizing tokens

## Related Documentation

- [Figma MCP Server](./figma-mcp-server-setup) - AI-powered Figma access for component generation
- [Global Styling Guide](/library/components/global-styling-guide) - Using design tokens in components
- [Create Component Prompt](../../component-development/ai-prompts/templates/create-component) - AI-powered component generation using design tokens

---

**Pro Tip:** Set up a Git hook or CI step to regenerate CSS files when `all-variables.json` changes, ensuring your codebase always matches the latest Figma designs.

