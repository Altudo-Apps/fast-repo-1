---
title: MCP Workflow & Setup
---

# MCP Workflow & Setup

This guide covers the complete setup and workflow for using Model Context Protocol (MCP) servers to generate components from Figma designs using shadcn/ui.

---

## 📋 Prerequisites

Before starting, ensure you have:

- **Cursor IDE** (v0.40+) with MCP support
- **Figma account** with access to design files
- **Node.js** (v18+) and npm installed
- **shadcn/ui** initialized in your project

---

## 🔐 Figma Access Requirements

This workflow requires **two separate Figma access methods**. These are independent requirements that serve different purposes:

| Requirement | Purpose | Cost | Where to Get |
|-------------|---------|------|--------------|
| **Personal Access Token (PAT)** | API authentication for MCP server | ✅ Free | Figma Settings page |
| **Dev Mode Access** | Copy component URLs with node-id | 💰 May require paid plan | Figma Editor toggle |

---

### Method 1: Personal Access Token (PAT) - For API Authentication

The PAT allows the MCP server to communicate with Figma's API. This is **free** for all Figma accounts.

**Direct Link:** [https://www.figma.com/settings](https://www.figma.com/settings)

**Step-by-step:**

1. **Open Figma** in your browser at [figma.com](https://www.figma.com)
2. **Click your profile avatar** (top-right corner of the screen)
3. **Select "Settings"** from the dropdown menu
4. **Scroll down** to find the **"Personal access tokens"** section
5. **Click "Generate new token"** button
6. **Enter a description** (e.g., "Cursor MCP Integration")
7. **Set expiration** (optional - choose "No expiration" for convenience)
8. **Click "Generate token"**
9. **⚠️ IMPORTANT: Copy the token immediately!** - It will only be shown once

> **💡 Tip:** Store your token securely (e.g., in a password manager). If you lose it, you'll need to generate a new one.

---

### Method 2: Dev Mode Access - For Copying Component URLs

Dev Mode allows you to select a component in Figma and get the URL with the correct `node-id`. This may require a **paid Figma plan** (Professional, Organization, or Enterprise).

**How to check if you have Dev Mode:**

1. Open any Figma design file
2. Look for the **"<> Dev Mode"** toggle in the top-right toolbar
3. If you can click it and switch to Dev Mode, you have access

**How to enable Dev Mode:**

1. Open your Figma file
2. Press `Shift + D` or click the **"<> Dev Mode"** toggle in the top-right toolbar
3. The interface will switch to Dev Mode view (darker UI with code-focused panels)

**Why you need Dev Mode:**

- When you select a component in Dev Mode, the browser URL automatically updates with the `node-id`
- This `node-id` is required for MCP to target the specific component
- Without Dev Mode, you cannot get the node-specific URL

> **⚠️ Don't have Dev Mode?** Contact your Figma workspace admin or upgrade your plan. Alternatively, ask a team member with Dev Mode access to copy the URLs for you.

---

## 🔧 MCP Server Setup

### MCP Configuration File Location

**Windows**: `C:\Users\{username}\.cursor\mcp.json`
**macOS**: `~/.cursor/mcp.json`

---

## 🖥️ Option A: Desktop Setup (Recommended)

Use this setup if you have the **Figma desktop app** installed. This provides the best experience with real-time connection to your designs.

### Requirements
- ✅ Figma desktop app installed
- ✅ Dev Mode access (may require paid plan)
- ✅ Figma desktop app running with Dev Mode enabled

### Step 1: Configure Figma MCP (Desktop)

The Figma desktop app runs a local MCP server when Dev Mode is enabled.

Add to your `mcp.json`:

```json
{
  "mcpServers": {
    "figma": {
      "url": "http://127.0.0.1:3845/mcp"
    }
  }
}
```

> **📝 How it works:** When you enable Dev Mode in the Figma desktop app, it starts a local server on port `3845`. The MCP connection uses this local server to communicate with Figma.

### Step 2: Configure shadcn MCP

Add the shadcn MCP server:

```json
{
  "mcpServers": {
    "figma": {
      "url": "http://127.0.0.1:3845/mcp"
    },
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

### Complete Desktop mcp.json

```json
{
  "mcpServers": {
    "figma": {
      "url": "http://127.0.0.1:3845/mcp"
    },
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

### Verify Desktop Setup

1. **Open Figma desktop app**
2. **Enable Dev Mode** (`Shift + D`)
3. **Restart Cursor**
4. Open command palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
5. Type "MCP" and verify Figma tools appear

---

## 🌐 Option B: Remote Setup (API-Based)

Use this setup if you're using **Figma in the browser** or don't have the desktop app. This uses the Figma REST API with a Personal Access Token (PAT).

### Requirements
- ✅ Figma account (free or paid)
- ✅ Personal Access Token (PAT) - Free to generate
- ✅ Read access to the Figma files you want to use

### Step 1: Generate Personal Access Token

1. Go to [figma.com/settings](https://www.figma.com/settings)
2. Scroll to **"Personal access tokens"**
3. Click **"Generate new token"**
4. Copy the token immediately (shown only once)

### Step 2: Configure Figma MCP (Remote)

Add to your `mcp.json`:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-figma"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your-figma-access-token-here"
      }
    }
  }
}
```

> **⚠️ Security:** Never commit your PAT to version control. Consider using environment variables instead.

### Step 3: Configure shadcn MCP

Add the shadcn MCP server:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-figma"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your-figma-access-token-here"
      }
    },
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

### Complete Remote mcp.json

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-figma"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "figd_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      }
    },
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

### Verify Remote Setup

1. **Restart Cursor**
2. Open command palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Type "MCP" and verify Figma tools appear
4. Test by asking AI to fetch a Figma file

---

## 📊 Desktop vs Remote Comparison

| Feature | 🖥️ Desktop Setup | 🌐 Remote Setup |
|---------|------------------|-----------------|
| **Connection** | Local (`127.0.0.1:3845`) | API (REST) |
| **Requires** | Figma desktop app | PAT token |
| **Dev Mode** | Must be enabled | Not required |
| **Speed** | Faster (local) | Depends on network |
| **Best for** | Active design work | CI/CD, automation |
| **Cost** | May need paid plan | Free tier works |

> **💡 Recommendation:** Use **Desktop Setup** for daily development work. Use **Remote Setup** for automation or when desktop app isn't available.

---

> **📍 File Location:**
> - **Windows**: `C:\Users\{username}\.cursor\mcp.json`
> - **macOS**: `~/.cursor/mcp.json`

---

#### 2.3 Initialize shadcn/ui in Your Project

If not already initialized, set up shadcn/ui in your project:

```bash
npx shadcn@latest init
```

Follow the prompts to configure:
- **Style**: Default or New York
- **Base color**: Slate, Gray, Zinc, etc.
- **CSS variables**: Yes (recommended)
- **Tailwind config location**: `tailwind.config.js`
- **Components location**: `src/components/ui`

> **💡 Tip:** The shadcn MCP server will automatically detect your project's `components.json` configuration.

---

## 🔄 End-to-End Workflow

### Workflow Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Figma Design   │────▶│   AI + MCP      │────▶│  Generated      │
│  (URL + Token)  │     │  Processing     │     │  Component      │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
   Extract:               Process:               Output:
   • Design tokens        • Map to shadcn        • Component.tsx
   • Layout specs         • Generate types       • Component.test.tsx
   • Variants             • Apply styles         • index.ts
   • States               • Add accessibility    • Storybook (opt)
```

### Step-by-Step Process

#### 1. Prepare Your Figma Design

Ensure your Figma design is ready:

- [ ] Component is in a named frame or component set
- [ ] Variants are properly organized (if applicable)
- [ ] Design tokens are applied (colors, spacing, typography)
- [ ] States are represented (default, hover, focus, disabled)
- [ ] The design is in a file you have access to
- [ ] **You have Dev Mode access** to copy URLs with node IDs

#### 2. Get the Figma URL (Requires Dev Mode)

> **🔓 Dev Mode Required:** You must enable Dev Mode in Figma to copy the URL with the correct `node-id`. Without Dev Mode, the URL won't include the specific node reference.

**How to enable Dev Mode:**
1. Open your Figma file
2. Click the **"<> Dev Mode"** toggle in the top-right toolbar (or press `Shift + D`)
3. The interface will switch to Dev Mode view

**Copy the Figma URL for your component:**

1. **Enable Dev Mode** (if not already enabled)
2. **Select the component/frame** you want to generate
3. The URL in your browser will automatically update with the `node-id`
4. **Copy the URL** from the browser address bar (or `Ctrl+L` / `Cmd+L` then `Ctrl+C`)

The URL format should be: `https://www.figma.com/design/{file-key}/{file-name}?node-id={node-id}`

**Example URL:**
```
https://www.figma.com/design/ABC123xyz/Design-System?node-id=1234-5678
```

> **💡 Tip:** In Dev Mode, the `node-id` updates automatically as you select different elements. Make sure you have the correct component selected before copying the URL.

#### 3. Run the AI Prompt

Use the [Figma → shadcn Component Prompt](./figma-shadcn-component-prompt) with your Figma URL:

1. Open a new chat in Cursor
2. Paste the prompt template
3. Replace the placeholder with your Figma URL
4. Execute and wait for generation

#### 4. Review Generated Code

The AI will generate:

| File | Description |
|------|-------------|
| `ComponentName.tsx` | Main component implementation |
| `ComponentName.test.tsx` | Unit tests with accessibility checks |
| `index.ts` | Barrel export |

#### 5. Integrate with Sitecore

If integrating with Sitecore XMC:

1. Add Sitecore field types and imports
2. Wrap with `withDatasourceCheck` if needed
3. Update component-map.ts (auto if `npm run dev` running)
4. Test in Experience Editor

---

## 🛠️ Available MCP Tools

### Figma MCP Tools

| Tool | Description | Use Case |
|------|-------------|----------|
| `figma_get_file` | Get full file data | Extract all components |
| `figma_get_node` | Get specific node | Target single component |
| `figma_get_styles` | Get style definitions | Extract design tokens |
| `figma_get_components` | List components | Discover available designs |
| `figma_get_code` | Get code suggestions | Framework-specific output |

### shadcn MCP Tools

| Tool | Description | Use Case |
|------|-------------|----------|
| `shadcn_add_component` | Add a shadcn component | Install base components |
| `shadcn_list_components` | List available components | Discover options |
| `shadcn_get_component` | Get component source | Reference implementation |
| `shadcn_customize` | Customize component | Apply design tokens |

---

## 🎯 Best Practices

### Design Preparation

- ✅ **Use Auto Layout**: Ensures proper spacing extraction
- ✅ **Name layers meaningfully**: Improves AI understanding
- ✅ **Define variants**: Include all states in component sets
- ✅ **Apply design tokens**: Use shared styles for consistency
- ✅ **Include all states**: Default, hover, focus, disabled, active

### Prompt Optimization

- ✅ **Be specific**: Include exact component requirements
- ✅ **Reference existing code**: Point to similar components
- ✅ **Specify tech stack**: Mention Sitecore, Next.js, TypeScript
- ✅ **Include constraints**: Accessibility, performance requirements

### Post-Generation

- ✅ **Review types**: Ensure proper TypeScript interfaces
- ✅ **Test accessibility**: Run axe or similar tools
- ✅ **Verify responsive**: Check breakpoint behavior
- ✅ **Run tests**: Execute generated test suite
- ✅ **Check Sitecore**: Validate Experience Editor support

---

## 🔍 Troubleshooting

### Common Issues

#### Figma MCP Not Connecting

```
Error: Failed to connect to Figma MCP server
```

**Solutions:**
1. Verify access token is valid and not expired
2. Check Cursor MCP settings JSON syntax
3. Restart Cursor completely
4. Ensure network access to Figma API

#### Component Not Found in Figma

```
Error: Node not found in file
```

**Solutions:**
1. Verify the URL contains the correct `node-id`
2. Check file access permissions
3. Ensure the component hasn't been moved/deleted
4. Try copying a fresh URL from Figma

#### shadcn Component Generation Fails

```
Error: Could not generate component
```

**Solutions:**
1. Verify shadcn/ui is initialized in project
2. Check `components.json` configuration
3. Ensure Tailwind CSS is properly configured
4. Verify output directory exists

### Debug Mode

Enable MCP debug logging in Cursor:

1. Open Cursor Settings (`Ctrl+,` / `Cmd+,`)
2. Search for "MCP"
3. Enable **MCP: Debug Logging**
4. Check Developer Tools console for detailed logs

---

## 📚 Related Resources

- [Figma → shadcn Component Prompt](./figma-shadcn-component-prompt) - Ready-to-use prompt template
- [Core Requirements](../templates/core-requirements) - FastLane coding standards
- [Create Component Template](../templates/create-component) - Alternative creation workflow
- [Figma MCP Server Setup](/docs/for-developers/tools-and-advanced/tools/figma-mcp-server-setup) - Detailed Figma setup

---

## 🚀 Next Steps

Ready to generate your first component?

1. ✅ Complete the MCP server setup above
2. ✅ Verify both servers are connected
3. ✅ Copy your Figma design URL
4. 👉 **Use the [Figma → shadcn Component Prompt](./figma-shadcn-component-prompt)**

